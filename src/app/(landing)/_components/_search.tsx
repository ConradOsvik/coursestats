'use client'

import {
  useMemo,
  useRef,
  useState,
  useEffect,
  type ChangeEvent,
  type FormEvent,
  type KeyboardEvent
} from 'react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { ArrowRight } from 'lucide-react'
import { type Institution } from '~/lib/institution-utils'
import { searchCourseAction } from '../actions'
import { useTypewriter } from 'react-simple-typewriter'
import { cn } from '~/lib/utils'

type CourseSuggestion = {
  institutionId: number
  code: string
  name: string
  department: string
  similarity: number
  damEditDistance: number
}

function useDebounce<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState<T>(value)

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delayMs)
    return () => clearTimeout(id)
  }, [value, delayMs])

  return debounced
}

export default function Search({
  institutions
}: {
  institutions: Institution[]
}) {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)
  const [activeIndex, setActiveIndex] = useState<number>(-1)

  const debouncedQuery = useDebounce(query, 300)

  const [placeholder] = useTypewriter({
    words: ['TMA4100', 'TDT4110', 'TDT4100'],
    delaySpeed: 1500,
    loop: false
  })

  const idToShortName = useMemo(() => {
    const map = new Map<number, string>()
    for (const inst of institutions) {
      map.set(inst.id, inst.shortName)
    }
    return map
  }, [institutions])

  const { data: suggestions = [], isLoading } = useQuery({
    queryKey: ['globalCourseSuggestions', debouncedQuery],
    queryFn: async () => {
      if (!debouncedQuery.trim()) return [] as CourseSuggestion[]
      const res = await searchCourseAction({
        courseCode: debouncedQuery.toUpperCase(),
        limit: 8
      })
      return (res?.data as CourseSuggestion[]) ?? []
    },
    enabled: Boolean(debouncedQuery.trim()),
    staleTime: 5 * 60 * 1000
  })

  const shouldShow = focused && (isLoading || suggestions.length > 0)

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
    setActiveIndex(-1)
  }

  const goToCourse = (s: CourseSuggestion | undefined) => {
    if (!s) return
    const short = idToShortName.get(s.institutionId)
    if (!short) return
    router.push(
      `/course/${encodeURIComponent(short)}/${encodeURIComponent(s.code)}`
    )
  }

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (activeIndex >= 0 && suggestions[activeIndex]) {
      goToCourse(suggestions[activeIndex])
      return
    }
    goToCourse(suggestions[0])
  }

  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!shouldShow || suggestions.length === 0) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((prev) => {
        if (prev < 0) return 0
        return Math.min(prev + 1, suggestions.length - 1)
      })
      return
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((prev) => {
        if (prev <= 0) return 0
        return prev - 1
      })
      return
    }

    if (e.key === 'Enter') {
      if (activeIndex >= 0 && suggestions[activeIndex]) {
        e.preventDefault()
        goToCourse(suggestions[activeIndex])
      }
      return
    }

    if (e.key === 'Escape') {
      setFocused(false)
      setActiveIndex(-1)
    }
  }

  return (
    <div className="relative w-full">
      <form
        onSubmit={onSubmit}
        className={cn(
          'bg-background ring-ring/50 border-input focus-within:border-ring flex flex-col rounded-md border transition-shadow focus-within:ring-3',
          shouldShow && ''
        )}
      >
        <div className="flex items-center justify-stretch">
          <input
            ref={inputRef}
            value={query}
            onChange={onChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 100)}
            onKeyDown={handleInputKeyDown}
            placeholder={placeholder}
            className="placeholder:text-muted-foreground w-full p-4 text-lg uppercase outline-none placeholder:normal-case"
          />
          <button
            type="submit"
            className="bg-foreground text-background transition-[color, opacity] m-2 flex aspect-square h-11 cursor-pointer items-center justify-center rounded-sm duration-150 outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!query.trim()}
          >
            <ArrowRight />
          </button>
        </div>
        {shouldShow && (
          <div className="max-h-72 overflow-y-auto rounded-b-md px-2 pb-2">
            {isLoading && (
              <div className="text-muted-foreground p-3 text-sm">Loading…</div>
            )}
            {!isLoading && suggestions.length === 0 && (
              <div className="text-muted-foreground p-3 text-sm">
                No matches
              </div>
            )}
            {!isLoading && suggestions.length > 0 && (
              <ul className="divide-border border-border divide-y border-t">
                {suggestions.map((s, index) => {
                  const short = idToShortName.get(s.institutionId)
                  const isLast = index === suggestions.length - 1
                  return (
                    <li key={`${s.institutionId}-${s.code}`}>
                      <button
                        type="button"
                        className={cn(
                          'hover:bg-accent hover:text-accent-foreground flex w-full items-start gap-3 p-4 text-left',
                          index === activeIndex &&
                            'bg-accent text-accent-foreground',
                          isLast && 'rounded-b-md'
                        )}
                        onMouseDown={(e) => e.preventDefault()}
                        onMouseEnter={() => setActiveIndex(index)}
                        onClick={() => goToCourse(s)}
                      >
                        <div className="min-w-24 font-mono text-sm font-semibold">
                          {s.code}
                          {short ? (
                            <span className="text-muted-foreground ml-2">
                              {short}
                            </span>
                          ) : null}
                        </div>
                        <div className="text-muted-foreground flex-1 text-sm">
                          {s.name}
                        </div>
                        <div className="text-muted-foreground ml-3 shrink-0 text-xs">
                          {Math.round((s.similarity ?? 0) * 100)}%
                        </div>
                      </button>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        )}
      </form>
    </div>
  )
}
