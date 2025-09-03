import { unstable_cacheTag as cacheTag } from 'next/cache'
import { sql } from 'drizzle-orm'
import { db } from '..'
import { institutions } from '../schema'
import { notFound } from 'next/navigation'
import { getInstitutionsFromApi } from '~/server/services/hkdir'

export const getInstitutionsFromDb = async () => {
  'use cache'

  cacheTag('institutions')

  let institutions = await db.query.institutions.findMany()

  if (institutions.length === 0) {
    await addInstitutions()
    institutions = await db.query.institutions.findMany()

    if (institutions.length === 0) notFound()
  }

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

export const addInstitutions = async () => {
  const institutionsData = await getInstitutionsFromApi()

  if (institutionsData.length === 0) notFound()

  await db
    .insert(institutions)
    .values(institutionsData)
    .onConflictDoUpdate({
      target: institutions.id,
      set: {
        shortName: sql.raw(`excluded.${institutions.shortName.name}`),
        name: sql.raw(`excluded.${institutions.name.name}`),
        updatedAt: sql.raw(`excluded.${institutions.updatedAt.name}`)
      }
    })
}
