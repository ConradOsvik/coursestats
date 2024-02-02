'use client'

import { usePathname, useRouter } from 'next/navigation'
import { Button } from './ui/button'
import { ArrowLeft } from 'lucide-react'
import { MouseEvent } from 'react'

export default function BackButton() {
	const router = useRouter()
	const pathname = usePathname()

	const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()
		router.back()

		console.log(router)
	}

	if (pathname === '/') return null

	return (
		<label className="flex justify-center items-center">
			<Button
				className="m-2 w-12 h-12"
				variant="outline"
				size="icon"
				onClick={handleClick}
			>
				<ArrowLeft size={28} />
			</Button>
			Gå tilbake
		</label>
	)
}
