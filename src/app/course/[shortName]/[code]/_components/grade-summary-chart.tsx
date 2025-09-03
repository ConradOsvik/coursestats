'use client'

import { useAtom } from 'jotai'
import { useMemo } from 'react'
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig
} from '~/components/ui/chart'
import { showGendersAtom } from '~/lib/store'
import { type Course } from '~/server/db/queries/courses'

export default function GradeSummaryChart({ course }: { course: Course }) {
  const [showGenders] = useAtom(showGendersAtom)

  type ChartDatum = {
    semester: string
    avgTotal: number
    avgMen: number
    avgWomen: number
    failTotal: number
    failMen: number
    failWomen: number
  }

  const chartData = useMemo<ChartDatum[]>(() => {
    const letterGrades = ['A', 'B', 'C', 'D', 'E', 'F'] as const
    const gradePoints: Record<string, number> = {
      A: 5,
      B: 4,
      C: 3,
      D: 2,
      E: 1,
      F: 0,
      G: 3, // Passed in fallback system
      H: 0 // Failed in fallback system
    }

    return course.semesters.map<ChartDatum>((s) => {
      const hasLetterGrades = s.grades.some(
        (g) =>
          (letterGrades as readonly string[]).includes(g.grade) && g.count > 0
      )

      // Average grade (total and per gender)
      const computeAverage = (
        useLetters: boolean,
        gender?: 'men' | 'women'
      ) => {
        const relevantGrades = useLetters
          ? s.grades.filter((g) =>
              (letterGrades as readonly string[]).includes(g.grade)
            )
          : s.grades.filter((g) => g.grade === 'G' || g.grade === 'H')

        const totalStudents = relevantGrades.reduce((sum, g) => {
          const c =
            gender === 'men'
              ? g.menCount
              : gender === 'women'
                ? g.womenCount
                : g.count
          return sum + c
        }, 0)

        if (totalStudents === 0) return 0

        const totalPoints = relevantGrades.reduce((sum, g) => {
          const c =
            gender === 'men'
              ? g.menCount
              : gender === 'women'
                ? g.womenCount
                : g.count
          return sum + (gradePoints[g.grade] ?? 0) * c
        }, 0)

        return totalPoints / totalStudents
      }

      // Failure rate (F if letter grades present, otherwise H)
      const computeFailureRate = (
        useLetters: boolean,
        gender?: 'men' | 'women'
      ) => {
        const failureGrade = useLetters ? 'F' : 'H'
        const totalStudents = s.grades.reduce((sum, g) => {
          const c =
            gender === 'men'
              ? g.menCount
              : gender === 'women'
                ? g.womenCount
                : g.count
          return sum + c
        }, 0)
        if (totalStudents === 0) return 0
        const failures = s.grades.reduce((sum, g) => {
          if (g.grade !== failureGrade) return sum
          const c =
            gender === 'men'
              ? g.menCount
              : gender === 'women'
                ? g.womenCount
                : g.count
          return sum + c
        }, 0)
        return (failures / totalStudents) * 100
      }

      const avgTotal = computeAverage(hasLetterGrades)
      const avgMen = computeAverage(hasLetterGrades, 'men')
      const avgWomen = computeAverage(hasLetterGrades, 'women')

      const failTotal = computeFailureRate(hasLetterGrades)
      const failMen = computeFailureRate(hasLetterGrades, 'men')
      const failWomen = computeFailureRate(hasLetterGrades, 'women')

      return {
        semester: `${s.year} ${s.semester.charAt(0).toUpperCase() + s.semester.slice(1)}`,
        avgTotal: Number(avgTotal.toFixed(2)),
        avgMen: Number(avgMen.toFixed(2)),
        avgWomen: Number(avgWomen.toFixed(2)),
        failTotal: Number(failTotal.toFixed(1)),
        failMen: Number(failMen.toFixed(1)),
        failWomen: Number(failWomen.toFixed(1))
      }
    })
  }, [course.semesters])

  const chartConfig = {
    avgTotal: {
      label: 'Average grade (Total)',
      color: 'oklch(62.3% 0.214 259.815)'
    },
    avgMen: {
      label: 'Average grade (Men)',
      color: 'oklch(62.3% 0.214 259.815)'
    },
    avgWomen: {
      label: 'Average grade (Women)',
      color: 'oklch(62.3% 0.214 259.815)'
    },
    failTotal: {
      label: 'Failure % (Total)',
      color: 'oklch(63.7% 0.237 25.331)'
    },
    failMen: { label: 'Failure % (Men)', color: 'oklch(63.7% 0.237 25.331)' },
    failWomen: {
      label: 'Failure % (Women)',
      color: 'oklch(63.7% 0.237 25.331)'
    }
  } satisfies ChartConfig

  const yAxisRightMax = useMemo(() => {
    type FailKeys = 'failTotal' | 'failMen' | 'failWomen'
    const series: FailKeys[] = showGenders
      ? ['failMen', 'failWomen']
      : ['failTotal']
    const maxVal = Math.max(
      0,
      ...chartData.map((d) => Math.max(...series.map((k) => d[k])))
    )
    const rounded = Math.ceil(maxVal / 5) * 5
    return Math.max(25, rounded)
  }, [chartData, showGenders])

  if (!chartData.length) {
    return null
  }

  return (
    <ChartContainer
      config={chartConfig}
      className="w-full max-w-full overflow-x-hidden p-4"
    >
      <LineChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="semester"
          tickLine={false}
          tickMargin={8}
          axisLine={false}
          tickFormatter={(value: string) => value.split(' ')[1] ?? ''}
        />
        <YAxis
          yAxisId="left"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          domain={[0, 5]}
          tickFormatter={(value: number) => {
            const map: Record<number, string> = {
              0: 'F',
              1: 'E',
              2: 'D',
              3: 'C',
              4: 'B',
              5: 'A'
            }
            return map[value] ?? value.toString()
          }}
          width={24}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          domain={[0, yAxisRightMax]}
          tickFormatter={(v) => `${v}%`}
          width={36}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent indicator="line" className="w-[180px]" />
          }
        />
        <ChartLegend content={<ChartLegendContent />} />
        {showGenders && (
          <Line
            name="Average (Men)"
            type="natural"
            yAxisId="left"
            dataKey="avgMen"
            stroke="var(--color-avgMen)"
            strokeWidth={2}
            dot={false}
          />
        )}
        {showGenders && (
          <Line
            name="Average (Women)"
            type="natural"
            yAxisId="left"
            dataKey="avgWomen"
            stroke="var(--color-avgWomen)"
            strokeDasharray="8 4"
            strokeWidth={2}
            dot={false}
          />
        )}
        {showGenders && (
          <Line
            name="Failure % (Men)"
            type="natural"
            yAxisId="right"
            dataKey="failMen"
            stroke="var(--color-failMen)"
            strokeWidth={2}
            dot={false}
          />
        )}
        {showGenders && (
          <Line
            name="Failure % (Women)"
            type="natural"
            yAxisId="right"
            dataKey="failWomen"
            stroke="var(--color-failWomen)"
            strokeDasharray="8 4"
            strokeWidth={2}
            dot={false}
          />
        )}
        {!showGenders && (
          <Line
            name="Average (Total)"
            type="natural"
            yAxisId="left"
            dataKey="avgTotal"
            stroke="var(--color-avgTotal)"
            strokeWidth={2}
            dot={false}
          />
        )}
        {!showGenders && (
          <Line
            name="Failure % (Total)"
            type="natural"
            yAxisId="right"
            dataKey="failTotal"
            stroke="var(--color-failTotal)"
            strokeWidth={2}
            dot={false}
          />
        )}
      </LineChart>
    </ChartContainer>
  )
}
