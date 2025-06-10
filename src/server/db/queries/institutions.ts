import { unstable_cacheTag as cacheTag } from 'next/cache'
import { db } from '..'
import { notFound } from 'next/navigation'

export const getInstitutionsFromDb = async () => {
  'use cache'

  cacheTag('institutions')

  const institutions = await db.query.institutions.findMany()

  return institutions
}

export const getInstitutionFromDb = async (id: number) => {
  'use cache'

  cacheTag('institutions')
  cacheTag(`institution:${id}`)

  const institution = await db.query.institutions.findFirst({
    where: (institutions, { eq }) => eq(institutions.id, id)
  })

  return institution
}

export const getInstitutionByShortNameFromDb = async (shortName: string) => {
  'use cache'

  cacheTag('institutions')
  cacheTag(`institution:${shortName}`)

  const institution = await db.query.institutions.findFirst({
    where: (institutions, { eq }) => eq(institutions.shortName, shortName)
  })

  // TODO: Add fetch then fail
  if (!institution) notFound()

  return institution
}
