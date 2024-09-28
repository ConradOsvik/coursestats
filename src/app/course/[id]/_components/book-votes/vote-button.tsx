'use client'

import { type ButtonHTMLAttributes } from 'react'

import { cn } from '@/lib/utils'

interface VoteButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant: 'upvote' | 'downvote'
    vote?: boolean | undefined
    disabled?: boolean
}

export default function VoteButton({
    variant,
    vote,
    disabled,
    ...props
}: VoteButtonProps) {
    return (
        <button
            {...props}
            className={cn(
                'rounded-full p-8 text-6xl transition-colors duration-300',
                variant === 'upvote' && 'bg-blue-500/10 hover:bg-blue-500/30',
                variant === 'downvote' && 'bg-red-500/10 hover:bg-red-500/30',
                variant === 'upvote' && vote === true && 'bg-blue-500/30',
                variant === 'downvote' && vote === false && 'bg-red-500/30',
                disabled && 'pointer-events-none'
            )}
        >
            {variant === 'upvote' ? '👍' : '👎'}
        </button>
    )
}
