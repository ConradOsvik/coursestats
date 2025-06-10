import Hero from './_components/hero'

export default async function Home() {
  return (
    <main className="flex w-full max-w-5xl flex-grow flex-col items-center justify-start">
      <Hero />
    </main>
  )
}
