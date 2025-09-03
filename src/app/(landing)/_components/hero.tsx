import { FlickeringGrid } from '~/components/magicui/flickering-grid'
import { WordRotate } from '~/components/magicui/word-rotate'
import Search from '~/app/(landing)/_components/search'
import { getInstitutionsFromDb } from '~/server/db/queries/institutions'
import { getInstitutionsInDisplayOrder } from '~/lib/institution-utils'

export default async function Hero() {
  const institutions = await getInstitutionsFromDb()

  const sortedInstitutions = getInstitutionsInDisplayOrder(institutions)

  return (
    <div className="relative flex h-[800px] w-[800px] items-center justify-center overflow-hidden">
      <FlickeringGrid
        className="absolute inset-0 z-0 [mask-image:radial-gradient(300px_circle_at_center,white,transparent)] sm:[mask-image:radial-gradient(400px_circle_at_center,white,transparent)] lg:[mask-image:radial-gradient(450px_circle_at_center,white,transparent)]"
        squareSize={4}
        gridGap={6}
        maxOpacity={0.5}
        color="#737373"
        flickerChance={0.1}
        height={800}
        width={800}
      />
      <div className="z-10 sm:w-[490px]">
        <h1 className="mb-2 flex flex-col items-start justify-center text-center text-2xl font-extrabold sm:mb-6 sm:flex-row sm:items-center sm:justify-start sm:text-left sm:text-3xl md:text-4xl">
          <span>Search a course at</span>
          <WordRotate
            className="ml-0 sm:ml-2"
            words={sortedInstitutions.map(
              (institution) => institution.shortName
            )}
          />
        </h1>
        <Search institutions={institutions} />
      </div>
    </div>
  )
}
