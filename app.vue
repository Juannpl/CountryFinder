<template>
  <div class="bg-slate-950 min-h-screen">
    <Navbar />
    <div v-if="store.isLoading" role="status" class="p-6">Chargement des pays...</div>
    <div v-else-if="store.error" role="alert" class="p-6 text-red-400">
      {{ store.error }}
      <button class="ml-4 underline" @click="store.fetchCountries()">Réessayer</button>
    </div>
    <NuxtPage v-else-if="store.countries.length" />
    <FooterType />
  </div>
</template>

<script setup>
import Navbar from '~/components/Navbar.vue'
import { onMounted } from 'vue'
import { useCountryStore } from '@/stores/useCountryStore'
import FooterType from './components/FooterType.vue'

const store = useCountryStore()

onMounted(async () => {
  await store.fetchCountries()
})
</script>
