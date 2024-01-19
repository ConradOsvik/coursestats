'use client'

import { FormEvent, useEffect, useRef } from 'react'
import { useTypewriter } from 'react-simple-typewriter'
import { addCourse } from '../actions'

export default function Search() {
	const [text] = useTypewriter({
		words: ['IDATT1002', 'IMAT1002', 'TDT4100'],
		loop: false,
		delaySpeed: 2000,
	})

	const inputRef = useRef<HTMLInputElement>(null)

	useEffect(() => {
		if (!window) return

		window.addEventListener('keydown', handleKeyDown)

		return () => {
			window.removeEventListener('keydown', handleKeyDown)
		}
	}, [])

	const handleKeyDown = (e: KeyboardEvent) => {
		if (e.key === 'k' && e.metaKey) {
			e.preventDefault()

			if (!inputRef.current) return

			inputRef.current.focus()
		}

		if (e.key === 'Escape') {
			if (!inputRef.current) return

			inputRef.current.focus()
			inputRef.current.blur()
		}
	}

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		const url = `https://www.ntnu.no/studier/emner/${(
			e.currentTarget[0] as HTMLInputElement
		).value.toUpperCase()}`

		const data = await fetch('/api', {
			method: 'POST',
			body: JSON.stringify({
				url: url,
			}),
		}).then((res) => res.json())

		console.log(data)
	}
	return (
		<form
			className="relative border border-border rounded-md m-4 hover:border-foreground focus-within:border-foreground transition-colors duration-150"
			action={addCourse}
		>
			<input
				className="text-2xl w-96 outline-none p-4 bg-transparent uppercase"
				placeholder={text}
				name="course"
				ref={inputRef}
			/>
			<div className="absolute top-1/2 right-2 -translate-y-1/2 h-full bg-background flex justify-center items-center pointer-events-none">
				<kbd className="text-lg leading-none uppercase p-1 text-muted-foreground bg-muted font-mono rounded-md inline-flex justify-center items-center">
					<span className="text-xl leading-none px-0.5 flex justify-center items-center">
						⌘
					</span>
					k
				</kbd>
			</div>
		</form>
	)
}
