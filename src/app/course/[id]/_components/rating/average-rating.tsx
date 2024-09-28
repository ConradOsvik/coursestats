import { Star } from 'lucide-react'

export default function AverageRating({ avgRating }: { avgRating: number }) {
    return (
        <div className='flex items-center justify-center py-4'>
            {[...Array(5)].map((_, i) => {
                const ratingValue = i + 1
                const avgFill = Math.min(Math.max(avgRating - i, 0), 1) * 100

                return (
                    <label key={i}>
                        <input
                            type='radio'
                            name='rating'
                            className='hidden'
                            value={ratingValue}
                        />
                        <div className='relative h-16 w-16'>
                            <Star
                                size={64}
                                className='absolute inset-0 fill-current text-neutral-200 dark:text-neutral-800'
                            />
                            <Star
                                size={64}
                                className='pointer-events-none absolute inset-0 fill-current text-yellow-400'
                                style={{
                                    clipPath: `inset(0 ${100 - avgFill}% 0 0)`
                                }}
                            />
                        </div>
                    </label>
                )
            })}
        </div>
    )
}
