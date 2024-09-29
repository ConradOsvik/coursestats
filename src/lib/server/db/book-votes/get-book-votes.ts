import { unstable_cache } from 'next/cache'
import 'server-only'

import { db } from '@/lib/server/db'

const INTERAL__getBookVotes = async (id: string) => {
    const votes = await db.query.book_votes.findMany({
        where: (book_votes, { eq }) => eq(book_votes.courseId, id),
        columns: {
            vote: true
        }
    })

    return {
        upvotes: votes.filter((vote) => vote.vote).length,
        downvotes: votes.filter((vote) => !vote.vote).length
    }
}

export const getBookVotes = async (_id: string) => {
    const id = _id.toUpperCase()

    const cachedBookVotes = unstable_cache(
        () => INTERAL__getBookVotes(id),
        [`course:${id}:book_votes`],
        {
            tags: [`${id}:book_votes`]
        }
    )

    const bookVotes = await cachedBookVotes()
    return bookVotes
}
