"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "~/lib/utils";

export default function Header() {
  return (
    <header className="flex items-center justify-center">
      <nav className="flex items-center justify-center">
        <NavLink href="/">Home</NavLink>
        <NavLink href="/about">About</NavLink>
      </nav>
    </header>
  );
}

function NavLink({
  children,
  href,
}: {
  children: React.ReactNode;
  href: string;
}) {
  const pathname = usePathname();

  return (
    <Link
      href={href}
      className={cn(
        "focus:ring-3 m-2 rounded-lg p-2 text-muted-foreground outline-none hover:text-foreground focus:ring-blue-500/50",
        pathname === href && "text-foreground",
      )}
    >
      {children}
    </Link>
  );
}
