<template>
  <table class="table-auto w-full mt-4">
    <thead>
      <tr>
        <th 
          @click="$emit('sort', 'name')" 
          class="cursor-pointer border px-4 py-2 w-1/6"
        >
          Pays
          <span v-if="sortKey === 'name'">{{ sortOrder === 'asc' ? '▲' : '▼' }}</span>
        </th>
        <th class="border px-4 py-2 w-1/3 md:w-1/4 lg:w-1/5">Drapeau</th>
        <th 
          @click="$emit('sort', 'capital')" 
          class="cursor-pointer border px-4 py-2 w-1/6"
        >
          Capitale
          <span v-if="sortKey === 'capital'">{{ sortOrder === 'asc' ? '▲' : '▼' }}</span>
        </th>
        <th v-if="!continent" class="border px-4 py-2 w-1/6">Continent</th>
        <th 
          @click="$emit('sort', 'population')" 
          class="cursor-pointer border px-4 py-2 w-1/6"
        >
          Population
          <span v-if="sortKey === 'population'">{{ sortOrder === 'asc' ? '▲' : '▼' }}</span>
        </th>
        <th 
          @click="$emit('sort', 'area')" 
          class="cursor-pointer border px-4 py-2 w-1/6"
        >
          Superficie
          <span v-if="sortKey === 'area'">{{ sortOrder === 'asc' ? '▲' : '▼' }}</span>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr 
        v-for="country in countries" 
        :key="country.cca3" 
        class="border-b border-gray-700 hover:bg-gray-700"
      >
        <td class="border px-4 py-2 text-gray-300">{{ country.translations.fra.common }}</td>
        <td class="border px-4 py-2 text-gray-300">
          <img 
            :src="`https://flagsapi.com/${country.cca2}/shiny/64.png`" 
            :alt="`Drapeau ${country.name.common}`" 
            class="inline ml-2" 
          />
        </td>
        <td class="border px-4 py-2 text-gray-300">{{ country.capital?.[0] ?? 'N/A' }}</td>
        <td v-if="!continent" class="border px-4 py-2 text-gray-300">{{ country.region }}</td>
        <td class="border px-4 py-2 text-gray-300">{{ country.population.toLocaleString() }}</td>
        <td class="border px-4 py-2 text-gray-300">{{ country.area.toLocaleString() }} km²</td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
defineProps<{
  countries: any[]
  sortKey: string
  sortOrder: 'asc' | 'desc'
  continent: string
}>()

defineEmits<{
  (e: 'sort', key: string): void
}>()
</script>

<style scoped>
table {
  background-color: #1a202c;
  color: #edf2f7;
}

th {
  background-color: #2d3748;
  color: #edf2f7;
}

tr:nth-child(even) {
  background-color: #2d3748;
}

tr:hover {
  background-color: #342F45;
}
</style>
