'use client'

import { useOptimisticAction } from 'next-safe-action/hooks'

import { updateUserBookVoteAction } from '@/lib/actions/update-user-book-vote-action'

import VoteButton from './vote-button'

export default function DownvoteButton({
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
                return false
            }
        }
    )

    const handleClick = () => {
        setVote(false)
        execute({
            id,
            vote: false
        })
    }

    return (
        <VoteButton
            variant='downvote'
            vote={vote}
            onClick={handleClick}
            disabled={isPending}
        />
    )
}
