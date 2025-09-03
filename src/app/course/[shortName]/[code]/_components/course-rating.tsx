'use client'

import { useAtom } from 'jotai'
import { useId, useState } from 'react'
import { Button } from '~/components/ui/button'
import { Checkbox } from '~/components/ui/checkbox'
import { Label } from '~/components/ui/label'
import { ToggleGroup, ToggleGroupItem } from '~/components/ui/toggle-group'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '~/components/ui/tooltip'
import { showGendersAtom } from '~/lib/store'

const EMOJIS_WORST_TO_BEST = ['😭', '☹️', '😐', '😀', '🤩'] as const

const questions = [
  {
    id: 'difficulty',
    text: 'How difficult is this course?',
    options: ['Very Easy', 'Easy', 'Moderate', 'Hard', 'Very Hard'],
    order: 'bestToWorst' as const
  },
  {
    id: 'workload',
    text: 'How is the workload?',
    options: ['Very Light', 'Light', 'Moderate', 'Heavy', 'Very Heavy'],
    order: 'bestToWorst' as const
  },
  {
    id: 'overall',
    text: 'Overall rating?',
    options: ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'],
    order: 'worstToBest' as const
  }
]

export function CourseRating() {
  const [ratings, setRatings] = useState<Record<string, number>>({})

  const handleRating = (questionId: string, rating: number) => {
    setRatings((prev) => ({ ...prev, [questionId]: rating }))
  }

  return (
    <div className="flex w-full flex-col-reverse md:w-1/2 md:flex-col">
      <div className="p-4">
        <h3 className="mb-4 text-lg font-semibold">Rate this Course</h3>
        <div className="space-y-6">
          {questions.map((question) => (
            <div key={question.id} className="space-y-3">
              <p className="text-sm font-medium">{question.text}</p>
              <ToggleGroup
                type="single"
                variant="outline"
                className="w-full"
                value={
                  ratings[question.id] !== undefined
                    ? String(ratings[question.id])
                    : ''
                }
                onValueChange={(value) => {
                  if (value === '' || value == null) {
                    setRatings((prev) => {
                      const rest = { ...prev }
                      delete rest[question.id]
                      return rest
                    })
                    return
                  }
                  handleRating(question.id, parseInt(value, 10))
                }}
              >
                {question.options.map((option, index) => {
                  const orderedEmojis =
                    question.order === 'bestToWorst'
                      ? [...EMOJIS_WORST_TO_BEST].reverse()
                      : EMOJIS_WORST_TO_BEST
                  const emoji = orderedEmojis[index]
                  return (
                    <Tooltip key={index}>
                      <TooltipTrigger asChild>
                        <ToggleGroupItem
                          className="flex-1 text-2xl transition-transform hover:scale-[1.12] data-[state=on]:scale-[1.22] md:text-3xl"
                          value={String(index)}
                          aria-label={option}
                        >
                          <span aria-hidden="true">{emoji}</span>
                        </ToggleGroupItem>
                      </TooltipTrigger>
                      <TooltipContent side="top">{option}</TooltipContent>
                    </Tooltip>
                  )
                })}
              </ToggleGroup>
            </div>
          ))}

          <Button
            className="mt-4 w-full"
            disabled={Object.keys(ratings).length < 3}
          >
            Submit Rating
          </Button>

          <div className="bg-muted mt-4 rounded-md p-3">
            <p className="text-muted-foreground text-xs">
              Rating system coming soon! Help other students by sharing your
              experience.
            </p>
          </div>
        </div>
      </div>
      <GenderCheckbox />
    </div>
  )
}

function GenderCheckbox() {
  const [showGenders, setShowGenders] = useAtom(showGendersAtom)

  const id = useId()
  return (
    <div className="border-border relative flex w-full items-start gap-2 border-b border-dashed px-4 py-4 md:border-t md:border-b-0 md:py-6">
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
