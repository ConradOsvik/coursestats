import { unstable_cacheTag as cacheTag } from 'next/cache'
import { db } from '..'

export const getSemestersFromDb = async (
  institutionId: number,
  courseCode: string
) => {
  'use cache'

  cacheTag('semesters')
  cacheTag(`semesters:${institutionId}:${courseCode}`)

  const semesters = await db.query.semesters.findMany({
    where: (semesters, { eq, and }) =>
      and(
        eq(semesters.institutionId, institutionId),
        eq(semesters.courseCode, courseCode)
      ),
    orderBy: (semesters, { desc, asc }) => [
      desc(semesters.year),
      asc(semesters.semester)
    ]
  })

  return semesters
}
