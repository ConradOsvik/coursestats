import { extractCourseCode } from '~/lib/course-utils'
import { api, createFilter } from './api'

interface CourseApiResponse {
  Institusjonskode: string
  Avdelingsnavn: string
  Emnekode: string
  Emnenavn: string
  Studiepoeng: string
  'Underv.språk': string
}

interface SemesterApiResponse {
  Emnekode: string
  Årstall: string
  Semester: string
  Karakter: string
  'Antall kandidater totalt': string
  'Antall kandidater kvinner': string
  'Antall kandidater menn': string
}

export interface CourseData {
  institutionId: number
  code: string
  department: string
  name: string
  credits: number
  lang: string
}

export interface GradeData {
  institutionId: number
  courseCode: string
  year: number
  semester: string
  grade: string
  count: number
  womenCount: number
  menCount: number
}

export interface SemesterData {
  institutionId: number
  courseCode: string
  year: number
  semester: 'spring' | 'fall'
  grades: GradeData[]
}

const languageMap: Record<string, string> = {
  NOR: 'NO',
  ENG: 'EN'
}

const searchCourseWithPattern = async (
  institutionId: number,
  pattern: string
): Promise<CourseApiResponse[]> => {
  try {
    return await api<CourseApiResponse[]>({
      tabell_id: 208,
      variabler: ['*'],
      sortBy: ['Institusjonskode', 'Emnekode'],
      filter: [
        createFilter({
          variabel: 'Institusjonskode',
          filter: 'item',
          values: [String(institutionId)]
        }),
        createFilter({
          variabel: 'Emnekode',
          filter: 'like',
          values: [pattern]
        }),
        createFilter({
          variabel: 'Årstall',
          filter: 'top',
          values: ['1']
        })
      ]
    })
  } catch (error) {
    console.error(`Failed to search courses with pattern ${pattern}:`, error)
    return []
  }
}

const searchSemesterWithPattern = async (
  institutionId: number,
  pattern: string
): Promise<SemesterApiResponse[]> => {
  try {
    return await api<SemesterApiResponse[]>({
      tabell_id: 308,
      groupBy: ['Emnekode', 'Årstall', 'Semester', 'Karakter'],
      sortBy: ['Årstall', 'Semester', 'Karakter'],
      filter: [
        createFilter({
          variabel: 'Institusjonskode',
          filter: 'item',
          values: [String(institutionId)]
        }),
        createFilter({
          variabel: 'Emnekode',
          filter: 'like',
          values: [pattern]
        }),
        createFilter({
          variabel: 'Semester',
          filter: 'item',
          values: ['1', '3']
        })
      ]
    })
  } catch (error) {
    console.error(`Failed to search semesters with pattern ${pattern}:`, error)
    return []
  }
}

export const getCourseFromApi = async (
  institutionId: number,
  courseCode: string
) => {
  const baseCode = extractCourseCode(courseCode)

  let courseData = await searchCourseWithPattern(institutionId, courseCode)

  if (courseData.length === 0 && courseCode === baseCode) {
    courseData = await searchCourseWithPattern(institutionId, `${baseCode}-%`)
  }

  if (courseData.length === 0) {
    courseData = await searchCourseWithPattern(institutionId, `${baseCode}%`)

    courseData = courseData.filter((course) => {
      const extractedCode = extractCourseCode(course.Emnekode)
      return extractedCode === baseCode
    })
  }

  const latest = courseData[courseData.length - 1]
  if (!latest) return null

  return {
    institutionId,
    code: extractCourseCode(latest.Emnekode),
    department: latest.Avdelingsnavn,
    name: latest.Emnenavn,
    credits: Number(latest.Studiepoeng),
    lang: languageMap[latest['Underv.språk']] ?? latest['Underv.språk']
  }
}

export const getSemestersFromApi = async (
  institutionId: number,
  courseCode: string
) => {
  const baseCode = extractCourseCode(courseCode)

  let semesterData = await searchSemesterWithPattern(institutionId, courseCode)

  if (semesterData.length === 0 && courseCode === baseCode) {
    semesterData = await searchSemesterWithPattern(
      institutionId,
      `${baseCode}-%`
    )
  }

  if (semesterData.length === 0) {
    semesterData = await searchSemesterWithPattern(
      institutionId,
      `${baseCode}%`
    )

    semesterData = semesterData.filter((entry) => {
      const extractedCode = extractCourseCode(entry.Emnekode)
      return extractedCode === baseCode
    })
  }

  const semesterMap = new Map<string, SemesterData>()

  for (const entry of semesterData) {
    const year = parseInt(entry.Årstall, 10)
    const semester = entry.Semester === '1' ? 'spring' : 'fall'
    const key = `${year}-${semester}`

    if (!semesterMap.has(key)) {
      semesterMap.set(key, {
        institutionId,
        courseCode,
        year,
        semester,
        grades: []
      })
    }

    const semesterEntry = semesterMap.get(key)!
    semesterEntry.grades.push({
      institutionId,
      courseCode,
      year,
      semester,
      grade: entry.Karakter,
      count: parseInt(entry['Antall kandidater totalt'], 10) || 0,
      womenCount: parseInt(entry['Antall kandidater kvinner'], 10) || 0,
      menCount: parseInt(entry['Antall kandidater menn'], 10) || 0
    })
  }

  return Array.from(semesterMap.values())
}
