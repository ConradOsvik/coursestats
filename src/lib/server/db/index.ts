import { type Client, createClient } from '@libsql/client'
import { drizzle } from 'drizzle-orm/libsql'
import 'server-only'

import * as schema from './schema'

// const client = createClient({
// 	url: process.env.TURSO_DATABASE_URL!,
// 	authToken: process.env.TURSO_DATABASE_AUTH_TOKEN!,
// })
// export const db = drizzle(client, { schema })

const globalForDb = globalThis as unknown as {
    client: Client | undefined
}

export const client =
    globalForDb.client ??
    createClient({
        url: process.env.TURSO_DATABASE_URL!,
        authToken: process.env.TURSO_DATABASE_AUTH_TOKEN!
    })
if (process.env.NODE_ENV !== 'production') globalForDb.client = client

export const db = drizzle(client, { schema })
