import { unstable_cacheTag as cacheTag } from 'next/cache'

import { db } from '..'
import { getCourseFromApi, getSemestersFromApi } from '~/server/services/hkdir'
import { notFound } from 'next/navigation'
import { courses, grades, semesters } from '../schema'

export const getCourseFromDb = async (
  institutionId: number,
  courseCode: string
) => {
  'use cache'

  cacheTag('courses')
  cacheTag(`course:${institutionId}:${courseCode}`)

  console.log(
    `Fetching course ${courseCode} for institution ${institutionId} from database`
  )

  let course = await db.query.courses.findFirst({
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

export const addCourse = async (institutionId: number, courseCode: string) => {
  const [courseData, semesterData] = await Promise.all([
    getCourseFromApi(institutionId, courseCode),
    getSemestersFromApi(institutionId, courseCode)
  ])

  if (!courseData || !semesterData) {
    notFound()
  }

  await Promise.all([
    db.insert(courses).values(courseData),
    db.insert(semesters).values(
      semesterData.map((semester) => ({
        institutionId: semester.institutionId,
        courseCode: semester.courseCode,
        year: semester.year,
        semester: semester.semester
      }))
    ),
    db.insert(grades).values(
      semesterData.flatMap((semester) =>
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
    )
  ])
}
