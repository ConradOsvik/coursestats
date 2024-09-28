import { getCourse } from '@/lib/server/db/courses/get-course'

export default async function Title({
    name,
    id
}: {
    name: string
    id: string
}) {
    return (
        <h1 className='border-l border-r px-2 py-4 text-5xl'>
            {name} - {id}
        </h1>
    )
}
