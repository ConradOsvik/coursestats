import { db } from '@/lib/db'
import { redirect } from 'next/navigation'
import Votes from './components/votes'
import { unstable_cache as cache } from 'next/cache'
import BarChart from './components/bar-chart'

const getCourse = cache(
	async (code: string) => {
		const course = await db.query.courses.findFirst({
			where: (users, { eq }) => eq(users.code, code),
		})

		if (!course) return redirect(`/add-course?code=${code}`)

		return course
	},
	['course'],
	{
		tags: ['course'],
	}
)

export async function generateMetadata({
	params,
}: {
	params: { code: string }
}) {
	return {
		title: params.code,
	}
}

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
