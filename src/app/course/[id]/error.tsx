'use client'

import { cn } from '@/lib/utils'

import { buttonVariants } from '@/components/ui/button'

export default function Error({
    error,
    reset
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    return (
        <main className='flex h-full flex-col items-center justify-center'>
            <h1 className='py-2 text-5xl'>Something went wrong!</h1>
            <p className='py-2 text-lg'>{error.message}</p>
            <button
                className={cn(
                    buttonVariants(),
                    'no-underline dark:text-primary-foreground'
                )}
                onClick={() => reset()}
            >
                Try again
            </button>
        </main>
    )
}
