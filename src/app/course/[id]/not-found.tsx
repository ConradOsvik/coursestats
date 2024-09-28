import Link from 'next/link'

import { cn } from '@/lib/utils'

import { buttonVariants } from '@/components/ui/button'

export default function NotFound() {
    return (
        <main className='flex h-full flex-col items-center justify-center'>
            <h1 className='py-2 text-5xl'>Not Found</h1>
            <p className='py-2 text-lg'>
                We couldn't find the course you are looking for
            </p>
            <Link
                href='/'
                className={cn(
                    buttonVariants(),
                    'no-underline dark:text-primary-foreground'
                )}
            >
                Return Home
            </Link>
        </main>
    )
}
