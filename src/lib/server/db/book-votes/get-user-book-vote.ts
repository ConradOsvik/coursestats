import { cache } from 'react'
import 'server-only'

import { db } from '@/lib/server/db'

const INTERNAL__getUserBookVotes = async (_id: string, userId: string) => {
    const id = _id.toUpperCase()
    const vote = await db.query.book_votes.findFirst({
        where: (book_votes, { eq, and }) =>
            and(eq(book_votes.userId, userId), eq(book_votes.courseId, id)),
        columns: {
            vote: true
        }
    })

    return vote?.vote
}

export const getUserBookVote = cache(INTERNAL__getUserBookVotes)
