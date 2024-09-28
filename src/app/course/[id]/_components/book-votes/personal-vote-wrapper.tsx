import { LogIn } from 'lucide-react'

import { auth } from '@/lib/auth'
import { getUserBookVote } from '@/lib/server/db/book-votes/get-user-book-vote'

import SignIn from '@/components/ui/sign-in'

import AverageVote from './average-vote'
import PersonalVote from './personal-vote'
import VoteButton from './vote-button'

export default async function PersonalVoteWrapper({ id }: { id: string }) {
    const session = await auth()
    const userId = session?.user?.id

    if (!userId)
        return (
            <div className='relative flex flex-col items-center justify-center gap-2'>
                <h1 className='pt-2 text-2xl'>Is the course book worth it?</h1>
                <div className='flex items-center justify-center gap-4'>
                    <VoteButton variant='upvote' />
                    <VoteButton variant='downvote' />
                </div>
                <h1 className='pt-2 text-3xl'>Your vote</h1>
                <div className='absolute flex h-full w-full flex-col items-center justify-center backdrop-blur-sm'>
                    <LogIn size={48} />
                    <p className='mt-2'>You are not signed in!</p>
                    <p className=''>Sign in to see your personal rating</p>
                    <SignIn className='mt-2' />
                </div>
            </div>
        )

    const vote = await getUserBookVote(id, userId)

    return (
        <div className='flex flex-col items-center justify-center gap-2'>
            <h1 className='pt-2 text-2xl'>Is the course book worth it?</h1>
            <PersonalVote vote={vote} id={id} />
        </div>
    )
}
