import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function NotFound() {
	return (
		<div className="w-screen h-screen flex flex-col justify-center items-center">
			<h1 className="m-2 text-4xl font-bold">404 - Not Found</h1>
			<p className="mt-2 text-xl text-zinc-500">
				Emnet du leter etter finnes ikke
			</p>
			<Button className="h-auto m-4 px-8 py-4 text-lg" asChild>
				<Link href="/">Hjem</Link>
			</Button>
		</div>
	)
}
