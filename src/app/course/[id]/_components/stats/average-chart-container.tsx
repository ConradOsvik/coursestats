import { Suspense } from 'react'

import { getSemesters } from '@/lib/server/db/semesters/get-semesters'

import AverageChart from './average-chart'

export default function AverageChartContainer({ id }: { id: string }) {
    return (
        <div className='flex h-full w-full flex-col border-b border-l border-r p-4'>
            <h1 className='py-2 text-4xl'>Average grade</h1>
            <Suspense fallback='loading...'>
                <AverageChartWrapper id={id} />
            </Suspense>
        </div>
    )
}

async function AverageChartWrapper({ id }: { id: string }) {
    const data = await getSemesters(id)
    if (data.length === 0)
        return (
            <div className='flex h-full w-full items-center justify-center'>
                <h1 className='text-4xl'>No data found</h1>
            </div>
        )

    const chartData = data.map((item) => {
        const isGraded =
            item.a !== 0 ||
            item.b !== 0 ||
            item.c !== 0 ||
            item.d !== 0 ||
            item.e !== 0 ||
            item.f !== 0

        let average: number | undefined = undefined

        if (isGraded) {
            const grades = [item.a, item.b, item.c, item.d, item.e, item.f]
            const gradeValues = [5, 4, 3, 2, 1, 0]

            const weightedSum = grades.reduce(
                (acc, grade, index) => acc + grade * gradeValues[index],
                0
            )

            const totalGrades = grades.reduce((acc, curr) => acc + curr, 0)

            average = Math.round((weightedSum / totalGrades) * 10) / 10
        }

        return {
            name: `${item.semester.charAt(0).toUpperCase() + item.semester.slice(1)} ${item.year.toString().slice(-2)}`,
            value: average
        }
    })

    return <AverageChart chartData={chartData} />
}
