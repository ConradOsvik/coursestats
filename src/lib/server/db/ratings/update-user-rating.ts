import 'server-only'

import { db } from '@/lib/server/db'
import { ratings } from '@/lib/server/db/schema'

export const updateUserRating = async (
    id: string,
    userId: string,
    rating: number
) => {
    await db
        .insert(ratings)
        .values({
            courseId: id,
            userId,
            rating
        })
        .onConflictDoUpdate({
            target: [ratings.userId, ratings.courseId],
            set: {
                rating
            }
        })
}
