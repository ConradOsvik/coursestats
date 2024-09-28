export type Semester = 'fall' | 'spring'

type FilterType = 'top' | 'all' | 'item' | 'between' | 'like' | 'lessthan'

interface Filter {
    variabel: string
    selection: {
        filter: FilterType
        values: string[]
        exclude?: string[]
    }
}

type Grade = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H'

interface SemesterData {
    Institusjonskode: string
    Institusjonsnavn: string
    Avdelingskode: string
    Avdelingsnavn: string
    Emnekode: string
    Årstall: string
    Semester: string
    Semesternavn: string
    Karakter: Grade
    'Antall kandidater totalt': string
    'Antall kandidater kvinner': string
    'Antall kandidater menn': string
}

interface FormattedSemesterData {
    semester: Semester
    year: number
    a: number | null
    b: number | null
    c: number | null
    d: number | null
    e: number | null
    f: number | null
    passed: number | null
    failed: number | null
}

const getSemesterId = (semester: Semester): number => {
    const semesters = {
        spring: 1,
        fall: 3
    }

    return semesters[semester]
}

const createFilter = (
    name: string,
    filterType: FilterType,
    values: string[],
    exclude: string[] = ['']
): Filter => ({
    variabel: name,
    selection: {
        filter: filterType,
        values,
        exclude
    }
})

const buildQuery = (filter: Filter[]) => ({
    tabell_id: 308,
    api_versjon: 1,
    statuslinje: 'N',
    begrensning: '1000',
    kodetekst: 'J',
    desimal_separator: '.',
    groupBy: [
        'Institusjonskode',
        'Avdelingskode',
        'Emnekode',
        'Årstall',
        'Semester',
        'Karakter'
    ],
    sortBy: ['Institusjonskode', 'Avdelingskode'],
    filter
})

export const getData = async (
    courseCode: string,
    year?: number,
    semester?: Semester
) => {
    const URL = `${process.env.HKDIR_BASE_URL}/api/Tabeller/hentJSONTabellData`

    const filters = [
        createFilter('Institusjonskode', 'item', ['1150']),
        createFilter('Emnekode', 'like', [`${courseCode}-%`])
    ]

    if (year) filters.push(createFilter('Årstall', 'item', [String(year)]))
    if (semester) {
        filters.push(
            createFilter('Semester', 'item', [String(getSemesterId(semester))])
        )
    } else {
        filters.push(createFilter('Semester', 'item', ['1', '3']))
    }

    const query = buildQuery(filters)

    try {
        const res = await fetch(URL, {
            method: 'POST',
            body: JSON.stringify(query),
            headers: {
                'Content-type': 'application/json'
            }
        })

        if (!res.ok) {
            throw new Error('Failed to fetch data')
        }

        if (res.status === 204) {
            return []
        }

        const data = res.json() as Promise<SemesterData[]>

        return data
    } catch (e) {
        console.error(e)
        throw new Error('Failed to fetch data')
    }
}

const initializeSemesterData = (
    year: number,
    semester: Semester
): FormattedSemesterData => ({
    year,
    semester,
    a: null,
    b: null,
    c: null,
    d: null,
    e: null,
    f: null,
    passed: null,
    failed: null
})

const trimCourseCode = (courseCode: string) => {
    const i = courseCode.indexOf('-')
    return i === -1 ? courseCode : courseCode.slice(0, i)
}

const getSemesterFromId = (id: string) => {
    const semesters: { [key: string]: Semester } = {
        '1': 'spring',
        '3': 'fall'
    }

    if (!semesters[id]) throw new Error('Invalid semester id')

    return semesters[id]
}

export const formatSemesterData = (data: SemesterData[]) => {
    const result: Record<string, FormattedSemesterData> = {}

    data.forEach((entry) => {
        const courseCode = trimCourseCode(entry.Emnekode)
        const year = parseInt(entry.Årstall, 10)
        const semester = getSemesterFromId(entry.Semester)

        const key = `${courseCode}-${year}-${semester}`
        if (!result[key]) {
            result[key] = initializeSemesterData(year, semester)
        }

        const formattedEntry = result[key]

        const gradeCount = parseInt(entry['Antall kandidater totalt'], 10)

        switch (entry.Karakter) {
            case 'A':
                formattedEntry.a = (formattedEntry.a ?? 0) + gradeCount
                break
            case 'B':
                formattedEntry.b = (formattedEntry.b ?? 0) + gradeCount
                break
            case 'C':
                formattedEntry.c = (formattedEntry.c ?? 0) + gradeCount
                break
            case 'D':
                formattedEntry.d = (formattedEntry.d ?? 0) + gradeCount
                break
            case 'E':
                formattedEntry.e = (formattedEntry.e ?? 0) + gradeCount
                break
            case 'F':
                formattedEntry.f = (formattedEntry.f ?? 0) + gradeCount
                break
            case 'G':
                formattedEntry.passed =
                    (formattedEntry.passed ?? 0) + gradeCount
                break
            case 'H':
                formattedEntry.failed =
                    (formattedEntry.failed ?? 0) + gradeCount
                break
        }
    })

    return Object.values(result)
}
