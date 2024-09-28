'use client'

import { useMounted } from '@/hooks/useMounted'
import { selectedSemesterAtom } from '@/stores'
import { useAtom } from 'jotai'

interface Stats {
    name: string
    average: number | undefined
    failurePercentage: number
}

const GRADES = ['F', 'E', 'D', 'C', 'B', 'A']

export default function Stats({ stats }: { stats: Stats[] }) {
    const [selectedSemester, _] = useAtom(selectedSemesterAtom)

    const mounted = useMounted()

    if (!mounted)
        return (
            <>
                <div className='flex h-full items-center justify-start rounded-lg bg-muted p-4'>
                    <h1 className='text-4xl blur-md'>Average grade: 4</h1>
                </div>
                <div className='flex h-full items-center justify-start rounded-lg bg-muted p-4'>
                    <h1 className='text-4xl blur-md'>Failure rate: 20%</h1>
                </div>
            </>
        )

    const average = stats[selectedSemester].average

    return (
        <>
            <div className='flex h-full items-center justify-start rounded-lg bg-muted p-4'>
                <h1 className='text-4xl'>
                    Average grade:{' '}
                    {average
                        ? `${average} (${GRADES[Math.round(average || 0)]})`
                        : 'N/A'}
                </h1>
            </div>
            <div className='flex h-full items-center justify-start rounded-lg bg-muted p-4'>
                <h1 className='text-4xl'>
                    Failure rate: {stats[selectedSemester].failurePercentage}%
                </h1>
            </div>
        </>
    )
}
