import 'server-only'

import { db } from '@/lib/server/db'
import { book_votes } from '@/lib/server/db/schema'

export const updateUserBookVote = async (
    id: string,
    userId: string,
    vote: boolean
) => {
    await db
        .insert(book_votes)
        .values({
            courseId: id,
            userId,
            vote
        })
        .onConflictDoUpdate({
            target: [book_votes.userId, book_votes.courseId],
            set: {
                vote
            }
        })
}
