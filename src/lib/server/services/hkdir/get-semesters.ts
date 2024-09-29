import { formatSemesterData, getData } from './utils'

export const getSemesters = async (id: string) => {
    const data = await getData(id)

    return formatSemesterData(data)
}
