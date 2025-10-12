'use server'

import { z } from 'zod'
import { actionClient } from '~/lib/safe-action'
import {
  searchCourseCodesFuzzy,
  searchCourseCode
} from '~/server/db/queries/courses'

const searchCoursesSchema = z.object({
  institutionId: z.number(),
  searchCode: z.string().min(1),
  limit: z.number().default(10).optional()
})

export const searchCoursesAction = actionClient
  .inputSchema(searchCoursesSchema)
  .action(
    async ({ parsedInput: { institutionId, searchCode, limit = 10 } }) => {
      try {
        return await searchCourseCodesFuzzy(institutionId, searchCode, limit)
      } catch (error) {
        console.error('Failed to search courses:', error)
        throw new Error('Failed to search courses')
      }
    }
  )

const searchCourseSchema = z.object({
  courseCode: z.string(),
  limit: z.number().default(10).optional()
})

export const searchCourseAction = actionClient
  .inputSchema(searchCourseSchema)
  .action(async ({ parsedInput: { courseCode, limit = 10 } }) => {
    return await searchCourseCode(courseCode, limit)
  })
