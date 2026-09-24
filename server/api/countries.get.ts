import { loadCountries } from '../../shared/countries';

export default defineCachedEventHandler(async (event) => {
  const { restCountriesApiKey } = useRuntimeConfig(event);
  if (!restCountriesApiKey) {
    throw createError({ statusCode: 503, statusMessage: 'Configuration REST Countries manquante.' });
  }
  try {
    return await loadCountries(offset => $fetch('https://api.restcountries.com/countries/v5', {
      headers: { Authorization: `Bearer ${restCountriesApiKey}` },
      query: {
        limit: 100, offset,
        response_fields: 'uuid,names,codes,capitals,region,population,area,flag,languages,currencies,demonyms',
      },
      timeout: 15000,
      retry: 0,
    }));
  } catch (error: unknown) {
    const status = (error as { response?: { status?: number } }).response?.status;
    const message = status === 401 || status === 403
      ? 'Accès REST Countries refusé. Vérifiez la clé API côté serveur.'
      : status === 429
        ? 'Quota REST Countries atteint. Réessayez plus tard.'
        : 'Les données des pays sont temporairement indisponibles.';
    throw createError({ statusCode: 502, statusMessage: message });
  }
}, { maxAge: 3600, swr: false });
