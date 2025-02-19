import type {
  Semester,
  SemesterData,
  FormattedSemester,
  FormattedGrade,
} from "~/server/services/hkdir/types";
import { ulid } from "ulid";

export const trimCourseCode = (courseCode: string): string =>
  !courseCode.includes("-")
    ? courseCode
    : courseCode.slice(0, courseCode.indexOf("-"));

export const getSemesterFromId = (id: string): Semester => {
  const semesters: Record<string, Semester> = {
    "1": "spring",
    "3": "fall",
  };

  if (!semesters[id]) throw new Error("Invalid semester id");
  return semesters[id];
};

const createGrade = (
  semesterId: string,
  entry: SemesterData,
  count: number,
  womenCount: number,
  menCount: number,
): FormattedGrade => ({
  id: ulid(),
  semesterId,
  grade: entry.Karakter,
  count,
  womenCount,
  menCount,
});

export const createSemester = (
  courseId: string,
  year: number,
  semester: Semester,
): FormattedSemester => ({
  id: ulid(),
  courseId,
  year,
  semester,
});

export const formatSemesterData = (data: SemesterData[]) => {
  const result = data.reduce(
    (acc, entry) => {
      const courseId = trimCourseCode(entry.Emnekode);
      const year = parseInt(entry.Årstall, 10);
      const semester = getSemesterFromId(entry.Semester);
      const key = `${courseId}-${year}-${semester}`;

      if (!acc[key]) {
        acc[key] = {
          semester: createSemester(courseId, year, semester),
          grades: [],
        };
      }

      const count = parseInt(entry["Antall kandidater totalt"], 10) || 0;
      const womenCount = parseInt(entry["Antall kandidater kvinner"], 10) || 0;
      const menCount = parseInt(entry["Antall kandidater menn"], 10) || 0;

      const grade = createGrade(
        acc[key].semester.id,
        entry,
        count,
        womenCount,
        menCount,
      );
      acc[key].grades.push(grade);

      return acc;
    },
    {} as Record<
      string,
      { semester: FormattedSemester; grades: FormattedGrade[] }
    >,
  );

  return {
    semesters: Object.values(result).map((item) => item.semester),
    grades: Object.values(result).flatMap((item) => item.grades),
  };
};
