import { config } from 'dotenv'
import type { Config } from 'drizzle-kit'
import { defineConfig } from 'drizzle-kit'

config()

export default defineConfig({
    schema: 'src/lib/server/db/schema.ts',
    dialect: 'sqlite',
    driver: 'turso',
    dbCredentials: {
        url: process.env.TURSO_DATABASE_URL!,
        authToken: process.env.TURSO_DATABASE_AUTH_TOKEN!
    }
}) satisfies Config
