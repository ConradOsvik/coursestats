import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import Votes from './components/votes'
import { unstable_cache as cache } from 'next/cache'

const getCourse = cache(
	async (code: string) => {
		return await db.query.courses.findFirst({
			where: (users, { eq }) => eq(users.code, code),
		})
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
	const data = await getCourse(params.code)

	if (!data) return notFound()

	return (
		<div className="w-screen h-screen flex flex-col justify-center items-center">
			<h1 className="m-2 text-4xl font-bold">
				{data.code} - {data.name}
			</h1>
			<p className="m-2 text-xl text-zinc-500">Trenger man bok:</p>
			<Votes
				likes={data.likes}
				dislikes={data.dislikes}
				code={data.code}
			/>
		</div>
	)
}
