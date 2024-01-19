'use client'

import { cn } from '@/lib/utils'
import { useOptimistic, useTransition } from 'react'

export default function Button({
	mode,
	votes,
	code,
	action,
	disabled,
	setDisabled,
}: {
	mode: 'like' | 'dislike'
	votes: number
	code: string
	action: Function
	disabled: boolean
	setDisabled: Function
}) {
	const [isPending, startTransition] = useTransition()
	const [optimisticVotes, setOptimisticVotes] = useOptimistic(
		votes,
		(votes, newVotes: number) => votes + newVotes
	)

	return (
		<button
			className={cn(
				'rounded-full m-4 w-64 h-64 text-8xl transition-colors duration-150 flex flex-col justify-center items-center',
				mode === 'like' && 'bg-green-500/10 hover:bg-green-500/20',
				mode === 'dislike' && 'bg-red-500/10 hover:bg-red-500/20',
				disabled && 'pointer-events-none cursor-default'
			)}
			onClick={async () => {
				setDisabled(true)
				startTransition(() => setOptimisticVotes(1))
				await action(code)
			}}
			disabled={disabled}
		>
			{mode === 'like' ? '👍' : '👎'}
			<span className="text-2xl m-4">{optimisticVotes}</span>
		</button>
	)
}
