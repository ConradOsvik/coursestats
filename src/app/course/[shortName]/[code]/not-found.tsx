import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="flex flex-grow flex-col items-center justify-center">
      <h2 className="text-3xl font-semibold">404 - Not Found</h2>
      <p className="mt-6">Could not find the course you are looking for</p>
      <Link
        href="/"
        className="text-muted-foreground hover:text-foreground mt-2"
      >
        Return home
      </Link>
    </main>
  )
}
