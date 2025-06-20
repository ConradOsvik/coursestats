import { Badge } from '~/components/ui/badge'
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
    <div className="flex w-full flex-col items-start justify-start">
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
      <div className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-bold tracking-tight">
              {code.toUpperCase()}
            </h1>
            <Badge variant="outline" className="text-sm">
              {course.credits} credits
            </Badge>
            <Badge variant="secondary" className="text-sm">
              {course.lang}
            </Badge>
          </div>
          <h2 className="text-muted-foreground text-2xl font-medium">
            {course.name}
          </h2>
          <p className="text-muted-foreground text-lg">
            {course.department} • {institution.name}
          </p>
        </div>
      </div>

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
    </div>
  )
}
