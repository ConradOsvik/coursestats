import { api, createFilter } from "./api";
import { getYear, isBefore, startOfDay } from "date-fns";

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

export const getLatestSemester = async (institution: number, id: string) => {
  const { id: semesterId, year } = getLatestSemesterId();

  const data = await api({
    tabell_id: 308,
    filter: [
      createFilter({
        variabel: "Institusjonskode",
        filter: "item",
        values: [String(institution)],
      }),
      createFilter({
        variabel: "Emnekode",
        filter: "like",
        values: [`${id}-%`],
      }),
      createFilter({
        variabel: "Årstall",
        filter: "item",
        values: [String(year)],
      }),
      createFilter({
        variabel: "Semester",
        filter: "item",
        values: [String(semesterId)],
      }),
    ],
  });
};

export const getAllSemesters = async (institution: number, id: string) => {
  const data = await api({
    tabell_id: 308,
    filter: [
      createFilter({
        variabel: "Institusjonskode",
        filter: "item",
        values: [String(institution)],
      }),
      createFilter({
        variabel: "Emnekode",
        filter: "like",
        values: [`${id}-%`],
      }),
      createFilter({
        variabel: "Semester",
        filter: "item",
        values: ["1", "3"],
      }),
    ],
  });
};
