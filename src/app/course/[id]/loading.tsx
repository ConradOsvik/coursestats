export default function Loading() {
    return (
        <main className='grid w-full max-w-5xl grid-cols-2'>
            <div className='col-span-2 w-full'>
                <div className='h-12 w-1/2 animate-pulse rounded-md bg-muted' />
            </div>
            <div className='h-80 w-full p-4'>
                <div className='h-full w-full animate-pulse rounded-md bg-muted' />
            </div>
            <div className='h-80 w-full p-4'>
                <div className='h-full w-full animate-pulse rounded-md bg-muted' />
            </div>
            <div className='h-80 w-full p-4'>
                <div className='h-full w-full animate-pulse rounded-md bg-muted' />
            </div>
            <div className='h-80 w-full p-4'>
                <div className='h-full w-full animate-pulse rounded-md bg-muted' />
            </div>
            <div className='col-span-2 h-80 w-full p-4'>
                <div className='h-full w-full animate-pulse rounded-md bg-muted' />
            </div>
            <div className='col-span-2 h-80 w-full p-4'>
                <div className='h-full w-full animate-pulse rounded-md bg-muted' />
            </div>
        </main>
    )
}
