// import { NextResponse } from 'next/server'
// import { INSTITUTIONS } from '~/lib/constants'
// import { db } from '~/server/db'
// import { grades, semesters } from '~/server/db/schema'
// import { getLatestSemesterForCourse } from '~/server/services/hkdir'
// import type {
//   DbSemesterData,
//   DbGradeData
// } from '~/server/services/hkdir/semesters'

// export async function GET() {
//   const today = new Date()
//   const day = today.getDate()
//   const month = today.getMonth() + 1

//   if (!((month === 10 && day === 16) || (month === 2 && day === 16))) {
//     return NextResponse.json(
//       { error: 'This API can only be called on October 16th or February 16th' },
//       { status: 403 }
//     )
//   }

//   try {
//     const courses = await db.query.courses.findMany({
//       columns: {
//         id: true,
//         institution: true,
//         code: true
//       }
//     })

//     const semesterResults = await Promise.all(
//       courses.map(async ({ id: courseId, institution, code }) => {
//         try {
//           const institutionObj = INSTITUTIONS.find(
//             (inst) => inst.initial === institution
//           )

//           if (!institutionObj || !courseId) {
//             console.error(`Issue with course: ${institution}/${code}`)
//             return null
//           }

//           return await getLatestSemesterForCourse(
//             institutionObj.id,
//             code,
//             courseId
//           )
//         } catch (error) {
//           console.error(
//             `Error processing course ${institution}/${code}:`,
//             error
//           )
//           return null
//         }
//       })
//     )

//     // Type for valid semester results
//     type ValidSemesterResult = {
//       semesters: DbSemesterData[]
//       grades: DbGradeData[]
//       fullSemesters: Array<DbSemesterData & { grades: DbGradeData[] }>
//     }

//     // Filter out null results and prepare data for insertion
//     const validResults = semesterResults.filter(
//       (result): result is ValidSemesterResult =>
//         result !== null &&
//         Array.isArray(result.semesters) &&
//         Array.isArray(result.grades)
//     )

//     // Collect all semesters and grades for batch insertion
//     const allSemesters = validResults.flatMap((result) => result.semesters)
//     const allGrades = validResults.flatMap((result) => result.grades)

//     // Only insert if we have data
//     if (allSemesters.length > 0 || allGrades.length > 0) {
//       try {
//         await Promise.all([
//           // Insert semesters (if any)
//           allSemesters.length > 0
//             ? db.insert(semesters).values(allSemesters).onConflictDoNothing()
//             : Promise.resolve(),

//           // Insert grades (if any)
//           allGrades.length > 0
//             ? db.insert(grades).values(allGrades).onConflictDoNothing()
//             : Promise.resolve()
//         ])

//         console.log(
//           `Successfully updated: ${allSemesters.length} semesters, ${allGrades.length} grades`
//         )
//       } catch (dbError) {
//         console.error('Database insertion error:', dbError)
//         return NextResponse.json(
//           {
//             error: 'Failed to insert data into database',
//             details: String(dbError)
//           },
//           { status: 500 }
//         )
//       }
//     } else {
//       console.log('No new data to insert')
//     }

//     return NextResponse.json({
//       success: true,
//       updated: {
//         courses: courses.length,
//         semesters: allSemesters.length,
//         grades: allGrades.length
//       }
//     })
//   } catch (error) {
//     console.error('Error updating semester data:', error)
//     return NextResponse.json(
//       {
//         error: 'An error occurred',
//         details: String(error)
//       },
//       { status: 500 }
//     )
//   }
// }
