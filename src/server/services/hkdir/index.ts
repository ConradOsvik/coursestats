import {
  getCourseData,
  prepareCourseForDb,
  type DbCourseData,
} from "./courses";
import {
  getAllSemestersData,
  prepareSemesterDataForDb,
  type DbSemesterData,
  type DbGradeData,
} from "./semesters";

export interface CourseWithSemestersResult {
  course: DbCourseData;
  semesters: DbSemesterData[];
  grades: DbGradeData[];
  fullSemesters: Array<DbSemesterData & { grades: DbGradeData[] }>;
}

export const getCourseAndSemestersData = async (
  institution: number,
  code: string,
): Promise<CourseWithSemestersResult> => {
  const [rawCourseData, rawSemestersData] = await Promise.all([
    getCourseData(institution, code),
    getAllSemestersData(institution, code),
  ]);

  const course = prepareCourseForDb(rawCourseData);

  const { semesters, grades, fullSemesters } = prepareSemesterDataForDb(
    rawSemestersData,
    course.id,
  );

  return {
    course,
    semesters,
    grades,
    fullSemesters,
  };
};

export const getLatestSemesterForCourse = async (
  institution: number,
  code: string,
  courseId: string,
): Promise<{
  semesters: DbSemesterData[];
  grades: DbGradeData[];
  fullSemesters: Array<DbSemesterData & { grades: DbGradeData[] }>;
}> => {
  const rawSemestersData = await getAllSemestersData(institution, code);

  const latestSemester = [...rawSemestersData].sort((a, b) => {
    if (a.year !== b.year) return b.year - a.year;
    const semValue = (sem: string) => (sem === "spring" ? 1 : 3);
    return semValue(b.semester) - semValue(a.semester);
  })[0];

  if (!latestSemester) {
    return {
      semesters: [],
      grades: [],
      fullSemesters: [],
    };
  }

  return prepareSemesterDataForDb([latestSemester], courseId);
};
