import { Suspense } from 'react'

import { getSemesters } from '@/lib/server/db/semesters/get-semesters'

import Stats from './stats'

export default function StatsContainer({ id }: { id: string }) {
    return (
        <div className='flex h-full w-full flex-col gap-4 border-b border-r p-4'>
            <Suspense fallback='loading...'>
                <StatsWrapper id={id} />
            </Suspense>
        </div>
    )
}

async function StatsWrapper({ id }: { id: string }) {
    const data = await getSemesters(id)
    if (data.length === 0)
        return (
            <div className='flex h-full w-full items-center justify-center'>
                <h1 className='text-4xl'>No data found</h1>
            </div>
        )

    const statsData = data.map((item) => {
        const grades = [item.a, item.b, item.c, item.d, item.e, item.f]
        const gradeValues = [5, 4, 3, 2, 1, 0]
        const validGrades = grades.filter((grade) => grade !== null)

        let average: number | undefined
        if (validGrades.length > 0) {
            const totalGrades = validGrades.reduce(
                (acc, curr) => acc + (curr ?? 0),
                0
            )
            const weightedSum = validGrades.reduce((acc, grade, index) => {
                return acc + (grade !== null ? grade * gradeValues[index] : 0)
            }, 0)
            average = Math.round((weightedSum / totalGrades) * 10) / 10
        } else {
            average = undefined
        }

        const totalGrades =
            (item.a ?? 0) +
            (item.b ?? 0) +
            (item.c ?? 0) +
            (item.d ?? 0) +
            (item.e ?? 0) +
            (item.f ?? 0)
        const failurePercentage =
            totalGrades > 0
                ? (item.f ?? 0) / totalGrades
                : (item.failed ?? 0) / ((item.passed ?? 0) + (item.failed ?? 0))
        const roundedFailurePercentage =
            Math.round(failurePercentage * 1000) / 10

        return {
            name: `${item.semester.charAt(0).toUpperCase() + item.semester.slice(1)} ${item.year.toString().slice(-2)}`,
            average: average,
            failurePercentage: roundedFailurePercentage
        }
    })

    return <Stats stats={statsData} />
}
