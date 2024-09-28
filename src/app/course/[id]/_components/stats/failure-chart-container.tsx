import { Suspense } from 'react'

import { getSemesters } from '@/lib/server/db/semesters/get-semesters'

import FailureChart from './failure-chart'

export default function FailureChartContainer({ id }: { id: string }) {
    return (
        <div className='flex h-full w-full flex-col border-b border-l border-r p-4'>
            <h1 className='py-2 text-4xl'>Failure rate</h1>
            <Suspense fallback='loading...'>
                <FailureChartWrapper id={id} />
            </Suspense>
        </div>
    )
}

async function FailureChartWrapper({ id }: { id: string }) {
    const data = await getSemesters(id)
    if (data.length === 0)
        return (
            <div className='flex h-full w-full items-center justify-center'>
                <h1 className='text-4xl'>No data found</h1>
            </div>
        )

    const chartData = data.map((item) => {
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
            value: roundedFailurePercentage
        }
    })

    return <FailureChart chartData={chartData} />
}
