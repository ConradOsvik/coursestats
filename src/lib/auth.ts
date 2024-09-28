import { DrizzleAdapter } from '@auth/drizzle-adapter'
import NextAuth from 'next-auth'
import Discord from 'next-auth/providers/discord'
import { useSession as _useSession } from 'next-auth/react'
import { cache } from 'react'

import { db } from '@/lib/server/db'
import {
    accounts,
    sessions,
    users,
    verificationTokens
} from '@/lib/server/db/schema'

const {
    handlers,
    signIn,
    signOut,
    auth: _auth
} = NextAuth({
    adapter: DrizzleAdapter(db, {
        usersTable: users,
        accountsTable: accounts,
        sessionsTable: sessions,
        verificationTokensTable: verificationTokens
    }),
    providers: [Discord]
})

const auth = cache(_auth)
const useSession = cache(_useSession)

export { handlers, signIn, signOut, auth, useSession }
