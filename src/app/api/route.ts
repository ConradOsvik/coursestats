// export const revalidate = 0

interface Body {
	url: string
}

// export async function POST(request: Request) {
// 	const body: Body = await request.json()
// 	const { url } = body

// 	const data = await fetch(url)
// 		.then((res) => res.text())
// 		.then((text) => {
// 			const parser = new DOMParser()
// 			return parser.parseFromString(text, 'text/html')
// 		})

// 	const courseDetails = data.getElementById('course-details')

// 	if (!courseDetails?.querySelector('h1'))
// 		return Response.json('Course not found', { status: 404 })

// 	const courseCode = courseDetails.innerHTML.split(' - ')[0]
// 	const courseName = courseDetails.innerHTML.split(' - ')[1]

// 	return Response.json({ courseCode, courseName, status: 200 })
// }

export async function GET(request: Request) {
	return Response.json({ hello: 'world', status: 200 })
}

export async function POST(request: Request) {
	const body: Body = await request.json()
	const { url } = body

	const data = await fetch(url).then((res) => res.text())

	return Response.json(data)
}
