import { env } from "~/env";
import type {
  Semester,
  FilterType,
  SemesterData,
} from "~/server/services/hkdir/types";

interface Filter {
  variabel: string;
  selection: {
    filter: FilterType;
    values: string[];
    exclude?: string[];
  };
}

const createFilter = (
  name: string,
  filterType: FilterType,
  values: string[],
  exclude: string[] = [""],
): Filter => ({
  variabel: name,
  selection: {
    filter: filterType,
    values,
    exclude,
  },
});

const getSemesterId = (semester: Semester): number =>
  semester === "spring" ? 1 : 3;

const buildQuery = (filter: Filter[]) => ({
  tabell_id: 308,
  api_versjon: 1,
  statuslinje: "N",
  begrensning: "1000",
  kodetekst: "J",
  desimal_separator: ".",
  groupBy: [
    "Institusjonskode",
    "Avdelingskode",
    "Emnekode",
    "Årstall",
    "Semester",
    "Karakter",
  ],
  sortBy: ["Institusjonskode", "Avdelingskode"],
  filter,
});

export const fetchData = async (
  courseCode: string,
  year?: number,
  semester?: Semester,
) => {
  const URL = `${env.HKDIR_BASE_URL}/api/Tabeller/hentJSONTabellData`;

  const filters = [
    createFilter("Institusjonskode", "item", ["1150"]),
    createFilter("Emnekode", "like", [`${courseCode}-%`]),
    ...(year ? [createFilter("Årstall", "item", [String(year)])] : []),
    ...(semester
      ? [createFilter("Semester", "item", [String(getSemesterId(semester))])]
      : [createFilter("Semester", "item", ["1", "3"])]),
  ];

  const response = await fetch(URL, {
    method: "POST",
    body: JSON.stringify(buildQuery(filters)),
    headers: { "Content-type": "application/json" },
  });

  if (!response.ok) throw new Error("Failed to fetch data");
  if (response.status === 204) return [];

  return response.json() as Promise<SemesterData[]>;
};
