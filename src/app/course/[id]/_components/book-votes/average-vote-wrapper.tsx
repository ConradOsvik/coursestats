import { UsersRound } from 'lucide-react'

import { getBookVotes } from '@/lib/server/db/book-votes/get-book-votes'

import AverageVote from './average-vote'

export default async function AverageVoteWrapper({ id }: { id: string }) {
    const votes = await getBookVotes(id)
    const count = votes.upvotes + votes.downvotes

    return (
        <div className='flex flex-col items-center justify-center'>
            <h1 className='pt-2 text-2xl'>Is the course book worth it?</h1>
            <div className='flex items-center justify-center gap-4 pt-2'>
                <AverageVote variant='upvote' votes={votes.upvotes} />
                <AverageVote variant='downvote' votes={votes.downvotes} />
            </div>
            <div className='flex items-center justify-center'>
                <UsersRound size={18} className='mr-2' />
                <p className='text-lg'>
                    {count} {count === 1 ? 'rating' : 'ratings'}
                </p>
            </div>
        </div>
    )
}
