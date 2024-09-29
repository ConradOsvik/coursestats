import { LogIn } from 'lucide-react'

import { auth } from '@/lib/auth'
import { getUserRating } from '@/lib/server/db/ratings/get-user-rating'

import SignIn from '@/components/ui/sign-in'

import PersonalRating from './personal-rating'
import RatingSkeleton from './skeleton'

export default async function PersonalRatingWrapper({ id }: { id: string }) {
    const session = await auth()
    const userId = session?.user?.id

    if (!userId)
        return (
            <div className='relative flex h-full w-full flex-col items-center justify-center'>
                <RatingSkeleton />
                <div className='absolute flex h-full w-full flex-col items-center justify-center backdrop-blur-sm'>
                    <LogIn size={48} />
                    <p className='mt-2'>You are not signed in!</p>
                    <p className=''>Sign in to see your personal rating</p>
                    <SignIn className='mt-2' />
                </div>
            </div>
        )

    const personalRating = (await getUserRating(id, userId)) ?? 0

    return <PersonalRating id={id} personalRating={personalRating} />
}
