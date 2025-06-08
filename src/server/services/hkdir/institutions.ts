import { api, createFilter } from "./api";

interface InstitutionData {
  Institusjonskode: string;
  Institusjonsnavn: string;
  Adresse: string;
  Postnummer: string;
  "Gyldig fra": string;
  "Gyldig til": string;
  Nettside: string;
  Telefon: string;
  Institusjonstypekode: string;
  Kortnavn: string;
}

export const getInstitutionsData = async () => {
  const data = await api<InstitutionData[]>({
    tabell_id: 211,
    variabler: ["*"],
    sortBy: ["Institusjonskode (sammenslått)"],
    filter: [
      createFilter({
        variabel: "Institusjonskode (sammenslått)",
        filter: "all",
        values: ["*"],
      }),
      createFilter({
        variabel: "Institusjonstypekode",
        filter: "item",
        values: ["11"],
      }),
    ],
  });
};
