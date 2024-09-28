'use client'

import { selectedSemesterAtom } from '@/stores'
import { useAtom } from 'jotai'
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts'

import {
    type ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent
} from '@/components/ui/chart'

const chartConfig = {
    average: {
        label: 'Average',
        color: 'hsl(var(--chart-primary))'
    }
} satisfies ChartConfig

interface ChartData {
    name: string
    value: number | undefined
}

export default function AverageChart({
    chartData
}: {
    chartData: ChartData[]
}) {
    const [_, setSelectedSemester] = useAtom(selectedSemesterAtom)

    const handleClick = (_: any, event: any) => setSelectedSemester(event.index)

    return (
        <ChartContainer
            config={chartConfig}
            className='h-full min-h-[200px] w-full'
        >
            <LineChart
                accessibilityLayer
                data={chartData}
                margin={{
                    left: -20,
                    right: 20
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
                <Line
                    dataKey='value'
                    type='natural'
                    stroke='var(--color-average)'
                    strokeWidth={2}
                    dot={{
                        fill: 'var(--color-average)'
                    }}
                    activeDot={{
                        r: 6,
                        onClick: handleClick
                    }}
                />
            </LineChart>
        </ChartContainer>
    )
}
