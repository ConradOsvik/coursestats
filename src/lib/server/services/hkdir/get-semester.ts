import {
    type Semester,
    formatSemesterData,
    getData
} from '@/lib/server/services/hkdir/utils'

export const getSemester = async (
    courseCode: string,
    year: number,
    semester: Semester
) => {
    const data = await getData(courseCode, year, semester)

    return formatSemesterData(data)
}
