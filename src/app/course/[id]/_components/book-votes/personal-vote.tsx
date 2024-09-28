'use client'

import { useState } from 'react'

import DownvoteButton from './downvote-button'
import UpvoteButton from './upvote-button'

export default function PersonalVote({
    vote: currentVote,
    id
}: {
    vote: boolean | undefined
    id: string
}) {
    const [vote, setVote] = useState(currentVote)

    return (
        <>
            <div className='flex items-center justify-center gap-4'>
                <UpvoteButton vote={vote} setVote={setVote} id={id} />
                <DownvoteButton vote={vote} setVote={setVote} id={id} />
            </div>
            <h1 className='pt-2 text-3xl'>
                Your vote: {vote === undefined ? 'No vote' : vote ? '👍' : '👎'}
            </h1>
        </>
    )
}
