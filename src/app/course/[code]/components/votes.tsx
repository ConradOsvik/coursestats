'use client'

import { useState } from 'react'
import { like, dislike } from '../actions'
import Button from './button'
import { getCookie } from 'cookies-next'

export default function Votes({
	likes,
	dislikes,
	code,
}: {
	likes: number
	dislikes: number
	code: string
}) {
	const [disabled, setDisabled] = useState(Boolean(getCookie(code)))

	return (
		<div className="flex justify-between items-center">
			<Button
				mode="like"
				votes={likes}
				code={code}
				action={like}
				disabled={disabled}
				setDisabled={setDisabled}
			/>
			<Button
				mode="dislike"
				votes={dislikes}
				code={code}
				action={dislike}
				disabled={disabled}
				setDisabled={setDisabled}
			/>
		</div>
	)
}
