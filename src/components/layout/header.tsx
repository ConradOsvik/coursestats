'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '~/lib/utils'

export default function Header() {
  return (
    <header className="gradient-border-x flex w-full items-center justify-center">
      <nav className="flex items-center justify-center">
        <NavLink href="/">Home</NavLink>
        <NavLink href="/about">About</NavLink>
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
