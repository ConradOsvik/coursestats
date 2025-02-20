import { api, createFilter } from "./api";
import { getYear, isBefore, startOfDay } from "date-fns";
import { SEMESTERS } from "~/lib/constants";

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

interface FormattedGradeData {
  grade: string;
  count: number;
  womenCount: number;
  menCount: number;
}

interface FormattedSemesterData {
  year: number;
  semester: (typeof SEMESTERS)[number];
  grades: FormattedGradeData[];
}

const formatSemesterData = (data: SemesterData[]): FormattedSemesterData[] => {
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

const getLatestSemesterId = () => {
  const currentDate = new Date();
  const currentYear = getYear(currentDate);

  const feb15 = startOfDay(new Date(currentYear, 1, 15));
  const oct15 = startOfDay(new Date(currentYear, 9, 15));

  if (isBefore(currentDate, feb15)) {
    return { id: 3, year: currentYear - 1 };
  }

  if (isBefore(currentDate, oct15)) {
    return { id: 1, year: currentYear };
  }

  return { id: 3, year: currentYear };
};

export const getLatestSemesterData = async (
  institution: number,
  code: string,
) => {
  const { id, year } = getLatestSemesterId();

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

  return formatSemesterData(data);
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

  return formatSemesterData(data);
};
