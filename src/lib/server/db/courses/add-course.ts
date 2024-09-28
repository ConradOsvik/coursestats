import * as cheerio from 'cheerio'
import { notFound } from 'next/navigation'
import 'server-only'

import { db } from '@/lib/server/db'
import { courses } from '@/lib/server/db/schema'

import { addSemesters } from '../semesters/add-semesters'

function parseTitle(title: string) {
    const [code, name] = title.split('-').map((str) => str.trim())
    return { code, name }
}

async function getData(code: string) {
    const url = `${process.env.NTNU_BASE_URL}/${code.toUpperCase()}`
    const data = await fetch(url).then((res) => res.text())
    const $ = cheerio.load(data)

    const details = $('#course-details')
    const title = details.find('h1').first().text()

    if (title.trim() === 'Ingen info for gitt studieår') notFound()

    return parseTitle(title)
}

export async function addCourse(_id: string) {
    const id = _id.toUpperCase()
    const { name } = await getData(id)

    db.insert(courses)
        .values({
            id,
            name
        })
        .then(() => addSemesters(id))
}
