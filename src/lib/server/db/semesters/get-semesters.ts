import { unstable_cache } from 'next/cache'

import { db } from '..'

const INTERNAL__getSemesters = async (id: string) => {
    const semesters = await db.query.semesters.findMany({
        where: (semesters, { eq }) => eq(semesters.courseId, id),
        columns: {
            courseId: false
        }
    })

    return semesters
}

export const getSemesters = (_id: string) => {
    const id = _id.toUpperCase()

    const cachedSemesters = unstable_cache(
        () => INTERNAL__getSemesters(id),
        [`course:${id}:semesters`],
        {
            tags: [`${id}:semesters`]
        }
    )

    const semesters = cachedSemesters()
    return semesters
}
