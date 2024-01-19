'use server'
import { db } from '@/lib/db'
import { courses } from '@/lib/db/schema'
import { eq, sql } from 'drizzle-orm'
import { revalidateTag } from 'next/cache'
import { cookies } from 'next/headers'

export async function like(code: string) {
	if (cookies().has(code)) return

	await db
		.update(courses)
		.set({
			likes: sql`${courses.likes} + 1`,
		})
		.where(eq(courses.code, code))

	cookies().set(code, 'liked')

	revalidateTag('course')
}

export async function dislike(code: string) {
	if (cookies().has(code)) return

	await db
		.update(courses)
		.set({
			dislikes: sql`${courses.dislikes} + 1`,
		})
		.where(eq(courses.code, code))

	cookies().set(code, 'disliked')

	revalidateTag('course')
}
