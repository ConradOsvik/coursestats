export const SEMESTERS = ['spring', 'fall'] as const

export const INSTITUTION_TYPES = [
  'university',
  'state_scientific_college',
  'state_college',
  'private_college',
  'private_scientific_college'
] as const

export const API_TYPE_CODE_MAP = {
  '11': 'university',
  '12': 'state_scientific_college',
  '02': 'state_college',
  '82': 'private_college',
  '83': 'private_scientific_college'
} as const satisfies Record<string, (typeof INSTITUTION_TYPES)[number]>

// Map your enum types to display labels
export const INSTITUTION_TYPE_LABELS = {
  university: 'Universities',
  state_scientific_college: 'State Scientific Colleges',
  state_college: 'State Colleges',
  private_college: 'Private Colleges',
  private_scientific_college: 'Private Scientific Colleges'
} as const satisfies Record<(typeof INSTITUTION_TYPES)[number], string>

// Define the desired order for institution type groups
export const INSTITUTION_TYPE_ORDER = [
  'Universities',
  'State Scientific Colleges',
  'Private Scientific Colleges',
  'State Colleges',
  'Private Colleges'
] as const

export const CACHE_TAGS = {
  INSTITUTIONS: 'institutions',
  INSTITUTION: (institutionId: number) => `institution:${institutionId}`,
  COURSES: 'courses',
  COURSE: (courseId: string) => `course:${courseId}`
}
