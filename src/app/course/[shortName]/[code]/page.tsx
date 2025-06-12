import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator
} from '~/components/ui/breadcrumb'
import { getCourseFromDb } from '~/server/db/queries/courses'
import { getInstitutionByShortNameFromDb } from '~/server/db/queries/institutions'

export async function generateMetadata({
  params
}: {
  params: Promise<{ shortName: string; code: string }>
}) {
  const { shortName: _shortName, code: _code } = await params
  const shortName = decodeURIComponent(_shortName)
  const code = decodeURIComponent(_code)

  return {
    title: `coursestats / ${shortName} - ${code.toUpperCase()}`,
    description: `statistics for ${code.toUpperCase()} at ${shortName}`
  }
}

export default async function CoursePage({
  params
}: {
  params: Promise<{ shortName: string; code: string }>
}) {
  const { shortName: _shortName, code: _code } = await params
  const shortName = decodeURIComponent(_shortName)
  const code = decodeURIComponent(_code)

  const institution = await getInstitutionByShortNameFromDb(shortName)

  const course = await getCourseFromDb(institution.id, code)

  return (
    <main>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/course/${shortName}`}>
              {shortName}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/course/${shortName}/${code}`}>
              {code.toUpperCase()}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="mt-8 space-y-6">
        <div>
          <h2 className="mb-2 text-xl font-semibold">Institution</h2>
          <pre className="overflow-x-auto rounded-lg bg-gray-100 p-4">
            <code>{JSON.stringify(institution, null, 2)}</code>
          </pre>
        </div>

        <div>
          <h2 className="mb-2 text-xl font-semibold">Course</h2>
          <pre className="overflow-x-auto rounded-lg bg-gray-100 p-4">
            <code>{JSON.stringify(course, null, 2)}</code>
          </pre>
        </div>
      </div>
    </main>
  )
}
