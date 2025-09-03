import { getAllCoursesForInstitution } from '~/server/db/queries/courses'
import { getInstitutionsFromDb } from '~/server/db/queries/institutions'
import { env } from '~/env'

export default async function sitemap() {
  const institutions = await getInstitutionsFromDb()

  // Create base URL with proper protocol handling
  const baseUrl = env.VERCEL_URL
    ? `https://${env.VERCEL_URL}`
    : 'http://localhost:3000' // fallback for local dev

  const coursesPromises = institutions.map((institution) =>
    getAllCoursesForInstitution(institution.id).then((courses) => ({
      institution,
      courses
    }))
  )

  const institutionCourses = await Promise.all(coursesPromises)

  const urls = institutionCourses.flatMap(({ institution, courses }) =>
    courses.map((course) => ({
      url: `${baseUrl}/course/${institution.shortName}/${course.code}`,
      lastModified: course.updatedAt
    }))
  )

  return urls
}
