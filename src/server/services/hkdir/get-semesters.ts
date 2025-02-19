import { fetchData } from "~/server/services/hkdir/client";
import { formatSemesterData } from "~/server/services/hkdir/helpers";

export const getSemesters = async (id: string) =>
  fetchData(id).then(formatSemesterData);
