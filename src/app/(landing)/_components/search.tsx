'use client'

import { useRouter } from 'next/navigation'
import {
  type ChangeEvent,
  type FormEvent,
  type KeyboardEvent,
  useEffect,
  useRef,
  useState,
  useCallback
} from 'react'
import { useTypewriter } from 'react-simple-typewriter'
import { Check, ChevronsUpDown } from 'lucide-react'
import { Input } from '~/components/ui/input'
import { Button } from '~/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '~/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '~/components/ui/popover'
import { cn } from '~/lib/utils'
import { useAtom } from 'jotai'
import { selectedInstitutionAtom } from '~/lib/store'
import { useHasMounted } from '~/hooks/useHasMounted'
import { INSTITUTION_TYPE_ORDER } from '~/lib/constants'
import {
  groupInstitutionsByType,
  type Institution
} from '~/lib/institution-utils'
import { searchCoursesAction } from './actions'

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

type CourseSuggestion = {
  institutionId: number
  code: string
  name: string
  department: string
  similarity: number
  editDistance: number
  damEditDistance: number
}

export default function Search({
  institutions
}: {
  institutions: Institution[]
}) {
  const [search, setSearch] = useState('')
  const [selectedInstitution, setSelectedInstitution] = useAtom(
    selectedInstitutionAtom
  )
  const [open, setOpen] = useState(false)
  const [courseSuggestions, setCourseSuggestions] = useState<
    CourseSuggestion[]
  >([])
  const [courseSuggestionsOpen, setCourseSuggestionsOpen] = useState(false)
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)
  const commandRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const debouncedSearch = useDebounce(search, 300)

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  const [placeholder] = useTypewriter({
    words: ['TMA4100', 'TDT4110', 'TDT4100'],
    delaySpeed: 1500,
    loop: false
  })

  const fetchCourseSuggestions = useCallback(
    async (searchTerm: string, institutionShortName: string) => {
      if (
        !searchTerm.trim() ||
        searchTerm.length < 2 ||
        !institutionShortName
      ) {
        setCourseSuggestions([])
        return
      }

      const institution = institutions.find(
        (inst) => inst.shortName === institutionShortName
      )
      if (!institution) return

      setIsLoadingSuggestions(true)
      try {
        const suggestions = await searchCoursesAction(
          institution.id,
          searchTerm.toUpperCase(),
          8
        )
        setCourseSuggestions(suggestions)
        setCourseSuggestionsOpen(suggestions.length > 0)
      } catch (error) {
        console.error('Failed to fetch course suggestions:', error)
        setCourseSuggestions([])
      } finally {
        setIsLoadingSuggestions(false)
      }
    },
    [institutions]
  )

  useEffect(() => {
    void fetchCourseSuggestions(debouncedSearch, selectedInstitution)
  }, [debouncedSearch, selectedInstitution, fetchCourseSuggestions])

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setSearch(value)

    if (value.length >= 2 && selectedInstitution) {
      setCourseSuggestionsOpen(true)
    } else {
      setCourseSuggestionsOpen(false)
    }
  }

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (courseSuggestionsOpen && courseSuggestions.length > 0) {
      if (event.key === 'ArrowDown') {
        event.preventDefault()
        const firstItem = commandRef.current?.querySelector('[tabindex="0"]')
        if (firstItem instanceof HTMLElement) {
          firstItem.focus()
        }
      } else if (event.key === 'ArrowUp') {
        event.preventDefault()
        const items = commandRef.current?.querySelectorAll('[tabindex="0"]')
        const lastItem = items?.[items.length - 1]
        if (lastItem instanceof HTMLElement) {
          lastItem.focus()
        }
      } else if (event.key === 'Escape') {
        setCourseSuggestionsOpen(false)
        inputRef.current?.focus()
      }
    }
  }

  const handleCommandItemKeyDown = (
    event: KeyboardEvent<HTMLDivElement>,
    courseCode: string
  ) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      handleCourseSuggestionSelect(courseCode)
    } else if (event.key === 'Escape') {
      event.preventDefault()
      setCourseSuggestionsOpen(false)
      inputRef.current?.focus()
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      const currentItem = event.currentTarget
      const prevItem = currentItem.previousElementSibling
      if (
        prevItem instanceof HTMLElement &&
        prevItem.hasAttribute('tabindex')
      ) {
        prevItem.focus()
      }
    } else if (event.key === 'ArrowDown') {
      event.preventDefault()
      const currentItem = event.currentTarget
      const nextItem = currentItem.nextElementSibling
      if (
        nextItem instanceof HTMLElement &&
        nextItem.hasAttribute('tabindex')
      ) {
        nextItem.focus()
      }
    }
  }

  const handleSuggestionsBlur = (event: React.FocusEvent) => {
    const currentTarget = event.currentTarget
    const relatedTarget = event.relatedTarget

    if (!currentTarget.contains(relatedTarget as Node)) {
      setTimeout(() => {
        setCourseSuggestionsOpen(false)
      }, 150)
    }
  }

  const handleInstitutionChange = (value: string) => {
    setSelectedInstitution(value)
    setOpen(false)
    setCourseSuggestions([])
    setCourseSuggestionsOpen(false)
  }

  const handleCourseSuggestionSelect = (courseCode: string) => {
    setSearch(courseCode)
    setCourseSuggestionsOpen(false)
    if (selectedInstitution) {
      router.push(
        `/course/${encodeURIComponent(selectedInstitution)}/${encodeURIComponent(courseCode)}`
      )
    }
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (search && selectedInstitution) {
      const upperCaseSearch = search.toUpperCase()
      setCourseSuggestionsOpen(false)
      router.push(
        `/course/${encodeURIComponent(selectedInstitution)}/${encodeURIComponent(upperCaseSearch)}`
      )
    }
  }

  const handleInputFocus = () => {
    if (search.length >= 2 && selectedInstitution) {
      setCourseSuggestionsOpen(true)
    }
  }

  const handleInputBlur = (event: React.FocusEvent) => {
    const relatedTarget = event.relatedTarget

    if (commandRef.current?.contains(relatedTarget as Node)) {
      return
    }

    setTimeout(() => {
      setCourseSuggestionsOpen(false)
    }, 150)
  }

  const mounted = useHasMounted()

  const groupedInstitutions = groupInstitutionsByType(institutions)

  const selectedInstitutionData = institutions.find(
    (inst) => inst.shortName === selectedInstitution
  )

  return (
    <div className="relative">
      <form
        onSubmit={handleSubmit}
        className="bg-background flex rounded-md shadow-xs"
      >
        <div className="relative flex-1">
          <Input
            className="-me-px rounded-e-none uppercase shadow-none focus-visible:z-10"
            placeholder={placeholder}
            value={search}
            ref={inputRef}
            type="text"
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            autoComplete="off"
          />

          {/* Course suggestions popover */}
          {mounted && selectedInstitution && (
            <Popover
              open={courseSuggestionsOpen}
              onOpenChange={setCourseSuggestionsOpen}
            >
              <PopoverTrigger asChild>
                <div />
              </PopoverTrigger>
              <PopoverContent
                className="p-0"
                align="start"
                side="bottom"
                style={{ width: inputRef.current?.offsetWidth }}
                onOpenAutoFocus={(e) => e.preventDefault()}
                onBlur={handleSuggestionsBlur}
              >
                <Command ref={commandRef} shouldFilter={false} loop={false}>
                  <CommandList>
                    {isLoadingSuggestions ? (
                      <div className="text-muted-foreground p-4 text-sm">
                        Loading suggestions...
                      </div>
                    ) : courseSuggestions.length === 0 ? (
                      <CommandEmpty>No course suggestions found.</CommandEmpty>
                    ) : (
                      <CommandGroup heading="Course Suggestions">
                        {courseSuggestions.map((course) => (
                          <CommandItem
                            key={`${course.institutionId}-${course.code}`}
                            onSelect={() =>
                              handleCourseSuggestionSelect(course.code)
                            }
                            onKeyDown={(e) =>
                              handleCommandItemKeyDown(e, course.code)
                            }
                            className="focus:bg-accent focus:text-accent-foreground hover:bg-accent hover:text-accent-foreground flex cursor-pointer flex-col items-start p-3"
                            tabIndex={0}
                          >
                            <div className="flex w-full items-center justify-between">
                              <span className="font-mono text-sm font-semibold">
                                {course.code}
                              </span>
                              <span className="text-muted-foreground text-xs">
                                {Math.round(course.similarity * 100)}% match
                              </span>
                            </div>
                            <span className="text-muted-foreground line-clamp-1 text-sm">
                              {course.name}
                            </span>
                            {course.department && (
                              <span className="text-muted-foreground text-xs">
                                {course.department}
                              </span>
                            )}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    )}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          )}
        </div>

        {mounted && (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="text-muted-foreground hover:text-foreground w-fit justify-between rounded-s-none shadow-none"
              >
                {selectedInstitution
                  ? (selectedInstitutionData?.shortName ?? selectedInstitution)
                  : 'Select institution...'}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0">
              <Command>
                <CommandInput placeholder="Search institutions..." />
                <CommandList>
                  <CommandEmpty>No institution found.</CommandEmpty>
                  {INSTITUTION_TYPE_ORDER.map((typeLabel) => {
                    const insts = groupedInstitutions[typeLabel]
                    if (!insts || insts.length === 0) return null

                    return (
                      <CommandGroup key={typeLabel} heading={typeLabel}>
                        {insts.map((institution) => (
                          <CommandItem
                            key={institution.id}
                            value={`${institution.shortName} ${institution.name}`}
                            onSelect={() =>
                              handleInstitutionChange(institution.shortName)
                            }
                          >
                            <Check
                              className={cn(
                                'mr-2 h-4 w-4',
                                selectedInstitution === institution.shortName
                                  ? 'opacity-100'
                                  : 'opacity-0'
                              )}
                            />
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {institution.shortName}
                              </span>
                              <span className="text-muted-foreground text-xs break-words">
                                {institution.name}
                              </span>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    )
                  })}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        )}
      </form>
    </div>
  )
}
