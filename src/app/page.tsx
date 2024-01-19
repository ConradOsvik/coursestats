import Hero from './components/hero'

export default async function Home() {
	return (
		<main className="w-full flex-grow flex flex-col justify-start items-center">
			<Hero />
		</main>
	)
}
