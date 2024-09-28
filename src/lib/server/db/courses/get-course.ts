import { unstable_cache } from 'next/cache'
import 'server-only'

import { db } from '@/lib/server/db'
import { addCourse } from '@/lib/server/db/courses/add-course'

const INTERNAL__getCourse = async (id: string) => {
    let course = await db.query.courses.findFirst({
        where: (courses, { eq }) => eq(courses.id, id)
    })

    if (!course) {
        await addCourse(id)
        course = await db.query.courses.findFirst({
            where: (courses, { eq }) => eq(courses.id, id)
        })

        if (!course) {
            throw new Error(
                `Error fetching course ${id}, please try again later`
            )
        }
    }

    return course
}

export const getCourse = async (_id: string) => {
    const id = _id.toUpperCase()

    const cachedCourse = unstable_cache(
        () => INTERNAL__getCourse(id),
        [`course:${id}`],
        {
            tags: ['course', id]
        }
    )

    const course = await cachedCourse()
    return course
}
