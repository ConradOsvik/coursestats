import { getAllCoursesForInstitution } from '~/server/db/queries/courses'
import { getInstitutionsFromDb } from '~/server/db/queries/institutions'
import { env } from '~/env'

export default async function sitemap() {
  const institutions = await getInstitutionsFromDb()

  const coursesPromises = institutions.map((institution) =>
    getAllCoursesForInstitution(institution.id).then((courses) => ({
      institution,
      courses
    }))
  )

  const institutionCourses = await Promise.all(coursesPromises)

  const urls = institutionCourses.flatMap(({ institution, courses }) =>
    courses.map((course) => ({
      url: `${env.SITE_URL}/course/${institution.shortName}/${course.code}`,
      lastModified: course.updatedAt
    }))
  )

  return urls
}
