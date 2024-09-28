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
    const chartData = data.map((item) => {
        const isGraded = item.a !== null

        if (isGraded) {
            return [
                { name: 'A', value: item.a || 0 },
                { name: 'B', value: item.b || 0 },
                { name: 'C', value: item.c || 0 },
                { name: 'D', value: item.d || 0 },
                { name: 'E', value: item.e || 0 },
                { name: 'F', value: item.f || 0 }
            ]
        } else {
            return [
                { name: 'Passed', value: item.passed || 0 },
                { name: 'Failed', value: item.failed || 0 }
            ]
        }
    })

    const semesters = data.map((item) => `${item.semester} ${item.year}`)

    return <SemesterChart chartData={chartData} semesters={semesters} />
}
