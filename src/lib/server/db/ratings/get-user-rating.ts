import { cache } from 'react'
import 'server-only'

import { db } from '@/lib/server/db'

const INTERNAL__getUserRating = async (_id: string, userId: string) => {
    const id = _id.toUpperCase()
    const rating = await db.query.ratings.findFirst({
        where: (ratings, { eq, and }) =>
            and(eq(ratings.userId, userId), eq(ratings.courseId, id)),
        columns: {
            rating: true
        }
    })

    return rating?.rating
}

export const getUserRating = cache(INTERNAL__getUserRating)
