'use client'

import { useTheme } from 'next-themes'
import { Button } from './ui/button'
import { SunMedium, Moon, Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function DarkMode() {
	const [mounted, setMounted] = useState(false)
	useEffect(() => setMounted(true), [])

	const { theme, setTheme } = useTheme()

	const handleClick = () => {
		if (theme === 'dark') {
			setTheme('light')
			return
		}

		setTheme('dark')
	}

	if (!mounted)
		return (
			<Button
				className="m-2 w-12 h-12"
				variant="outline"
				size="icon"
				disabled
			>
				<Loader2 className="animate-spin" />
			</Button>
		)

	return (
		<Button
			className="m-2 w-12 h-12"
			variant="outline"
			size="icon"
			onClick={handleClick}
		>
			{theme === 'dark' ? (
				<SunMedium size={28} fill="currentColor" />
			) : (
				<Moon size={28} fill="currentColor" />
			)}
		</Button>
	)
}
