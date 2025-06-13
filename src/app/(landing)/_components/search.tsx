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
import { useQuery } from '@tanstack/react-query'
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

    return () => clearTimeout(handler)
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

// Separate suggestion list component
function SuggestionList({
  suggestions,
  isLoading,
  onSelect,
  selectedIndex,
  onMouseEnter
}: {
  suggestions: CourseSuggestion[]
  isLoading: boolean
  onSelect: (code: string) => void
  selectedIndex: number
  onMouseEnter: (index: number) => void
}) {
  if (isLoading) {
    return (
      <div className="text-muted-foreground p-4 text-sm">
        Loading suggestions...
      </div>
    )
  }

  if (suggestions.length === 0) {
    return (
      <div className="text-muted-foreground p-4 text-sm">
        No course suggestions found.
      </div>
    )
  }

  return (
    <div className="max-h-[300px] overflow-y-auto">
      <div className="p-2">
        <div className="text-muted-foreground mb-2 text-xs font-medium">
          Course Suggestions
        </div>
        {suggestions.map((course, index) => (
          <div
            key={`${course.institutionId}-${course.code}`}
            className={cn(
              'flex cursor-pointer flex-col items-start rounded-sm p-3 transition-colors',
              'hover:bg-accent hover:text-accent-foreground',
              selectedIndex === index && 'bg-accent text-accent-foreground'
            )}
            onClick={() => onSelect(course.code)}
            onMouseEnter={() => onMouseEnter(index)}
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
          </div>
        ))}
      </div>
    </div>
  )
}

// Institution selector component
function InstitutionSelector({
  institutions,
  selectedInstitution,
  onSelect
}: {
  institutions: Institution[]
  selectedInstitution: string
  onSelect: (institution: string) => void
}) {
  const [open, setOpen] = useState(false)
  const mounted = useHasMounted()

  const groupedInstitutions = groupInstitutionsByType(institutions)
  const selectedInstitutionData = institutions.find(
    (inst) => inst.shortName === selectedInstitution
  )

  if (!mounted) return null

  return (
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
                      onSelect={() => {
                        onSelect(institution.shortName)
                        setOpen(false)
                      }}
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
  )
}

// Main search component
export default function Search({
  institutions
}: {
  institutions: Institution[]
}) {
  const [search, setSearch] = useState('')
  const [selectedInstitution, setSelectedInstitution] = useAtom(
    selectedInstitutionAtom
  )
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)

  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)
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

  // Use TanStack Query for course suggestions
  const { data: courseSuggestions = [], isLoading: isLoadingSuggestions } =
    useQuery({
      queryKey: ['courseSuggestions', debouncedSearch, selectedInstitution],
      queryFn: async () => {
        if (!debouncedSearch.trim() || !selectedInstitution) {
          return []
        }

        const institution = institutions.find(
          (inst) => inst.shortName === selectedInstitution
        )
        if (!institution) return []

        return await searchCoursesAction(
          institution.id,
          debouncedSearch.toUpperCase(),
          8
        )
      },
      enabled: Boolean(debouncedSearch.trim() && selectedInstitution),
      staleTime: 5 * 60 * 1000 // 5 minutes
    })

  const shouldShowSuggestions = Boolean(
    selectedInstitution &&
      (courseSuggestions.length > 0 || isLoadingSuggestions)
  )

  // Handle input changes
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setSearch(value)
    setSelectedIndex(-1)

    if (selectedInstitution) {
      setShowSuggestions(true)
    } else {
      setShowSuggestions(false)
    }
  }

  // Handle keyboard navigation
  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || courseSuggestions.length === 0) {
      return
    }

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        setSelectedIndex((prev) =>
          prev < courseSuggestions.length - 1 ? prev + 1 : prev
        )
        break
      case 'ArrowUp':
        event.preventDefault()
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev))
        break
      case 'Enter':
        event.preventDefault()
        if (selectedIndex >= 0 && courseSuggestions[selectedIndex]) {
          handleCourseSuggestionSelect(courseSuggestions[selectedIndex].code)
        } else if (search) {
          submitSearch()
        }
        break
      case 'Escape':
        setShowSuggestions(false)
        setSelectedIndex(-1)
        break
    }
  }

  // Handle suggestion selection
  const handleCourseSuggestionSelect = (courseCode: string) => {
    setSearch(courseCode)
    setShowSuggestions(false)
    setSelectedIndex(-1)
    if (selectedInstitution) {
      router.push(
        `/course/${encodeURIComponent(selectedInstitution)}/${encodeURIComponent(courseCode)}`
      )
    }
  }

  // Extract form submission logic
  const submitSearch = () => {
    if (search && selectedInstitution) {
      const upperCaseSearch = search.toUpperCase()
      setShowSuggestions(false)
      router.push(
        `/course/${encodeURIComponent(selectedInstitution)}/${encodeURIComponent(upperCaseSearch)}`
      )
    }
  }

  // Handle form submission
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    submitSearch()
  }

  // Handle input focus - don't close suggestions, only open if should show
  const handleInputFocus = () => {
    if (shouldShowSuggestions) {
      setShowSuggestions(true)
    }
  }

  // Handle institution change
  const handleInstitutionChange = (institution: string) => {
    setSelectedInstitution(institution)
    setShowSuggestions(false)
    setSelectedIndex(-1)
  }

  // Handle mouse enter on suggestions
  const handleSuggestionMouseEnter = (index: number) => {
    setSelectedIndex(index)
  }

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      const inputElement = inputRef.current
      const suggestionsElement = suggestionsRef.current

      if (
        inputElement &&
        suggestionsElement &&
        !inputElement.contains(target) &&
        !suggestionsElement.contains(target)
      ) {
        setShowSuggestions(false)
        setSelectedIndex(-1)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

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
            autoComplete="off"
          />

          {/* Simple suggestions dropdown */}
          {showSuggestions && shouldShowSuggestions && (
            <div
              ref={suggestionsRef}
              className="bg-popover absolute top-full right-0 left-0 z-50 mt-1 rounded-md border shadow-md"
              style={{ width: inputRef.current?.offsetWidth }}
            >
              <SuggestionList
                suggestions={courseSuggestions}
                isLoading={isLoadingSuggestions}
                onSelect={handleCourseSuggestionSelect}
                selectedIndex={selectedIndex}
                onMouseEnter={handleSuggestionMouseEnter}
              />
            </div>
          )}
        </div>

        <InstitutionSelector
          institutions={institutions}
          selectedInstitution={selectedInstitution}
          onSelect={handleInstitutionChange}
        />
      </form>
    </div>
  )
}
