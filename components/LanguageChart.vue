<template>
  <div class="max-w-lg mx-auto">
    <Pie :data="chartData" :options="chartOptions" />
    <ExportButton :data="exportData" filename="langues_par_pays" />
  </div>
</template>
  
<script setup lang="ts">
import { computed } from 'vue'
import { Pie } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js'
import type { ChartOptions } from 'chart.js'
import { useCountryStore } from '@/stores/useCountryStore'
import ExportButton from '@/components/ExportButton.vue'

// 👇 Convertir les données chart.js en tableau exploitable
const exportData = computed(() => {
  const entries = Object.entries(languageCounts.value)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)

  return entries.map(([langue, nombreDePays]) => ({
    langue,
    nombreDePays
  }))
})

  
ChartJS.register(Title, Tooltip, Legend, ArcElement)
  
const store = useCountryStore()
  
const languageCounts = computed(() => {
  const counts: Record<string, number> = {}
  
  store.countries.forEach(country => {
    const languages = country.languages
    if (languages) {
      Object.values(languages).forEach(lang => {
        counts[lang as string] = (counts[lang as string] || 0) + 1
      })
    }
  })
  
  return counts
})
  
const chartData = computed(() => {
  const entries = Object.entries(languageCounts.value)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
  
  return {
    labels: entries.map(([lang]) => lang),
    datasets: [
      {
        label: 'Nombre de pays',
        data: entries.map(([, count]) => count),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
          '#F7464A',
          '#46BFBD',
          '#FDB45C',
          '#949FB1'
        ]
      }
    ]
  }
})
  
const chartOptions: ChartOptions<'pie'> = {
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        color: '#e5e7eb',
      },
    },
    title: {
      display: true,
      text: 'Langues les plus parlées (par nombre de pays)',
      color: '#e5e7eb',
    },
  },
  elements: {
    arc: {
      borderWidth: 1,
      borderColor: '#1f2937',
    },
  },
  animations: {
    tension: {
      duration: 1000,
      easing: 'easeOutBounce',
    },
  },
}

</script>
  