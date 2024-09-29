import {
    DEFAULT_SERVER_ERROR_MESSAGE,
    createSafeActionClient
} from 'next-safe-action'

import { auth } from '../auth'

export const actionClient = createSafeActionClient({
    handleServerError: (e) => {
        if (e instanceof Error) return e.message

        return DEFAULT_SERVER_ERROR_MESSAGE
    }
})

export const authActionClient = actionClient.use(async ({ next }) => {
    const session = await auth()
    const userId = session?.user?.id

    if (!userId) throw new Error('Unauthorized')

    return next({ ctx: { userId } })
})
