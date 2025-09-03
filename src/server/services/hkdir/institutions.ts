import { API_TYPE_CODE_MAP } from '~/lib/constants'
import { api, createFilter } from './api'

interface InstitutionApiResponse {
  Institusjonskode: string
  Institusjonsnavn: string
  Kortnavn: string
  Institusjonstypekode: string
  'Institusjonskode (sammenslått)'?: string
  'Sammenslått navn'?: string
}

export const getInstitutionsFromApi = async () => {
  const data = await api<InstitutionApiResponse[]>({
    tabell_id: 211,
    variabler: [
      'Institusjonskode',
      'Institusjonsnavn',
      'Kortnavn',
      'Institusjonskode (sammenslått)',
      'Institusjonstypekode'
    ],
    sortBy: ['Institusjonskode (sammenslått)'],
    filter: [
      createFilter({
        variabel: 'Institusjonskode (sammenslått)',
        filter: 'all',
        values: ['*']
      }),
      createFilter({
        variabel: 'Institusjonstypekode',
        filter: 'item',
        values: ['11', '12', '02', '82', '83']
      })
    ]
  })

  const institutionMap = new Map<string, InstitutionApiResponse[]>()

  for (const institution of data) {
    const combinedId = institution['Institusjonskode (sammenslått)']
    const key = combinedId ?? institution.Institusjonskode

    if (!institutionMap.has(key)) {
      institutionMap.set(key, [])
    }
    institutionMap.get(key)!.push(institution)
  }

  return Array.from(institutionMap.entries())
    .map(([combinedId, institutions]) => {
      if (institutions.length === 1) {
        const institution = institutions[0]!

        const institutionId =
          institution['Institusjonskode (sammenslått)'] ??
          institution.Institusjonskode
        return {
          id: parseInt(institutionId, 10),
          shortName: institution.Kortnavn,
          name: institution['Sammenslått navn'] ?? institution.Institusjonsnavn,
          type: API_TYPE_CODE_MAP[
            institution.Institusjonstypekode as keyof typeof API_TYPE_CODE_MAP
          ]
        }
      }

      const primaryInstitution =
        institutions.find(
          (inst) =>
            inst.Institusjonskode === inst['Institusjonskode (sammenslått)']
        ) ?? institutions[0]!

      return {
        id: parseInt(combinedId, 10),
        shortName: primaryInstitution.Kortnavn,
        name:
          primaryInstitution['Sammenslått navn'] ??
          primaryInstitution.Institusjonsnavn,
        type: API_TYPE_CODE_MAP[
          primaryInstitution.Institusjonstypekode as keyof typeof API_TYPE_CODE_MAP
        ]
      }
    })
    .filter(
      (institution) =>
        institution.shortName && !institution.shortName.startsWith('UNIT')
    )
}
