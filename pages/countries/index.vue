<template>
  <div class="p-6">
    <h1 class="text-2xl mb-4">Liste des pays 🌎</h1>

    <p v-if="store.isLoading">Chargement des pays...</p>
    <p v-if="store.error" class="text-red-500">{{ store.error }}</p>

    <div class="flex items-center gap-4 mb-4">
      <select v-model="selectedContinent" class="border p-2 rounded bg-gray-800 text-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none">
        <option value="" class="text-gray-500">-- Tous les continents --</option>
        <option v-for="region in regions" :key="region" :value="region" class="text-gray-200">
          {{ region }}
        </option>
      </select>

      <button 
        v-if="selectedContinent" 
        @click="resetFilter"
        class="bg-gray-700 text-gray-200 px-4 py-2 rounded hover:bg-gray-600 transition duration-300"
      >
        Réinitialiser
      </button>
    </div>

    <DataTable
      :countries="displayedCountries"
      :sortKey="sortKey"
      :sortOrder="sortOrder"
      :continent="selectedContinent"
      @sort="sortBy"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useCountryStore } from '@/stores/useCountryStore'
import DataTable from '@/components/DataTable.vue'

const store = useCountryStore()

const regions = computed(() => {
  const allRegions = store.countries.map(c => c.region)
  return [...new Set(allRegions)].filter(Boolean)
})

const selectedContinent = ref<string>('')

const defaultSortKey = 'name'
const sortKey = ref<string>(defaultSortKey)
const sortOrder = ref<'asc' | 'desc'>('asc')

const sortBy = (key: string) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortOrder.value = 'asc'
  }
}

const sortCountries = (list: Array<Record<string, any>>) => {
  return [...list].sort((a, b) => {
    const aVal = getSortValue(a, sortKey.value)
    const bVal = getSortValue(b, sortKey.value)

    if (aVal === undefined || bVal === undefined) return 0

    if (typeof aVal === 'string') {
      return sortOrder.value === 'asc'
        ? aVal.localeCompare(bVal as string)
        : (bVal as string).localeCompare(aVal)
    }

    if (typeof aVal === 'number') {
      return sortOrder.value === 'asc'
        ? aVal - (bVal as number)
        : (bVal as number) - aVal
    }

    return 0
  })
}

const getSortValue = (obj: any, key: string): string | number | undefined => {
  switch (key) {
    case 'name':
      return obj.name?.common
    case 'capital':
      return obj.capital?.[0]
    case 'population':
      return obj.population
    case 'area':
      return obj.area
    default:
      return undefined
  }
}

const resetFilter = () => {
  selectedContinent.value = ''
}

const displayedCountries = computed(() => {
  let list = store.countries

  // Filtrage
  if (selectedContinent.value) {
    list = list.filter(c => c.region === selectedContinent.value)
  }

  // Tri
  if (sortKey.value) {
    list = sortCountries(list)
  }

  return list
})

onMounted(() => {
  if (!store.countries.length) {
    store.fetchCountries()
  }
})
</script>

<style scoped>

select {
  background-color: #1a202c;
  border: 1px solid #4a5568;
  color: #edf2f7;
  padding: 0.5rem;
  border-radius: 6px;
  transition: background-color 0.3s ease;
}

select:focus {
  background-color: #2d3748;
  outline: none;
  box-shadow: 0 0 0 2px #4a90e2;
}

option {
  background-color: #1a202c;
  color: #edf2f7;
}

option:hover {
  background-color: #4a5568;
}

button {
  background-color: #4a5568;
  color: #edf2f7;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #2d3748;
}

button:disabled {
  background-color: #2d3748;
  cursor: not-allowed;
}
</style>