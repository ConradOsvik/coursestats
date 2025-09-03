import { Badge } from '~/components/ui/badge'
import { Breadcrumbs } from '~/components/layout/breadcrumbs'
import { getCourseFromDb } from '~/server/db/queries/courses'
import { getInstitutionByShortNameFromDb } from '~/server/db/queries/institutions'
import GradeDistributionChart from './_components/grade-distribution-chart'
import { CourseRating } from './_components/course-rating'
import GradeSummaryChart from './_components/grade-summary-chart'

export async function generateStaticParams() {
  return []
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ shortName: string; code: string }>
}) {
  const { shortName: _shortName, code: _code } = await params
  const shortName = decodeURIComponent(_shortName)
  const code = decodeURIComponent(_code)

  return {
    title: `CourseStats / ${shortName} - ${code.toUpperCase()}`,
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
    <>
      <Breadcrumbs
        className="p-4 pb-0"
        items={[
          { href: '/', label: 'Home' },
          { href: `/course/${shortName}`, label: shortName },
          { label: code.toUpperCase() }
        ]}
      />

      <CourseHeader
        code={code}
        lang={course.lang}
        credits={course.credits}
        name={course.name}
        department={course.department}
        institution={institution.name}
      />

      <div className="border-border flex flex-col items-stretch border-b border-dashed md:flex-row">
        <GradeDistributionChart course={course} />
        <CourseRating />
      </div>
      {/* <ChartSettings course={course} /> */}
      <div className="flex">
        <GradeSummaryChart course={course} />
      </div>

      {/* <div className="grid gap-8 lg:grid-cols-2">
        <GradeDistributionChart course={course} />
        <CourseRating />

        <div className="lg:col-span-2">
          <GradeSummaryChart course={course} />
        </div>
      </div> */}
    </>
  )
}

function CourseHeader({
  code,
  lang,
  credits,
  name,
  department,
  institution
}: {
  code: string
  lang: string
  credits: number
  name: string
  department: string
  institution: string
}) {
  return (
    <div className="border-border flex flex-col gap-2 border-b border-dashed p-4">
      <div className="flex flex-wrap items-center gap-2">
        <Badge
          variant="secondary"
          className="px-2 py-0.5 font-mono text-xs tracking-tight"
        >
          {code.toUpperCase()}
        </Badge>
        <Badge
          variant="outline"
          className="px-2 py-0.5 text-[10px] tracking-wide uppercase"
        >
          {lang}
        </Badge>
        <Badge variant="outline" className="px-2 py-0.5 text-[10px]">
          {credits} credits
        </Badge>
      </div>
      <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
        {name}
      </h1>
      <div className="text-muted-foreground flex flex-wrap items-center gap-2 text-sm">
        <span>{department}</span>
        <div className="bg-border h-4 w-px" />
        <span>{institution}</span>
      </div>
    </div>
  )
}
