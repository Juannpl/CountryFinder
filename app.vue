<template>
  <div class="bg-slate-950 min-h-screen">
    <Navbar />
    <NuxtPage />
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
