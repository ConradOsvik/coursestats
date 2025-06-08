import { unstable_cacheTag as cacheTag } from "next/cache";

import { db } from "..";

export const getCourseFromDb = async (
  institutionId: number,
  courseCode: string,
) => {
  "use cache";

  cacheTag("courses");
  cacheTag(`course:${institutionId}:${courseCode}`);

  const course = await db.query.courses.findFirst({
    where: (courses, { eq, and }) =>
      and(
        eq(courses.institutionId, institutionId),
        eq(courses.code, courseCode),
      ),
  });

  return course;
};
