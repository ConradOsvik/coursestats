'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Error({
	error,
}: {
	error: Error & { digest?: string }
}) {
	return (
		<div className="w-screen h-screen flex flex-col justify-center items-center">
			<h1 className="m-2 text-4xl font-bold">
				Oops - En feil har skjedd
			</h1>
			<p className="m-2 text-xl text-zinc-500">{error.message}</p>
			<Button className="m-2 px-6" variant="default" asChild>
				<Link href="/">Hjem</Link>
			</Button>
		</div>
	)
}
