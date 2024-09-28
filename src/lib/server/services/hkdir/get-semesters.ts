import { formatSemesterData, getData } from './utils'

export const getSemesters = async (courseCode: string) => {
    const data = await getData(courseCode)

    return formatSemesterData(data)
}
