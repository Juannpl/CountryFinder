import { defineStore } from 'pinia';
import type { Country } from '~/shared/countries';

export const useCountryStore = defineStore('country', () => {
  const countries = ref<Country[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  let pending: Promise<void> | null = null;

  const fetchCountries = (): Promise<void> => {
    if (pending) return pending;
    if (countries.value.length) return Promise.resolve();
    isLoading.value = true;
    error.value = null;
    pending = $fetch<Country[]>('/api/countries')
      .then(data => { countries.value = data; })
      .catch((err) => {
        error.value = err.data?.statusMessage || 'Erreur lors du chargement des pays.';
      })
      .finally(() => {
        isLoading.value = false;
        pending = null;
      });
    return pending;
  };

  return { countries, isLoading, error, fetchCountries };
});
