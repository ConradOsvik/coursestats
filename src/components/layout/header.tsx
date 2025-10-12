'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '~/lib/utils'

export default function Header() {
  return (
    <header className="header-border flex w-full items-center justify-start">
      <nav className="flex items-center justify-center px-4">
        <Link href="/" className="p-2 text-2xl font-bold">
          CourseStats
        </Link>
      </nav>
    </header>
  )
}

function NavLink({
  children,
  href
}: {
  children: React.ReactNode
  href: string
}) {
  const pathname = usePathname()

  return (
    <Link
      href={href}
      className={cn(
        'text-muted-foreground hover:text-foreground m-2 rounded-lg p-2 outline-none focus:ring-3 focus:ring-blue-500/50',
        pathname === href && 'text-foreground'
      )}
    >
      {children}
    </Link>
  )
}
