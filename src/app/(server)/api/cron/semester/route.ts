import { NextResponse } from "next/server";
import { db } from "~/server/db";
import { grades, semesters } from "~/server/db/schema";
import { getSemester } from "~/server/services/hkdir/get-semester";

export async function GET() {
  const today = new Date();
  const day = today.getDate();
  const month = today.getMonth() + 1;

  if (!((month === 10 && day === 16) || (month === 2 && day === 16))) {
    return NextResponse.json(
      { error: "This API can only be called on October 16th or February 16th" },
      { status: 403 },
    );
  }

  const semester = month === 10 ? "spring" : "fall";
  const year = month === 10 ? today.getFullYear() : today.getFullYear() - 1;

  try {
    const courseIds = await db.query.courses.findMany({
      columns: {
        id: true,
      },
    });

    const semesterData = await Promise.all(
      courseIds.map(async ({ id }) => {
        const data = await getSemester(id, year, semester);

        return data;
      }),
    );

    await Promise.all([
      db
        .insert(semesters)
        .values(semesterData.flatMap((data) => data.semesters))
        .onConflictDoNothing(),
      db
        .insert(grades)
        .values(semesterData.flatMap((data) => data.grades))
        .onConflictDoNothing(),
    ]);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
