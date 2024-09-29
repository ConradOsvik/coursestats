import Link from 'next/link'
import { Suspense } from 'react'

import { Button } from '../ui/button'
import Search from './_components/search'
import ThemeToggle from './_components/theme-toggle'
import UserMenu from './_components/user-menu'

export default function Header() {
    return (
        <header className='flex min-h-16 w-full items-center justify-between border-b px-8 py-4'>
            <Link
                href='/'
                prefetch={false}
                className='m-1 text-xl font-black no-underline'
            >
                CourseSTATS
            </Link>
            <Search />
            <div className='flex gap-2'>
                <ThemeToggle />
                <Suspense fallback={<Button disabled>loading...</Button>}>
                    <UserMenu />
                </Suspense>
            </div>
        </header>
    )
}
