import { Star } from 'lucide-react'

import { Skeleton } from '@/components/ui/skeleton'

export default function RatingSkeleton() {
    return (
        <>
            <h1 className='text-4xl'>Your course rating</h1>
            <div className='flex p-4'>
                {[...Array(5)].map((_, i) => {
                    return (
                        <Star
                            key={i}
                            size={64}
                            className='fill-current text-neutral-200 dark:text-neutral-800'
                        />
                    )
                })}
            </div>{' '}
            <Skeleton className='h-12 w-[100px]' />
            <Skeleton className='mt-1 h-6 w-[150px]' />
        </>
    )
}
