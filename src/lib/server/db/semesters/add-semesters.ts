import { cache } from 'react'
import 'server-only'

import { db } from '@/lib/server/db'
import { semesters } from '@/lib/server/db/schema'
import { getSemesters } from '@/lib/server/services/hkdir/get-semesters'

async function INTERNAL__addSemesters(id: string) {
    const data = await getSemesters(id)

    if (data.length === 0) {
        return
    }

    const dataWithCourseId = data.map((semester) => ({
        courseId: id,
        ...semester
    }))

    await db.insert(semesters).values(dataWithCourseId).onConflictDoNothing()
}

export const addSemesters = cache(INTERNAL__addSemesters)
