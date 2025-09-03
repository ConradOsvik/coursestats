'use client'

import { useAtom } from 'jotai'
import { useEffect, useMemo } from 'react'
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '~/components/ui/chart'
import { Label } from '~/components/ui/label'
import { Slider } from '~/components/ui/slider'
import { selectedSemesterAtom, showGendersAtom } from '~/lib/store'
import { type Course } from '~/server/db/queries/courses'

export default function GradeDistributionChart({ course }: { course: Course }) {
  const [selectedSemester, setSelectedSemester] = useAtom(selectedSemesterAtom)
  const [showGenders] = useAtom(showGendersAtom)

  useEffect(
    () => setSelectedSemester(course.semesters.length - 1),
    [setSelectedSemester, course.semesters.length]
  )

  const chartData = useMemo(() => {
    const semester = course.semesters[selectedSemester]
    if (!semester) return []

    const grades = semester.grades

    const letterGrades = ['A', 'B', 'C', 'D', 'E', 'F'] as const
    const hasLetterGrades = grades.some(
      (g) =>
        letterGrades.includes(g.grade as (typeof letterGrades)[number]) &&
        g.count > 0
    )

    if (hasLetterGrades) {
      // Show only A–F if any present
      return letterGrades
        .map((lg) => {
          const g = grades.find((x) => x.grade === lg)
          return {
            grade: lg,
            total: g?.count ?? 0,
            men: g?.menCount ?? 0,
            women: g?.womenCount ?? 0
          }
        })
        .filter((d) => d.total > 0 || d.men > 0 || d.women > 0)
    }

    // Fallback to Passed/Failed using G/H
    const g = grades.find((x) => x.grade === 'G')
    const h = grades.find((x) => x.grade === 'H')

    return [
      {
        grade: 'Passed',
        total: g?.count ?? 0,
        men: g?.menCount ?? 0,
        women: g?.womenCount ?? 0
      },
      {
        grade: 'Failed',
        total: h?.count ?? 0,
        men: h?.menCount ?? 0,
        women: h?.womenCount ?? 0
      }
    ].filter((d) => d.total > 0 || d.men > 0 || d.women > 0)
  }, [course.semesters, selectedSemester])

  const chartConfig = {
    total: {
      label: 'Total',
      color: 'oklch(62.3% 0.214 259.815)'
    },
    men: {
      label: 'Men',
      color: 'oklch(62.3% 0.214 259.815)'
    },
    women: {
      label: 'Women',
      color: 'oklch(70.2% 0.183 293.541)'
    }
  }

  type VerticalBarLabelRendererOptions = {
    thresholdPx?: number
    insideFill?: string
    outsideFill?: string
    outsideOffset?: number
    insideInset?: number
    fontSizePx?: number
  }

  function makeVerticalBarLabelRenderer(
    options: VerticalBarLabelRendererOptions = {}
  ) {
    const {
      thresholdPx = 22,
      insideFill = 'white',
      outsideFill = 'currentColor',
      outsideOffset = 8,
      insideInset = 14,
      fontSizePx = 12
    } = options

    function BarLabel(raw: unknown) {
      if (raw === null || typeof raw !== 'object') return null
      const obj = raw as Record<string, unknown>

      const x = typeof obj.x === 'number' ? obj.x : 0
      const y = typeof obj.y === 'number' ? obj.y : 0
      const width = typeof obj.width === 'number' ? obj.width : 0
      const height = typeof obj.height === 'number' ? obj.height : 0
      const value =
        typeof obj.value === 'number' || typeof obj.value === 'string'
          ? obj.value
          : undefined

      const isTiny = height < thresholdPx

      const labelX = x + width / 2
      const labelY = isTiny
        ? y - outsideOffset
        : y + Math.min(height, insideInset)

      return (
        <text
          x={labelX}
          y={labelY}
          textAnchor="middle"
          dominantBaseline={isTiny ? 'auto' : 'middle'}
          fill={isTiny ? outsideFill : insideFill}
          fontSize={fontSizePx}
        >
          {value}
        </text>
      )
    }
    BarLabel.displayName = 'BarLabel'
    return BarLabel
  }

  return (
    <div className="border-border flex w-full flex-col border-b border-dashed md:w-1/2 md:border-r md:border-b-0">
      <ChartContainer
        config={chartConfig}
        className="h-full min-h-[400px] w-full max-w-full overflow-x-hidden p-4"
      >
        <BarChart accessibilityLayer data={chartData} margin={{ top: 24 }}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="grade"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
          />
          <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
          {showGenders && (
            <Bar dataKey="men" fill="var(--color-men)" radius={4}>
              <LabelList
                dataKey="men"
                content={makeVerticalBarLabelRenderer()}
              />
            </Bar>
          )}
          {showGenders && (
            <Bar dataKey="women" fill="var(--color-women)" radius={4}>
              <LabelList
                dataKey="women"
                content={makeVerticalBarLabelRenderer()}
              />
            </Bar>
          )}
          {!showGenders && (
            <Bar dataKey="total" fill="var(--color-total)" radius={4}>
              <LabelList
                dataKey="total"
                content={makeVerticalBarLabelRenderer()}
              />
            </Bar>
          )}
        </BarChart>
      </ChartContainer>
      <SemesterSlider course={course} />
    </div>
  )
}

function SemesterSlider({ course }: { course: Course }) {
  const [selectedSemester, setSelectedSemester] = useAtom(selectedSemesterAtom)
  const currentSemester = course.semesters[selectedSemester]

  return (
    <div className="border-border flex w-full flex-col justify-center gap-2 border-t border-dashed p-4">
      <div className="flex items-start justify-between">
        <Label>Semester</Label>
        <span className="font-medium capitalize">
          {currentSemester?.semester} {currentSemester?.year}
        </span>
      </div>
      <Slider
        value={[selectedSemester]}
        onValueChange={(value) => setSelectedSemester(value[0] ?? 0)}
        max={course.semesters.length - 1}
        min={0}
        step={1}
        className="[&_[data-slot=slider-thumb]]:bg-background py-2 [&_[data-slot=slider-range]]:bg-[oklch(62.3%_0.214_259.815)] [&_[data-slot=slider-thumb]]:h-6 [&_[data-slot=slider-thumb]]:w-2.5 [&_[data-slot=slider-thumb]]:border-[3px] [&_[data-slot=slider-thumb]]:border-[oklch(62.3%_0.214_259.815)] [&_[data-slot=slider-thumb]]:shadow-none [&_[data-slot=slider-thumb]]:ring-offset-0"
      />
    </div>
  )
}
