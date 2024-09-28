'use client'

import { motion } from 'framer-motion'
import { Star, UserRound } from 'lucide-react'
import { useOptimisticAction } from 'next-safe-action/hooks'
import { useState } from 'react'

import { updateUserRatingAction } from '@/lib/actions/update-user-rating-action'
import { cn } from '@/lib/utils'

export default function PersonalRating({
    id,
    personalRating
}: {
    id: string
    personalRating: number
}) {
    const [hover, setHover] = useState(0)

    const {
        execute,
        optimisticState: rating,
        isPending
    } = useOptimisticAction(updateUserRatingAction, {
        currentState: personalRating,
        updateFn: (_, { rating }) => rating
    })

    const handleRating = async (newRating: number) => {
        if (newRating === rating) newRating = 0

        execute({ id, rating: newRating })
    }

    return (
        <div className='flex h-full w-full flex-col items-center justify-center'>
            <h1 className='text-4xl'>Your course rating</h1>
            <div className='flex p-4'>
                {[...Array(5)].map((_, i) => {
                    const ratingValue = i + 1

                    return (
                        <motion.button
                            key={i}
                            initial={{ scale: 1 }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleRating(ratingValue)}
                            onMouseEnter={() => setHover(ratingValue)}
                            onMouseLeave={() => setHover(0)}
                            disabled={isPending}
                        >
                            <Star
                                size={64}
                                className={cn(
                                    'fill-current transition-colors duration-150',
                                    ratingValue <= (hover || rating)
                                        ? 'text-yellow-400'
                                        : 'text-neutral-200 dark:text-neutral-800'
                                )}
                            />
                        </motion.button>
                    )
                })}
            </div>
            <h1 className='text-5xl'>
                {Math.round((rating + Number.EPSILON) * 10) / 10}
            </h1>
            <div className='flex items-center justify-center'>
                <UserRound size={18} className='mr-2' />
                <p className='text-lg'>Your rating</p>
            </div>
        </div>
    )
}
