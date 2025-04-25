<template>
  <div class="relative w-64">
    <input
      type="text"
      v-model="search"
      placeholder="Rechercher un pays..."
      class="border bg-gray-800 text-white px-3 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
      @input="onSearch"
      @focus="isFocused = true"
      @blur="handleBlur"
    />
  
    <ul
      v-if="isFocused && suggestions.length"
      class="absolute z-10 bg-gray-800 text-white border mt-1 rounded w-full shadow-lg"
    >
      <li
        v-for="country in suggestions"
        :key="country.cca3"
        @click="goToCountry(country.cca3)"
        class="px-3 py-2 hover:bg-gray-700 cursor-pointer"
      >
        {{ country.name.common }}
      </li>
    </ul>
  </div>
</template>
  
<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCountryStore } from '@/stores/useCountryStore'

const store = useCountryStore()
const router = useRouter()
  
const search = ref('')
const suggestions = ref<any[]>([])
const isFocused = ref(false)

const handleBlur = () => {
  setTimeout(() => {
    isFocused.value = false
  }, 150)
}

  
const onSearch = () => {
  const query = search.value.trim().toLowerCase()
  if (!query) {
    suggestions.value = []
    return
  }
  
  suggestions.value = store.countries.filter((c) =>
    c.name.common.toLowerCase().includes(query)
  ).slice(0, 5)
}
  
import { nextTick } from 'vue';

const goToCountry = (code: string) => {
  console.log("Clicked on country:", code);
  nextTick(() => {
    router.push(`/country/${code}`);
  });
  search.value = '';
  suggestions.value = [];
};

</script>
