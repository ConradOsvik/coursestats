import { Input } from '@/components/ui/input'

export default function Hero() {
	return (
		<div className="flex flex-col justify-center items-center w-full h-screen">
			<h1 className="text-6xl font-bold">Søk etter emne</h1>
			<Input className="w-96 p-8 text-4xl m-4" placeholder="IDATT1002" />
		</div>
	)
}
