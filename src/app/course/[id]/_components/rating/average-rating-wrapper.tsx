import { UsersRound } from 'lucide-react'

import { getRatings } from '@/lib/server/db/ratings/get-ratings'

import AverageRating from './average-rating'

export default async function AverageRatingWrapper({ id }: { id: string }) {
    const ratings = await getRatings(id)

    return (
        <div className='flex h-full w-full flex-col items-center justify-center'>
            <h1 className='text-4xl'>Average course rating</h1>
            <AverageRating avgRating={ratings.average} />
            <h1 className='text-5xl'>
                {Math.round((ratings.average + Number.EPSILON) * 10) / 10}
            </h1>
            <div className='flex items-center justify-center'>
                <UsersRound size={18} className='mr-2' />
                <p className='text-lg'>
                    {ratings.count} {ratings.count === 1 ? 'rating' : 'ratings'}
                </p>
            </div>
        </div>
    )
}
