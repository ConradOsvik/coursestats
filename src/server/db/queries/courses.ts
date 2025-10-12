import { unstable_cacheTag as cacheTag } from 'next/cache'

import { db } from '..'
import { getCourseFromApi, getSemestersFromApi } from '~/server/services/hkdir'
import { notFound } from 'next/navigation'
import { courses, grades, semesters } from '../schema'
import { and, eq, or, sql } from 'drizzle-orm'
import { isValidCourseCodeFormat } from '~/lib/course-utils'

export type Course = Awaited<ReturnType<typeof getCourseFromDb>>

export const getCourseFromDb = async (
  institutionId: number,
  courseCode: string
) => {
  'use cache'

  cacheTag('courses')
  cacheTag(`course:${institutionId}:${courseCode}`)

  if (!isValidCourseCodeFormat(courseCode)) notFound()

  let course = await db.query.courses.findFirst({
    where: (courses, { eq, and }) =>
      and(
        eq(courses.institutionId, institutionId),
        eq(courses.code, courseCode)
      ),
    with: {
      semesters: {
        orderBy: (semesters, { asc }) => [
          asc(semesters.year),
          asc(semesters.semester)
        ],
        with: {
          grades: true
        }
      }
    }
  })

  if (!course) {
    await addCourse(institutionId, courseCode)

    course = await db.query.courses.findFirst({
      where: (courses, { eq, and }) =>
        and(
          eq(courses.institutionId, institutionId),
          eq(courses.code, courseCode)
        ),
      with: {
        semesters: {
          orderBy: (semesters, { desc, asc }) => [
            desc(semesters.year),
            asc(semesters.semester)
          ],
          with: {
            grades: true
          }
        }
      }
    })

    if (!course) notFound()
  }

  return course
}

export const getAllCoursesForInstitution = async (institutionId: number) => {
  return await db
    .select()
    .from(courses)
    .where(eq(courses.institutionId, institutionId))
}

export const addCourse = async (institutionId: number, courseCode: string) => {
  const [courseData, semesterData] = await Promise.all([
    getCourseFromApi(institutionId, courseCode),
    getSemestersFromApi(institutionId, courseCode)
  ])

  if (!courseData) {
    notFound()
  }

  await db.transaction(async (tx) => {
    await tx.insert(courses).values(courseData)

    if (semesterData.length > 0) {
      await tx.insert(semesters).values(
        semesterData.map((semester) => ({
          institutionId: semester.institutionId,
          courseCode: semester.courseCode,
          year: semester.year,
          semester: semester.semester
        }))
      )

      const allGrades = semesterData.flatMap((semester) =>
        semester.grades.map((grade) => ({
          institutionId: semester.institutionId,
          courseCode: semester.courseCode,
          year: semester.year,
          semester: semester.semester,
          grade: grade.grade,
          count: grade.count,
          womenCount: grade.womenCount,
          menCount: grade.menCount
        }))
      )

      if (allGrades.length > 0) {
        await tx.insert(grades).values(allGrades)
      }
    }
  })
}

export const searchCourseCodesFuzzy = async (
  institutionId: number,
  searchCode: string,
  limit = 10
) => {
  return await db
    .select({
      institutionId: courses.institutionId,
      code: courses.code,
      name: courses.name,
      department: courses.department,
      similarity: sql<number>`jaro_winkler(${courses.code}, ${searchCode})`,
      editDistance: sql<number>`levenshtein(${courses.code}, ${searchCode})`,
      damEditDistance: sql<number>`dlevenshtein(${courses.code}, ${searchCode})`
    })
    .from(courses)
    .where(
      and(
        eq(courses.institutionId, institutionId),
        or(
          sql`jaro_winkler(${courses.code}, ${searchCode}) >= 0.7`,
          sql`levenshtein(${courses.code}, ${searchCode}) <= 2`,
          sql`soundex(${courses.code}) = soundex(${searchCode})`
        )
      )
    )
    .orderBy(
      sql`jaro_winkler(${courses.code}, ${searchCode}) DESC`,
      sql`levenshtein(${courses.code}, ${searchCode}) ASC`
    )
    .limit(limit)
}

export const searchCourseCode = async (courseCode: string, limit = 10) => {
  // Global fuzzy search across all institutions for a given course code.
  // Uses Jaro–Winkler (prefix-friendly) and Damerau–Levenshtein (handles transpositions).
  const searchCode = courseCode
    .toUpperCase()
    .replaceAll('Æ', 'AE')
    .replaceAll('Ø', 'O')
    .replaceAll('Å', 'A')

  const len = searchCode.length
  // Linear scaling thresholds:
  // - Jaro–Winkler min increases with length: 0.70 + 0.04*(len-2), capped at 0.94
  // - Max Damerau–Levenshtein edits: floor(len/4)
  const jwMin = Math.min(0.94, 0.7 + 0.04 * Math.max(0, len - 2))
  const dlMax = len <= 1 ? 0 : Math.ceil(len / 4)

  const lettersMatch = /^([A-Z]+)/.exec(searchCode)
  const letterPrefix = lettersMatch?.[1] ?? ''
  const likePrefix = `${letterPrefix}%`

  const codeAscii = sql`upper(replace(replace(replace(${courses.code}, 'Æ', 'AE'), 'Ø', 'O'), 'Å', 'A'))`

  // Compare query against the code's prefix of the same length for consistent behavior
  const compareLeft = sql`substr(${codeAscii}, 1, ${len})`

  // For 2-4 character inputs, also allow substring containment anywhere
  const allowContains = len >= 2 && len <= 4
  const containsPattern = `%${searchCode}%`

  return await db
    .select({
      institutionId: courses.institutionId,
      code: courses.code,
      name: courses.name,
      department: courses.department,
      similarity: sql<number>`jaro_winkler(${compareLeft}, ${searchCode})`,
      damEditDistance: sql<number>`dlevenshtein(${compareLeft}, ${searchCode})`
    })
    .from(courses)
    .where(
      or(
        sql`jaro_winkler(${compareLeft}, ${searchCode}) >= ${jwMin}`,
        sql`dlevenshtein(${compareLeft}, ${searchCode}) <= ${dlMax}`,
        allowContains ? sql`${codeAscii} LIKE ${containsPattern}` : sql`0`,
        letterPrefix ? sql`${courses.code} LIKE ${likePrefix}` : sql`0`
      )
    )
    .orderBy(
      sql`jaro_winkler(${compareLeft}, ${searchCode}) DESC`,
      sql`dlevenshtein(${codeAscii}, ${searchCode}) ASC`,
      letterPrefix
        ? sql`CASE WHEN ${courses.code} LIKE ${likePrefix} THEN 0 ELSE 1 END`
        : sql`0`
    )
    .limit(limit)
}
