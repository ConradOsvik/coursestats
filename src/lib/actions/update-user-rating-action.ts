'use server'

import { revalidateTag } from 'next/cache'
import { z } from 'zod'

import { authActionClient } from '@/lib/actions/safe-action'
import { updateUserRating } from '@/lib/server/db/ratings/update-user-rating'

const schema = z.object({
    id: z.string(),
    rating: z.number().int().min(0).max(5)
})

export const updateUserRatingAction = authActionClient
    .schema(schema)
    .action(async ({ parsedInput: { id: _id, rating }, ctx: { userId } }) => {
        const id = _id.toUpperCase()

        await updateUserRating(id, userId, rating)
        revalidateTag(`${id}:ratings`)

        return {
            success: 'Rating added'
        }
    })
