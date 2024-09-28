import { InferInsertModel } from 'drizzle-orm'
import { NextResponse } from 'next/server'

import { db } from '@/lib/server/db'
import { semesters } from '@/lib/server/db/schema'
import { getSemester } from '@/lib/server/services/hkdir/get-semester'
import { Semester } from '@/lib/server/services/hkdir/utils'

export async function GET() {
    const today = new Date()
    const day = today.getDate()
    const month = today.getMonth() + 1
    const year = today.getFullYear()

    if (day !== 16 || (month !== 10 && month !== 2)) {
        return NextResponse.json(
            {
                error: 'Cron job can only be performed on the 16th of October and February'
            },
            { status: 400 }
        )
    }

    let semester: Semester
    let semesterYear: number

    if (month === 10) {
        semester = 'spring'
        semesterYear = year
    } else if (month === 2) {
        semester = 'fall'
        semesterYear = year - 1
    } else {
        return NextResponse.json(
            { error: 'Invalid month for performing cron job to get semester' },
            { status: 400 }
        )
    }

    try {
        const courseIds = await db.query.courses.findMany({
            columns: {
                id: true
            }
        })

        const completeData: InferInsertModel<typeof semesters>[] = []

        for (const { id } of courseIds) {
            const data = await getSemester(id, semesterYear, semester)
            const dataWithCourseId = data.map((semester) => ({
                courseId: id,
                ...semester
            }))
            completeData.push(...dataWithCourseId)
        }

        await db.insert(semesters).values(completeData)
    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        } else {
            return NextResponse.json(
                { error: 'An unknown error occurred' },
                { status: 500 }
            )
        }
    }
}
