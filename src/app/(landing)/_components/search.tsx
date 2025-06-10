'use client'

import { useRouter } from 'next/navigation'
import {
  type ChangeEvent,
  type FormEvent,
  useEffect,
  useRef,
  useState
} from 'react'
import { useTypewriter } from 'react-simple-typewriter'
import { Input } from '~/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '~/components/ui/select'
import { useAtom } from 'jotai'
import { selectedInstitutionAtom } from '~/lib/store'
import { useHasMounted } from '~/hooks/useHasMounted'

export default function Search({
  institutions
}: {
  institutions: { id: number; shortName: string; name: string }[]
}) {
  const [search, setSearch] = useState('')
  const [selectedInstitution, setSelectedInstitution] = useAtom(
    selectedInstitutionAtom
  )
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

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

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value)
  }

  const handleInstitutionChange = (value: string) => {
    setSelectedInstitution(value)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    router.push(`/course/${selectedInstitution}/${search.toUpperCase()}`)
  }

  const mounted = useHasMounted()

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-background flex rounded-md shadow-xs"
    >
      <Input
        className="-me-px rounded-e-none uppercase shadow-none focus-visible:z-10"
        placeholder={placeholder}
        value={search}
        ref={inputRef}
        type="text"
        onChange={handleInputChange}
      />
      {mounted && (
        <Select
          value={selectedInstitution}
          onValueChange={handleInstitutionChange}
        >
          <SelectTrigger className="text-muted-foreground hover:text-foreground w-fit rounded-s-none shadow-none">
            <SelectValue placeholder="Select an institution" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Institutions</SelectLabel>
              {institutions.map((institution) => (
                <SelectItem key={institution.id} value={institution.shortName}>
                  {institution.shortName}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      )}
    </form>
  )
}
