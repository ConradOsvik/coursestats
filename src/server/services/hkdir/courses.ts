import { api, createFilter } from "./api";
import { ulid } from "ulid";

interface CourseData {
  Institusjonskode: string;
  Institusjonsnavn: string;
  Avdelingskode: string;
  Avdelingsnavn: string;
  Emnekode: string;
  Emnenavn: string;
  Studiepoeng: string;
  "Underv.språk": string;
  Navn: string;
}

export interface FormattedCourseData {
  institution: string;
  department: string;
  code: string;
  name: string;
  credits: number;
  lang: string;
}

export interface DbCourseData extends FormattedCourseData {
  id: string;
}

const institutionInitials: Record<string, string> = {
  "Norges teknisk-naturvitenskapelige universitet": "NTNU",
};

const langs: Record<string, string> = {
  NOR: "NO",
  ENG: "EN",
};

const parseCourseData = (data: CourseData[]): FormattedCourseData | null => {
  const last = data[data.length - 1];
  if (!last) return null;

  const { Institusjonsnavn, Avdelingsnavn, Emnekode, Emnenavn, Studiepoeng } =
    last;

  return {
    institution: institutionInitials[Institusjonsnavn] ?? Institusjonsnavn,
    department: Avdelingsnavn,
    code: Emnekode.split("-")[0] ?? Emnekode,
    name: Emnenavn,
    credits: Number(Studiepoeng),
    lang: langs[last["Underv.språk"]] ?? last["Underv.språk"],
  };
};

export const getCourseData = async (
  institution: number,
  code: string,
): Promise<FormattedCourseData> => {
  const data = await api<CourseData[]>({
    tabell_id: 208,
    variabler: [
      "Institusjonskode",
      "Avdelingskode",
      "Emnekode",
      "Emnenavn",
      "Studiepoeng",
      "Underv.språk",
    ],
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
        filter: "top",
        values: ["1"],
      }),
    ],
  });

  const courseData = parseCourseData(data);
  if (!courseData) throw new Error("Course not found");

  return courseData;
};

export const prepareCourseForDb = (
  course: FormattedCourseData,
): DbCourseData => {
  return {
    ...course,
    id: ulid(),
  };
};
