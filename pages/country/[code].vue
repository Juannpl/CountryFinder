<template>
  <div class="p-6 max-w-4xl mx-auto">
    <button @click="$router.back()" class="mb-4 text-blue-600 hover:underline">
      ← Retour
    </button>
  
    <div v-if="country" class="bg-opacity-0 border-1 border-gray-800 rounded-xl shadow-md p-6 ">
      <div class="flex flex-col md:flex-row gap-6 items-center md:items-start">
        <img :src="country.flags?.svg" :alt="country.flags?.alt" class="w-32 h-auto rounded-md shadow" />
 
        <div class="flex-1 space-y-3">
          <h1 class="text-3xl font-bold">{{ country.name.common }}</h1>
          <p class="text-gray-500"><span class="font-semibold">Nom officiel :</span> {{ country.name.official }}</p>
          <p><span class="font-semibold">Capitale :</span> {{ country.capital?.[0] ?? 'N/A' }}</p>
          <p><span class="font-semibold">Continent :</span> {{ country.region }}</p>
          <p><span class="font-semibold">Population :</span> {{ country.population.toLocaleString() }}</p>
          <p><span class="font-semibold">Langues :</span> {{ languages }}</p>
          <p><span class="font-semibold">Devise :</span> {{ currencies }}</p>
          <p><span class="font-semibold">Démonyme féminin :</span> {{ country.demonyms.fra.f }}</p>
          <p><span class="font-semibold">Démonyme macsulin :</span> {{ country.demonyms.fra.m }}</p>
        </div>
      </div>
 
      <div class="mt-6">
        <a
          :href="`https://en.wikipedia.org/wiki/${country.name.common}`"
          target="_blank"
          class="text-sm text-blue-500 hover:underline"
        >
          🔗 Plus d’infos sur Wikipedia
        </a>
      </div>
    </div>
 
    <p v-else class="text-center text-gray-600">Pays introuvable 😕</p>
  </div>
</template>
  
<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useCountryStore } from '@/stores/useCountryStore'
  
const store = useCountryStore()
const route = useRoute()
  
const country = computed(() =>
  store.countries.find(c => c.cca3 === route.params.code)
)
  
const languages = computed(() => {
  const langs = country.value?.languages as Record<string, string>
  return langs ? Object.values(langs).join(', ') : 'N/A'
})
 
const currencies = computed(() => {
  const curr = country.value?.currencies as Record<string, { name: string, symbol: string }>
  return curr
    ? Object.values(curr).map(c => `${c.name} (${c.symbol})`).join(', ')
    : 'N/A'
})
</script>
  