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
    const chartData = data.map((item) => {
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

        return {
            name: `${item.semester.charAt(0).toUpperCase() + item.semester.slice(1)} ${item.year.toString().slice(-2)}`,
            value: average
        }
    })

    return <AverageChart chartData={chartData} />
}
