import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

export const selectedInstitutionAtom = atomWithStorage<string>(
  'selectedInstitution',
  'NTNU'
)
export const selectedSemesterAtom = atom(0)

export const showGendersAtom = atom(false)
