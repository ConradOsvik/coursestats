import { getCourse } from '@/lib/server/db/courses/get-course'

export default async function Title({ id }: { id: string }) {
    const { name, id: code } = await getCourse(id)

    return (
        <h1 className='border-l border-r px-2 py-4 text-5xl'>
            {name} - {code}
        </h1>
    )
}
