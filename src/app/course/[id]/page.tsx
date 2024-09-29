import { getCourse } from '@/lib/server/db/courses/get-course'

import BookVotes from './_components/book-votes/book-votes'
import Rating from './_components/rating/rating'
import AverageChartContainer from './_components/stats/average-chart-container'
import FailureChartContainer from './_components/stats/failure-chart-container'
import SemesterChartContainer from './_components/stats/semester-chart-container'
import StatsContainer from './_components/stats/stats-container'
import Title from './_components/title'

export default async function CoursePage({
    params: { id }
}: {
    params: { id: string }
}) {
    const course = await getCourse(id)

    return (
        <main className='grid w-full max-w-5xl grid-cols-2'>
            <div className='col-span-2 w-full'>
                <Title name={course.name} id={course.id} />
            </div>
            <div className='h-80 w-full'>
                <Rating id={id} />
            </div>
            <div className='h-80 w-full'>
                <BookVotes id={id} />
            </div>
            <div className='h-80 w-full'>
                <SemesterChartContainer id={id} />
            </div>
            <div className='h-80 w-full'>
                <StatsContainer id={id} />
            </div>
            <div className='col-span-2 h-80 w-full'>
                <AverageChartContainer id={id} />
            </div>
            <div className='col-span-2 h-80 w-full'>
                <FailureChartContainer id={id} />
            </div>
        </main>
    )
}
