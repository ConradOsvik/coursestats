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
