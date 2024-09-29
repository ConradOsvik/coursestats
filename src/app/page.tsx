import Search from './_components/search'

export default async function Home() {
    return (
        <main className='flex h-full flex-grow flex-col items-center justify-center'>
            <h1 className='pb-4 text-4xl'>Discover course statistics 📊</h1>
            <Search />
        </main>
    )
}
