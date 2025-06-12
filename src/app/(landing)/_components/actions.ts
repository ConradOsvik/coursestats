'use server'

import { searchCourseCodesFuzzy } from '~/server/db/queries/courses'

export async function searchCoursesAction(
  institutionId: number,
  searchCode: string,
  limit = 10
) {
  try {
    return await searchCourseCodesFuzzy(institutionId, searchCode, limit)
  } catch (error) {
    console.error('Failed to search courses:', error)
    throw new Error('Failed to search courses')
  }
}
