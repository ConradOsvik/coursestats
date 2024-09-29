import { Suspense } from 'react'

import { getSemesters } from '@/lib/server/db/semesters/get-semesters'

import SemesterChart from './semester-chart'

export default function SemesterChartContainer({ id }: { id: string }) {
    return (
        <div className='flex h-full w-full flex-col border-b border-l border-r p-4'>
            <Suspense fallback='loading...'>
                <SemesterChartWrapper id={id} />
            </Suspense>
        </div>
    )
}

async function SemesterChartWrapper({ id }: { id: string }) {
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

        if (isGraded) {
            return [
                { name: 'A', value: item.a },
                { name: 'B', value: item.b },
                { name: 'C', value: item.c },
                { name: 'D', value: item.d },
                { name: 'E', value: item.e },
                { name: 'F', value: item.f }
            ]
        } else {
            return [
                { name: 'Passed', value: item.passed },
                { name: 'Failed', value: item.failed }
            ]
        }
    })

    const semesters = data.map((item) => `${item.semester} ${item.year}`)

    return <SemesterChart chartData={chartData} semesters={semesters} />
}
