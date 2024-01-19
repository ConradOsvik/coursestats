import { Button, buttonVariants } from '@/components/ui/button'
import Link from 'next/link'

export default function NotFound() {
	return (
		<div className="w-screen h-screen flex flex-col justify-center items-center">
			<h1 className="m-2 text-4xl font-bold">404 - Not Found</h1>
			<p className="mt-2 text-xl text-zinc-500">
				Emnet du leter etter er ikke lagret i databasen
			</p>
			<p className="mb-2 text-xl text-zinc-500">
				Om det finnes, vurder å legg det til
			</p>
			<div className="flex justify-between items-center">
				<Button className="m-2 px-6" asChild>
					<Link href="/add-course">Legg til emne</Link>
				</Button>
				<Button className="m-2 px-6" variant="outline" asChild>
					<Link href="/">Hjem</Link>
				</Button>
			</div>
		</div>
	)
}
