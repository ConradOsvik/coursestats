'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Error({
	error,
}: {
	error: Error & { digest?: string }
}) {
	return (
		<>
			<h1 className="m-2 text-4xl font-bold">
				Oops - En feil har skjedd
			</h1>
			<p className="m-2 text-xl text-zinc-500">{error.message}</p>
			<Button className="h-auto m-4 px-8 py-4 text-lg" asChild>
				<Link href="/">Hjem</Link>
			</Button>
		</>
	)
}
