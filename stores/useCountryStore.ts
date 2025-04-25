import { defineStore } from 'pinia'

export const useCountryStore = defineStore('country', () => {
  const countries = ref<any[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const fetchCountries = async () => {
    isLoading.value = true
    try {
      const res = await fetch('https://restcountries.com/v3.1/all')
      if (!res.ok) throw new Error('Erreur lors de la récupération des pays')
      const data = await res.json()
      countries.value = data
    } catch (err) {
      error.value = 'Erreur lors du chargement des pays.'
    } finally {
      isLoading.value = false
    }
  }

  return { countries, isLoading, error, fetchCountries }
})
