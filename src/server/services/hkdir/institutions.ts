import { api, createFilter } from './api'

interface InstitutionApiResponse {
  Institusjonskode: string
  Institusjonsnavn: string
  Kortnavn: string
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
      'Institusjonskode (sammenslått)'
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
        values: ['11']
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
        return {
          id: parseInt(
            institution['Institusjonskode (sammenslått)'] ??
              institution.Institusjonskode,
            10
          ),
          shortName: institution.Kortnavn || 'UNKNOWN',
          name: institution['Sammenslått navn'] ?? institution.Institusjonsnavn
        }
      }

      const primaryInstitution =
        institutions.find(
          (inst) =>
            inst.Institusjonskode === inst['Institusjonskode (sammenslått)']
        ) ?? institutions[0]!

      return {
        id: parseInt(combinedId, 10),
        shortName: primaryInstitution.Kortnavn || 'UNKNOWN',
        name:
          primaryInstitution['Sammenslått navn'] ??
          primaryInstitution.Institusjonsnavn
      }
    })
    .filter((institution) => !institution.shortName.startsWith('UNIT'))
}
