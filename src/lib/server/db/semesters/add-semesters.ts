import 'server-only'

import { db } from '@/lib/server/db'
import { semesters } from '@/lib/server/db/schema'
import { getSemesters } from '@/lib/server/services/hkdir/get-semesters'

export async function addSemesters(id: string) {
    const data = await getSemesters(id)

    const dataWithCourseId = data.map((semester) => ({
        courseId: id,
        ...semester
    }))

    await db.insert(semesters).values(dataWithCourseId)
}
