'use server'
import { db } from '@/lib/db'
import { courses } from '@/lib/db/schema'
import * as cheerio from 'cheerio'
import { notFound, redirect } from 'next/navigation'

export async function addCourse(formData: FormData) {
	const course = formData.get('course')?.toString() ?? ''

	const url = `https://www.ntnu.no/studier/emner/${course.toUpperCase()}`

	const data = await fetch(url).then((res) => res.text())

	const $ = cheerio.load(data)

	const courseDetails = $('#course-details')

	const title = courseDetails.find('h1').first().text()
	if (title.trim() === 'Ingen info for gitt studieår')
		// throw new Error(`Fant ikke emne med navn ${course}`)
		notFound()

	const code = title.split('-')[0].trim()
	const name = title.split('-')[1].trim()

	await db.insert(courses).values({
		code,
		name,
		likes: 0,
		dislikes: 0,
	})

	redirect(`/course/${code}`)
}
