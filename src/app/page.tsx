import Hero from './components/hero'

export const revalidate = 0

export default async function Home() {
	const url = 'https://www.ntnu.no/studier/emner/IDATT2002#tab=omEmnet'

	// const data = await fetch('/api/courses', {
	// 	method: 'POST',
	// 	body: JSON.stringify({ url }),
	// 	headers: {
	// 		'Content-Type': 'application/json',
	// 	},
	// }).then((res) => res.json())

	const data = await fetch('http://localhost:3000/api', {
		method: 'POST',
		body: JSON.stringify({ url }),
	}).then((res) => res.json())

	console.log(data)

	return (
		<main className="flex flex-col justify-start items-center">
			<Hero />
		</main>
	)
}
