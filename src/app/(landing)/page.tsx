import { api, createFilter } from '~/server/services/hkdir/api'
import Hero from './_components/hero'

export default async function Home() {
  // const data = await api({
  //   tabell_id: 208,
  //   variabler: ['*'],
  //   sortBy: ['Institusjonskode', 'Emnekode'],
  //   filter: [
  //     createFilter({
  //       variabel: 'Institusjonskode',
  //       filter: 'item',
  //       values: ['1150']
  //     }),
  //     createFilter({
  //       variabel: 'Årstall',
  //       filter: 'top',
  //       values: ['1']
  //     })
  //   ]
  // })

  // console.log(data)

  return (
    <div className="flex w-full flex-grow items-center justify-center">
      <Hero />
    </div>
  )
}
