export interface ApiCountry {
  uuid?: string;
  names: { common: string; official?: string; translations?: Record<string, { common: string; official?: string }> };
  codes: { alpha_2: string; alpha_3: string };
  capitals?: { name: string }[];
  region?: string;
  population?: number;
  area?: { kilometers?: number };
  flag?: { url_svg?: string; url_png?: string; description?: string };
  languages?: { iso639_3: string; name: string }[];
  currencies?: { code: string; name: string; symbol?: string }[];
  demonyms?: Record<string, { f?: string; m?: string }>;
}

export function normalizeCountry(c: ApiCountry) {
  if (!c?.names?.common || !(c?.codes?.alpha_3 || c?.uuid)) throw new Error('Invalid country');
  return {
    name: { common: c.names.common, official: c.names.official || c.names.common },
    translations: { fra: c.names.translations?.fra || { common: c.names.common } },
    id: c.codes.alpha_3 || c.uuid!,
    cca2: c.codes.alpha_2,
    cca3: c.codes.alpha_3,
    capital: (c.capitals || []).map(capital => capital.name),
    region: c.region || 'Inconnu',
    population: typeof c.population === 'number' ? c.population : null,
    area: typeof c.area?.kilometers === 'number' ? c.area.kilometers : null,
    flags: { svg: c.flag?.url_svg, png: c.flag?.url_png, alt: c.flag?.description || `Drapeau ${c.names.common}` },
    languages: Object.fromEntries((c.languages || []).map(l => [l.iso639_3, l.name])),
    currencies: Object.fromEntries((c.currencies || []).map(c => [c.code, { name: c.name, symbol: c.symbol || '' }])),
    demonyms: c.demonyms || {},
  };
}

export type Country = ReturnType<typeof normalizeCountry>;

interface CountriesPage {
  data: { objects: ApiCountry[]; _demo?: unknown; meta: { total: number; more?: boolean } };
}

export async function loadCountries(fetchPage: (offset: number) => Promise<CountriesPage>) {
  const countries: Country[] = [];
  for (let page = 0; page < 20; page++) {
    const response = await fetchPage(countries.length);
    const data = response?.data;
    if (data?._demo || !Array.isArray(data?.objects) || !Number.isInteger(data.meta?.total) || data.meta.total < 1) {
      throw new Error('Invalid countries response');
    }
    if (!data.objects.length) throw new Error('Incomplete countries response');
    countries.push(...data.objects.map(normalizeCountry));
    if (new Set(countries.map(c => c.id)).size !== countries.length) throw new Error('Duplicate countries');
    if (countries.length === data.meta.total) return countries;
    if (countries.length > data.meta.total || data.meta.more === false) throw new Error('Inconsistent pagination');
  }
  throw new Error('Pagination limit exceeded');
}
