'use client'

import { useOptimisticAction } from 'next-safe-action/hooks'

import { updateUserBookVoteAction } from '@/lib/actions/update-user-book-vote-action'

import VoteButton from './vote-button'

export default function UpvoteButton({
    vote,
    setVote,
    id
}: {
    vote: boolean | undefined
    setVote: (vote: boolean) => void
    id: string
}) {
    const { execute, isPending } = useOptimisticAction(
        updateUserBookVoteAction,
        {
            currentState: vote,
            updateFn: () => {
                return true
            }
        }
    )

    const handleClick = () => {
        setVote(true)
        execute({
            id,
            vote: true
        })
    }

    return (
        <VoteButton
            variant='upvote'
            vote={vote}
            onClick={handleClick}
            disabled={isPending}
        />
    )
}
