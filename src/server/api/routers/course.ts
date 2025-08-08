import { z } from 'zod'
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc'
import { courses, grades, semesters } from '~/server/db/schema'
// import { INSTITUTIONS } from '~/lib/constants'
// import { getCourseAndSemestersData } from '~/server/services/hkdir'

export const courseRouter = createTRPCRouter({
  getCourse: publicProcedure
    .input(z.object({ institution: z.string(), code: z.string() }))
    .query(async ({ input, ctx }) => {
      // const { institution, code: _code } = input
      // const code = _code.toUpperCase()
      // const course = await ctx.db.query.courses.findFirst({
      //   where: (courses, { eq, and }) =>
      //     and(eq(courses.institution, institution), eq(courses.code, code)),
      //   with: {
      //     semesters: {
      //       with: {
      //         grades: true
      //       }
      //     }
      //   }
      // })
      // if (course) {
      //   return course
      // }
      // const institutionObj = INSTITUTIONS.find(
      //   (inst) => inst.initial === institution
      // )
      // if (!institutionObj) {
      //   throw new Error(`Institution not found: ${institution}`)
      // }
      // const {
      //   course: newCourse,
      //   semesters: newSemesters,
      //   grades: newGrades,
      //   fullSemesters
      // } = await getCourseAndSemestersData(institutionObj.id, code)
      // await Promise.all([
      //   ctx.db.insert(courses).values(newCourse).onConflictDoNothing(),
      //   ctx.db.insert(semesters).values(newSemesters).onConflictDoNothing(),
      //   ctx.db.insert(grades).values(newGrades).onConflictDoNothing()
      // ])
      // return {
      //   ...newCourse,
      //   semesters: fullSemesters
      // }
    })
})
