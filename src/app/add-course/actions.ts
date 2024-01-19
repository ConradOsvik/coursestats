'use server'
import { db } from '@/lib/db'
import { courses } from '@/lib/db/schema'
import * as cheerio from 'cheerio'
import { notFound, redirect } from 'next/navigation'

interface CourseDetails {
	code: string
	name: string
}

const COURSE_URL = 'https://www.ntnu.no/studier/emner/'

async function fetchCourseData(course: string) {
	const url = `${COURSE_URL}${course.toUpperCase()}`
	const data = await fetch(url).then((res) => res.text())
	return cheerio.load(data)
}

function parseCourseDetails($: cheerio.CheerioAPI) {
	const courseDetails = $('#course-details')
	const title = courseDetails.find('h1').first().text()
	if (title.trim() === 'Ingen info for gitt studieår') {
		notFound()
	}
	const [code, name] = title.split('-').map((str) => str.trim())
	return { code, name }
}

async function insertCourseToDB(courseDetails: CourseDetails) {
	try {
		await db.insert(courses).values({
			...courseDetails,
			likes: 0,
			dislikes: 0,
		})
	} catch (e) {
		console.error(e)
		redirect(`/course/${courseDetails.code.toLowerCase()}`)
	}
}

export async function addCourse(formData: FormData) {
	const course = formData.get('course')?.toString() ?? ''

	const $ = await fetchCourseData(course)
	const courseDetails = parseCourseDetails($)
	await insertCourseToDB(courseDetails)

	redirect(`/course/${courseDetails.code.toLowerCase()}`)
}
