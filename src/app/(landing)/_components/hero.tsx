import { FlickeringGrid } from '~/components/magicui/flickering-grid'
import { WordRotate } from '~/components/magicui/word-rotate'
import Search from '~/app/(landing)/_components/search'
import { getInstitutionsFromDb } from '~/server/db/queries/institutions'
import { getInstitutionsInDisplayOrder } from '~/lib/institution-utils'

export default async function Hero() {
  const institutions = await getInstitutionsFromDb()

  const sortedInstitutions = getInstitutionsInDisplayOrder(institutions)

  return (
    <div className="flex w-full flex-grow flex-col items-center justify-center">
      <div className="relative flex h-[800px] w-[800px] items-center justify-center overflow-hidden">
        <FlickeringGrid
          className="absolute inset-0 z-0 [mask-image:radial-gradient(450px_circle_at_center,white,transparent)]"
          squareSize={4}
          gridGap={6}
          maxOpacity={0.5}
          color="#737373"
          flickerChance={0.1}
          height={800}
          width={800}
        />
        <div className="z-10">
          <h1 className="mb-6 flex w-[490px] items-center justify-start text-4xl font-extrabold">
            Search a course at{' '}
            <WordRotate
              className="ml-2"
              words={sortedInstitutions.map(
                (institution) => institution.shortName
              )}
            />
          </h1>
          <Search institutions={institutions} />
        </div>
      </div>
    </div>
  )
}
