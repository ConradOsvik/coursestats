import { Suspense } from 'react'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import AverageRatingWrapper from './average-rating-wrapper'
import PersonalRatingWrapper from './personal-rating-wrapper'
import RatingSkeleton from './skeleton'

export default function Rating({ id }: { id: string }) {
    return (
        <div className='h-full w-full border-b border-l border-r border-t p-2'>
            <Tabs
                defaultValue='average'
                className='flex h-full w-full flex-col'
            >
                <TabsList>
                    <TabsTrigger className='w-full' value='average'>
                        Average
                    </TabsTrigger>
                    <TabsTrigger className='w-full' value='personal'>
                        Personal
                    </TabsTrigger>
                </TabsList>
                <TabsContent
                    value='average'
                    className='box-border h-full w-full'
                >
                    <Suspense fallback={<PersonalRatingSkeleton />}>
                        <AverageRatingWrapper id={id} />
                    </Suspense>
                </TabsContent>
                <TabsContent
                    value='personal'
                    className='box-border h-full w-full'
                >
                    <Suspense fallback={<PersonalRatingSkeleton />}>
                        <PersonalRatingWrapper id={id} />
                    </Suspense>
                </TabsContent>
            </Tabs>
        </div>
    )
}

const PersonalRatingSkeleton = () => (
    <div className='relative flex h-full w-full flex-col items-center justify-center'>
        <RatingSkeleton />
    </div>
)
