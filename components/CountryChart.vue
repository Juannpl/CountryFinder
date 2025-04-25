<template>
  <div class="flex justify-center mt-10">
    <div class="max-w-lg w-full">
      <canvas ref="continentChartRef"></canvas>
      <ExportButton :data="exportData" filename="pays_par_continent" />
    </div>
  </div>
</template>

  
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Chart, PieController, ArcElement, Tooltip, Legend, Title } from 'chart.js'
import type { ChartData, ChartOptions } from 'chart.js'
import { useCountryStore } from '@/stores/useCountryStore'
import ExportButton from '@/components/ExportButton.vue'
import { computed } from 'vue'

  
Chart.register(PieController, ArcElement, Tooltip, Legend, Title)
  
const store = useCountryStore()
const continentChartRef = ref<HTMLCanvasElement | null>(null)

const exportData = computed(() => {
  const counts: Record<string, number> = {}

  store.countries.forEach(c => {
    const region = c.region || 'Inconnu'
    counts[region] = (counts[region] || 0) + 1
  })

  return Object.entries(counts).map(([continent, nombreDePays]) => ({
    continent,
    nombreDePays,
  }))
})

  
onMounted(() => {
  if (!store.countries.length) {
    store.fetchCountries().then(renderChart)
  } else {
    renderChart()
  }
})
  
function renderChart() {
  const continentCounts: Record<string, number> = {}
  
  store.countries.forEach(c => {
    const region = c.region || 'Inconnu'
    continentCounts[region] = (continentCounts[region] || 0) + 1
  })
  
  const data: ChartData<'pie'> = {
    labels: Object.keys(continentCounts),
    datasets: [
      {
        label: 'Pays par continent',
        data: Object.values(continentCounts),
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#F67019'
        ],
      },
    ],
  }
  
  const options: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#e5e7eb', // Gris clair pour le texte de la légende
        },
      },
      title: {
        display: true,
        text: 'Répartition des pays par continent',
        color: '#e5e7eb', // Gris clair pour le texte du titre
      },
    },
    elements: {
      arc: {
        borderWidth: 1, // Bordure fine pour les segments
        borderColor: '#1f2937', // Gris très foncé (presque noir) pour les bordures
      },
    },
    animations: {
      tension: {
        duration: 1000, // Animation fluide pour l'affichage
        easing: 'easeOutBounce',
      },
    },
  }
  
  if (continentChartRef.value) {
    new Chart(continentChartRef.value, {
      type: 'pie',
      data,
      options,
    })
  }
}
</script>
  