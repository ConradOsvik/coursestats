'use client'

import { selectedSemesterAtom } from '@/stores'
import { useAtom } from 'jotai'
import { useEffect, useMemo, useState } from 'react'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'

import {
    type ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent
} from '@/components/ui/chart'
import { Slider } from '@/components/ui/slider'

const chartConfig = {
    semester: {
        label: 'Semester',
        color: 'hsl(var(--chart-primary))'
    }
} satisfies ChartConfig

interface ChartRow {
    name: string
    value: number
}

type ChartData = ChartRow[]

export default function SemesterChart({
    chartData,
    semesters
}: {
    chartData: ChartData[]
    semesters: string[]
}) {
    const [selectedSemester, setSelectedSemester] =
        useAtom(selectedSemesterAtom)

    useEffect(() => setSelectedSemester(chartData.length - 1), [chartData])

    const selectedData = useMemo(
        () => chartData[selectedSemester],
        [chartData, selectedSemester]
    )

    return (
        <>
            <h1 className='py-2 text-4xl capitalize'>
                {semesters[selectedSemester]}
            </h1>
            <ChartContainer
                config={chartConfig}
                className='h-full min-h-[200px] w-full'
            >
                <BarChart
                    accessibilityLayer
                    data={selectedData}
                    margin={{
                        left: -20,
                        right: 10
                    }}
                >
                    <CartesianGrid vertical={false} />
                    <XAxis
                        dataKey='name'
                        tickLine={false}
                        axisLine={false}
                        tickMargin={10}
                    />
                    <YAxis tickLine={false} axisLine={false} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar
                        dataKey='value'
                        radius={4}
                        fill='var(--color-semester)'
                    />
                </BarChart>
            </ChartContainer>
            <div className='p-2'>
                <Slider
                    min={0}
                    max={chartData.length - 1}
                    step={1}
                    value={[selectedSemester]}
                    onValueChange={(value) => setSelectedSemester(value[0])}
                />
            </div>
        </>
    )
}
