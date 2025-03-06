import { api, createFilter } from "./api";
import { getYear, isBefore, startOfDay } from "date-fns";
import { type SEMESTERS } from "~/lib/constants";
import { ulid } from "ulid";

interface SemesterData {
  Emnekode: string;
  Årstall: string;
  Semester: string;
  Semesternavn: string;
  Karakter: string;
  "Antall kandidater totalt": string;
  "Antall kandidater kvinner": string;
  "Antall kandidater menn": string;
}

export interface FormattedGradeData {
  grade: string;
  count: number;
  womenCount: number;
  menCount: number;
}

export interface FormattedSemesterData {
  year: number;
  semester: (typeof SEMESTERS)[number];
  grades: FormattedGradeData[];
}

export interface DbSemesterData {
  id: string;
  courseId: string;
  year: number;
  semester: (typeof SEMESTERS)[number];
}

export interface DbGradeData {
  id: string;
  semesterId: string;
  grade: string;
  count: number;
  womenCount: number;
  menCount: number;
}

const parseSemesterData = (data: SemesterData[]): FormattedSemesterData[] => {
  const semesterMap = new Map<string, FormattedSemesterData>();

  data.forEach((entry) => {
    const year = parseInt(entry.Årstall, 10);
    const semester = entry.Semester === "1" ? "spring" : "fall";
    const key = `${year}-${semester}`;

    const grade = {
      grade: entry.Karakter,
      count: parseInt(entry["Antall kandidater totalt"], 10) || 0,
      womenCount: parseInt(entry["Antall kandidater kvinner"], 10) || 0,
      menCount: parseInt(entry["Antall kandidater menn"], 10) || 0,
    };

    if (!semesterMap.has(key)) {
      semesterMap.set(key, { year, semester, grades: [grade] });
    } else {
      semesterMap.get(key)!.grades.push(grade);
    }
  });

  return Array.from(semesterMap.values());
};

const getCurrentSemesterId = () => {
  const currentDate = new Date();
  const currentYear = getYear(currentDate);

  const feb15 = startOfDay(new Date(currentYear, 1, 15));
  const oct15 = startOfDay(new Date(currentYear, 9, 15));

  if (isBefore(currentDate, feb15)) {
    return { id: 3, year: currentYear - 1 }; // Fall of previous year
  }

  if (isBefore(currentDate, oct15)) {
    return { id: 1, year: currentYear }; // Spring of current year
  }

  return { id: 3, year: currentYear }; // Fall of current year
};

export const getLatestSemesterData = async (
  institution: number,
  code: string,
) => {
  const { id, year } = getCurrentSemesterId();

  const data = await api<SemesterData[]>({
    tabell_id: 308,
    groupBy: ["Emnekode", "Årstall", "Semester", "Karakter"],
    sortBy: ["Årstall", "Semester", "Karakter"],
    filter: [
      createFilter({
        variabel: "Institusjonskode",
        filter: "item",
        values: [String(institution)],
      }),
      createFilter({
        variabel: "Emnekode",
        filter: "like",
        values: [`${code}-%`],
      }),
      createFilter({
        variabel: "Årstall",
        filter: "item",
        values: [String(year)],
      }),
      createFilter({
        variabel: "Semester",
        filter: "item",
        values: [String(id)],
      }),
    ],
  });

  return parseSemesterData(data);
};

export const getAllSemestersData = async (
  institution: number,
  code: string,
) => {
  const data = await api<SemesterData[]>({
    tabell_id: 308,
    groupBy: ["Emnekode", "Årstall", "Semester", "Karakter"],
    sortBy: ["Årstall", "Semester", "Karakter"],
    filter: [
      createFilter({
        variabel: "Institusjonskode",
        filter: "item",
        values: [String(institution)],
      }),
      createFilter({
        variabel: "Emnekode",
        filter: "like",
        values: [`${code}-%`],
      }),
      createFilter({
        variabel: "Semester",
        filter: "item",
        values: ["1", "3"],
      }),
    ],
  });

  return parseSemesterData(data);
};

export const prepareSemesterDataForDb = (
  semesters: FormattedSemesterData[],
  courseId: string,
): {
  semesters: DbSemesterData[];
  grades: DbGradeData[];
  fullSemesters: Array<DbSemesterData & { grades: DbGradeData[] }>;
} => {
  const preparedSemesters = semesters.map((semester) => {
    const semesterId = ulid();

    const preparedGrades = semester.grades.map(
      (grade): DbGradeData => ({
        ...grade,
        id: ulid(),
        semesterId,
      }),
    );

    return {
      semester: semester.semester,
      year: semester.year,
      courseId,
      id: semesterId,
      grades: preparedGrades,
    };
  });

  const semestersForDb = preparedSemesters.map(
    ({ grades, ...rest }): DbSemesterData => rest,
  );
  const gradesForDb = preparedSemesters.flatMap((semester) => semester.grades);

  return {
    semesters: semestersForDb,
    grades: gradesForDb,
    fullSemesters: preparedSemesters,
  };
};
