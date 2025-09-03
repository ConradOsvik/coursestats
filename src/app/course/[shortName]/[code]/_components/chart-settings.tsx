'use client'

import { useAtom } from 'jotai'
import { useId } from 'react'
import { Checkbox } from '~/components/ui/checkbox'
import { Label } from '~/components/ui/label'
import { Slider } from '~/components/ui/slider'
import { selectedSemesterAtom, showGendersAtom } from '~/lib/store'
import { type Course } from '~/server/db/queries/courses'

export default function ChartSettings({ course }: { course: Course }) {
  return (
    <div className="border-border flex flex-col gap-4 border-b border-dashed md:flex-row md:gap-6">
      <SemesterSlider course={course} />
      <GenderCheckbox />
    </div>
  )
}

function SemesterSlider({ course }: { course: Course }) {
  const [selectedSemester, setSelectedSemester] = useAtom(selectedSemesterAtom)
  const currentSemester = course.semesters[selectedSemester]

  return (
    <div className="border-border flex w-full flex-col justify-center gap-2 border-b border-dashed p-4 md:border-none">
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
        className="[&_[data-slot=slider-thumb]]:bg-background [&_[data-slot=slider-range]]:bg-[oklch(62.3%_0.214_259.815)] [&_[data-slot=slider-thumb]]:h-6 [&_[data-slot=slider-thumb]]:w-2.5 [&_[data-slot=slider-thumb]]:border-[3px] [&_[data-slot=slider-thumb]]:border-[oklch(62.3%_0.214_259.815)] [&_[data-slot=slider-thumb]]:shadow-none [&_[data-slot=slider-thumb]]:ring-offset-0"
      />
    </div>
  )
}

function GenderCheckbox() {
  const [showGenders, setShowGenders] = useAtom(showGendersAtom)

  const id = useId()
  return (
    <div className="relative flex w-full items-start gap-2 rounded-md p-4">
      <Checkbox
        id={id}
        className="order-1 after:absolute after:inset-0 data-[state=checked]:border-[oklch(62.3%_0.214_259.815)] data-[state=checked]:bg-[oklch(62.3%_0.214_259.815)] data-[state=checked]:text-white"
        aria-describedby={`${id}-description`}
        checked={showGenders}
        onCheckedChange={(checked) =>
          setShowGenders(checked === 'indeterminate' ? false : checked)
        }
      />
      <div className="grid grow gap-2">
        <Label htmlFor={id}>Show gender distribution </Label>
        <p id={`${id}-description`} className="text-muted-foreground text-xs">
          If enabled, the chart will show the gender distribution of the grades.
        </p>
      </div>
    </div>
  )
}
