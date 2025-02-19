export type Semester = "fall" | "spring";
export type Grade = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H";
export type FilterType =
  | "top"
  | "all"
  | "item"
  | "between"
  | "like"
  | "lessthan";

export interface SemesterData {
  Institusjonskode: string;
  Institusjonsnavn: string;
  Avdelingskode: string;
  Avdelingsnavn: string;
  Emnekode: string;
  Årstall: string;
  Semester: string;
  Semesternavn: string;
  Karakter: Grade;
  "Antall kandidater totalt": string;
  "Antall kandidater kvinner": string;
  "Antall kandidater menn": string;
}

export interface FormattedSemester {
  id: string;
  courseId: string;
  year: number;
  semester: Semester;
}

export interface FormattedGrade {
  id: string;
  semesterId: string;
  grade: Grade;
  count: number;
  womenCount: number;
  menCount: number;
}

export interface ApiResponse {
  semesters: FormattedSemester[];
  grades: FormattedGrade[];
}
