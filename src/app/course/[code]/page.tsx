import { db } from '@/lib/db'
import { notFound, redirect } from 'next/navigation'
import Votes from './components/votes'
import { unstable_cache as cache } from 'next/cache'
import BarChart from './components/bar-chart'
import * as cheerio from 'cheerio'
import { courses } from '@/lib/db/schema'

interface CourseDetails {
	code: string
	name: string
}

export async function generateMetadata({
	params,
}: {
	params: { code: string }
}) {
	return {
		title: params.code,
	}
}

const COURSE_URL = 'https://www.ntnu.no/studier/emner/'

async function fetchCourseData(code: string) {
	const url = `${COURSE_URL}${code.toUpperCase()}`
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
		console.log('insert failed', e)
	}
}

async function addCourse(code: string) {
	const $ = await fetchCourseData(code)
	const courseDetails = parseCourseDetails($)
	await insertCourseToDB(courseDetails)

	redirect(`/course/${courseDetails.code.toLowerCase()}`)
}

const getCourse = cache(
	async (code: string) => {
		let course = await db.query.courses.findFirst({
			where: (users, { eq }) => eq(users.code, code),
		})

		if (!course) {
			await addCourse(code)
			course = await db.query.courses.findFirst({
				where: (users, { eq }) => eq(users.code, code),
			})
			if (!course)
				throw new Error(`Emne med kode ${code} kunne ikke bli hentet`)
		}

		return course
	},
	['course'],
	{
		tags: ['course'],
	}
)

export default async function Course({ params }: { params: { code: string } }) {
	const course = await getCourse(params.code)

	return (
		<>
			<h1 className="m-2 text-4xl font-bold">
				{course.code} - {course.name}
			</h1>
			<p className="m-2 text-xl text-zinc-500">Trenger man bok:</p>
			<Votes
				likes={course.likes}
				dislikes={course.dislikes}
				code={course.code}
			/>
			<BarChart likes={course.likes} dislikes={course.dislikes} />
		</>
	)
}
