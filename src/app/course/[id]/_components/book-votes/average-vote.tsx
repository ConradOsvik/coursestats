import VoteButton from './vote-button'

export default function AverageVote({
    variant,
    votes
}: {
    variant: 'upvote' | 'downvote'
    votes: number
}) {
    return (
        <div className='flex flex-col items-center justify-center gap-2'>
            <VoteButton variant={variant} disabled />
            <h1 className='text-4xl'>{votes}</h1>
        </div>
    )
}
