import { Suspense } from 'react'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import AverageVoteWrapper from './average-vote-wrapper'
import PersonalVoteWrapper from './personal-vote-wrapper'

export default function BookVotes({ id }: { id: string }) {
    return (
        <div className='h-full w-full border-b border-r border-t p-2'>
            <Tabs
                defaultValue='average'
                className='flex h-full w-full flex-col items-center justify-start'
            >
                <TabsList className='w-full'>
                    <TabsTrigger className='w-full' value='average'>
                        Average
                    </TabsTrigger>
                    <TabsTrigger className='w-full' value='personal'>
                        Personal
                    </TabsTrigger>
                </TabsList>
                <TabsContent value='average' className='w-full'>
                    <Suspense fallback='loading...'>
                        <AverageVoteWrapper id={id} />
                    </Suspense>
                </TabsContent>
                <TabsContent value='personal' className='w-full'>
                    <Suspense fallback='loading...'>
                        <PersonalVoteWrapper id={id} />
                    </Suspense>
                </TabsContent>
            </Tabs>
        </div>
    )
}
