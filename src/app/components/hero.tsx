import Search from './search'

export default function Hero() {
	return (
		<div className="flex flex-col justify-center items-center w-full h-full">
			<h1 className="text-5xl font-bold">Søk etter emne</h1>
			<Search />
		</div>
	)
}
