import { unstable_cache } from 'next/cache'
import 'server-only'

import { db } from '@/lib/server/db'

const INTERNAL__getRatings = async (id: string) => {
    const ratings = await db.query.ratings.findMany({
        where: (ratings, { eq }) => eq(ratings.courseId, id),
        columns: {
            rating: true
        }
    })

    return {
        count: ratings.length,
        average:
            ratings.length > 0
                ? ratings.reduce((acc, { rating }) => acc + rating, 0) /
                  ratings.length
                : 0
    }
}

export const getRatings = async (_id: string) => {
    const id = _id.toUpperCase()

    const cachedRatings = unstable_cache(
        () => INTERNAL__getRatings(id),
        [`course:${id}:ratings`],
        {
            tags: [`${id}:ratings`]
        }
    )

    const ratings = await cachedRatings()
    return ratings
}
