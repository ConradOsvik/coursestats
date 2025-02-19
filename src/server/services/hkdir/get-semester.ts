import type { Semester } from "~/server/services/hkdir/types";
import { fetchData } from "~/server/services/hkdir/client";
import { formatSemesterData } from "~/server/services/hkdir/helpers";

export const getSemester = async (
  courseCode: string,
  year: number,
  semester: Semester,
) => fetchData(courseCode, year, semester).then(formatSemesterData);
