'use server'

import { revalidateTag } from 'next/cache'
import { z } from 'zod'

import { updateUserBookVote } from '@/lib/server/db/book-votes/update-user-book-vote'

import { authActionClient } from './safe-action'

const schema = z.object({
    id: z.string(),
    vote: z.boolean()
})

export const updateUserBookVoteAction = authActionClient
    .schema(schema)
    .action(async ({ parsedInput: { id: _id, vote }, ctx: { userId } }) => {
        const id = _id.toUpperCase()

        await updateUserBookVote(id, userId, vote)
        revalidateTag(`${id}:book_votes`)

        return {
            success: 'Vote added'
        }
    })
