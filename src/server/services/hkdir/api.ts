import { env } from "~/env";

type FilterType = "top" | "all" | "item" | "between" | "like" | "lessthan";

interface FilterOptions {
  variabel: string;
  filter: FilterType;
  values: string[];
  exclude?: string[];
}

interface Filter {
  variabel: string;
  selection: {
    filter: FilterType;
    values: string[];
    exclude?: string[];
  };
}

export const createFilter = (opts: FilterOptions): Filter => ({
  variabel: opts.variabel,
  selection: {
    filter: opts.filter,
    values: opts.values,
    exclude: opts.exclude,
  },
});

interface ApiOptions {
  tabell_id: number;
  api_versjon?: number;
  statuslinje?: string;
  begrensning?: string;
  kodetekst?: string;
  desimal_separator?: string;
  groupBy?: string[];
  sortBy?: string[];
  filter?: Filter[];
}

const defaultOptions = {
  api_versjon: 1,
  statuslinje: "N",
  begrensning: "1000",
  kodetekst: "J",
  desimal_separator: ".",
};

export const api = <T>(opts: ApiOptions): Promise<T> => {
  const _opts = { ...defaultOptions, ...opts };

  const URL = `${env.HKDIR_BASE_URL}/api/Tabeller/hentJSONTabellData`;

  return fetch(URL, {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify(_opts),
  }).then((response) => {
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    if (response.status === 204) return [] as unknown as T;

    return response.json() as Promise<T>;
  });
};
