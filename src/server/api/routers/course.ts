import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { env } from "~/env";
import * as cheerio from "cheerio";
import { courses, grades, semesters } from "~/server/db/schema";
import { getSemesters } from "~/server/services/hkdir/get-semesters";
import { TRPCError } from "@trpc/server";
import { and } from "drizzle-orm";

function parseTitle(title: string) {
  const [id, name] = title.split("-").map((str) => str.trim());
  return { id, name };
}

async function getCourseData(code: string) {
  const url = `${env.NTNU_BASE_URL}/${code.toUpperCase()}`;
  const data = await fetch(url).then((res) => res.text());
  const $ = cheerio.load(data);

  const details = $("#course-details");
  if (!details) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Course not found",
    });
  }

  const title = details.find("h1").first().text();
  if (!title || title === "Ingen info for gitt studieår") {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Course not found",
    });
  }

  const { id, name } = parseTitle(title);
  if (!name || !(id === code)) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Course not found",
    });
  }

  return { id, name };
}

export const courseRouter = createTRPCRouter({
  getCourse: publicProcedure
    .input(z.object({ institution: z.string(), code: z.string() }))
    .query(async ({ input, ctx }) => {
      const { institution, code: _code } = input;
      const code = _code.toUpperCase();

      const course = await ctx.db.query.courses.findFirst({
        where: (courses, { eq }) =>
          and(eq(courses.institution, institution), eq(courses.code, code)),
        with: {
          semesters: {
            with: {
              grades: true,
            },
          },
        },
      });

      if (course) {
        return course;
      }

      const [courseData, semestersData] = await Promise.all([
        getCourseData(code),
        getSemesters(code),
      ]);

      await Promise.all([
        ctx.db
          .insert(courses)
          .values({
            institution,
            code,
            name: courseData.name,
          })
          .onConflictDoNothing(),
        ctx.db
          .insert(semesters)
          .values(semestersData.semesters)
          .onConflictDoNothing(),
        ctx.db
          .insert(grades)
          .values(semestersData.grades)
          .onConflictDoNothing(),
      ]);

      return {
        ...courseData,
        semesters: semestersData.semesters.map((semester) => ({
          ...semester,
          grades: semestersData.grades.filter(
            (grade) => grade.semesterId === semester.id,
          ),
        })),
      };
    }),
});
