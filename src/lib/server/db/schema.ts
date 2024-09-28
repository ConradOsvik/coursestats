import {
    index,
    integer,
    primaryKey,
    sqliteTableCreator,
    text
} from 'drizzle-orm/sqlite-core'
import type { AdapterAccountType } from 'next-auth/adapters'
import { ulid } from 'ulid'

const coursestats = sqliteTableCreator((name) => `coursestats_${name}`)

export const courses = coursestats(
    'course',
    {
        id: text('id').primaryKey().notNull(),
        name: text('name').notNull()
    },
    (courses) => ({
        idx: index('code_idx').on(courses.id)
    })
)

export const semesters = coursestats('semester', {
    id: text('id')
        .primaryKey()
        .$defaultFn(() => ulid()),
    courseId: text('courseId')
        .notNull()
        .references(() => courses.id, { onDelete: 'cascade' }),
    year: integer('year').notNull(),
    semester: text('semester', { enum: ['fall', 'spring'] }).notNull(),
    a: integer('a'),
    b: integer('b'),
    c: integer('c'),
    d: integer('d'),
    e: integer('e'),
    f: integer('f'),
    passed: integer('passed'),
    failed: integer('failed')
})

export const ratings = coursestats(
    'rating',
    {
        courseId: text('courseId')
            .notNull()
            .references(() => courses.id, { onDelete: 'cascade' }),
        userId: text('userId')
            .notNull()
            .references(() => users.id, { onDelete: 'cascade' }),
        rating: integer('rating').notNull()
    },
    (ratings) => ({
        compositeKey: primaryKey({
            columns: [ratings.courseId, ratings.userId]
        })
    })
)

export const book_votes = coursestats(
    'book_vote',
    {
        courseId: text('courseId')
            .notNull()
            .references(() => courses.id, { onDelete: 'cascade' }),
        userId: text('userId')
            .notNull()
            .references(() => users.id, { onDelete: 'cascade' }),
        vote: integer('vote', { mode: 'boolean' }).notNull()
    },
    (book_votes) => ({
        compositeKey: primaryKey({
            columns: [book_votes.courseId, book_votes.userId]
        })
    })
)

export const comments = coursestats('comment', {
    id: text('id')
        .primaryKey()
        .$defaultFn(() => ulid()),
    courseId: text('courseId')
        .notNull()
        .references(() => courses.id, { onDelete: 'cascade' }),
    userId: text('userId')
        .notNull()
        .references(() => users.id, { onDelete: 'cascade' }),
    content: text('content'),
    createdAt: integer('createdAt', { mode: 'timestamp_ms' }).notNull()
})

export const comment_votes = coursestats(
    'comment_vote',
    {
        commentId: text('commentId')
            .notNull()
            .references(() => comments.id, { onDelete: 'cascade' }),
        userId: text('userId')
            .notNull()
            .references(() => users.id, { onDelete: 'cascade' }),
        vote: integer('vote', { mode: 'boolean' }).notNull()
    },
    (comment_votes) => ({
        compositeKey: primaryKey({
            columns: [comment_votes.commentId, comment_votes.userId]
        })
    })
)

export const users = coursestats('user', {
    id: text('id')
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    name: text('name'),
    email: text('email').unique(),
    emailVerified: integer('emailVerified', { mode: 'timestamp_ms' }),
    image: text('image')
})

export const accounts = coursestats(
    'account',
    {
        userId: text('userId')
            .notNull()
            .references(() => users.id, { onDelete: 'cascade' }),
        type: text('type').$type<AdapterAccountType>().notNull(),
        provider: text('provider').notNull(),
        providerAccountId: text('providerAccountId').notNull(),
        refresh_token: text('refresh_token'),
        access_token: text('access_token'),
        expires_at: integer('expires_at'),
        token_type: text('token_type'),
        scope: text('scope'),
        id_token: text('id_token'),
        session_state: text('session_state')
    },
    (account) => ({
        compoundKey: primaryKey({
            columns: [account.provider, account.providerAccountId]
        })
    })
)

export const sessions = coursestats('session', {
    sessionToken: text('sessionToken').primaryKey(),
    userId: text('userId')
        .notNull()
        .references(() => users.id, { onDelete: 'cascade' }),
    expires: integer('expires', { mode: 'timestamp_ms' }).notNull()
})

export const verificationTokens = coursestats(
    'verificationToken',
    {
        identifier: text('identifier').notNull(),
        token: text('token').notNull(),
        expires: integer('expires', { mode: 'timestamp_ms' }).notNull()
    },
    (verificationToken) => ({
        compositePk: primaryKey({
            columns: [verificationToken.identifier, verificationToken.token]
        })
    })
)

export const authenticators = coursestats(
    'authenticator',
    {
        credentialID: text('credentialID').notNull().unique(),
        userId: text('userId')
            .notNull()
            .references(() => users.id, { onDelete: 'cascade' }),
        providerAccountId: text('providerAccountId').notNull(),
        credentialPublicKey: text('credentialPublicKey').notNull(),
        counter: integer('counter').notNull(),
        credentialDeviceType: text('credentialDeviceType').notNull(),
        credentialBackedUp: integer('credentialBackedUp', {
            mode: 'boolean'
        }).notNull(),
        transports: text('transports')
    },
    (authenticator) => ({
        compositePK: primaryKey({
            columns: [authenticator.userId, authenticator.credentialID]
        })
    })
)
