import {
  INSTITUTION_TYPE_LABELS,
  INSTITUTION_TYPE_ORDER,
  type INSTITUTION_TYPES
} from './constants'

// Type for institution with required fields
export type Institution = {
  id: number
  shortName: string
  name: string
  type: (typeof INSTITUTION_TYPES)[number]
}

// Get display label for institution type
export const getInstitutionTypeLabel = (
  type: (typeof INSTITUTION_TYPES)[number]
) => {
  return INSTITUTION_TYPE_LABELS[type] || 'Other'
}

// Group institutions by type
export const groupInstitutionsByType = (institutions: Institution[]) => {
  return institutions.reduce(
    (acc, institution) => {
      const typeLabel = getInstitutionTypeLabel(institution.type)
      if (!acc[typeLabel]) {
        acc[typeLabel] = []
      }
      acc[typeLabel].push(institution)
      return acc
    },
    {} as Record<string, Institution[]>
  )
}

// Sort institutions by type order (preserving original order within each type)
export const sortInstitutionsByTypeOrder = (institutions: Institution[]) => {
  const typeOrder: (typeof INSTITUTION_TYPES)[number][] = [
    'university',
    'state_scientific_college',
    'private_scientific_college',
    'state_college',
    'private_college'
  ]

  return institutions.sort((a, b) => {
    const aTypeIndex = typeOrder.indexOf(a.type)
    const bTypeIndex = typeOrder.indexOf(b.type)

    if (aTypeIndex !== bTypeIndex) {
      return aTypeIndex - bTypeIndex
    }

    // Preserve original order within the same type
    return 0
  })
}

// Get institutions in display order (flattened by type order)
export const getInstitutionsInDisplayOrder = (institutions: Institution[]) => {
  const grouped = groupInstitutionsByType(institutions)
  const result: Institution[] = []

  INSTITUTION_TYPE_ORDER.forEach((typeLabel) => {
    const insts = grouped[typeLabel]
    if (insts && insts.length > 0) {
      result.push(...insts)
    }
  })

  return result
}
