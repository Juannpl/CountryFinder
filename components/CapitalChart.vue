<template>
  <div class="flex justify-center mt-10">
    <div class="max-w-[1000px] w-full">
      <h2 class="text-xl font-semibold mb-2">Top 10 des capitales par population</h2>
      <canvas ref="populationChartRef"></canvas>
      <ExportButton :data="exportData" filename="capitale_par_population" />

    </div>
  </div>
</template>
  
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Chart, BarController, BarElement, CategoryScale, LinearScale, Tooltip, Title } from 'chart.js'
import type { ChartOptions } from 'chart.js'
import { useCountryStore } from '@/stores/useCountryStore'
import ExportButton from '@/components/ExportButton.vue'
import { computed } from 'vue'
  
Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Title)
  
const store = useCountryStore()
const populationChartRef = ref<HTMLCanvasElement | null>(null)

const exportData = computed(() => {
  return store.countries
    .filter(c => c.capital?.length && c.population)
    .sort((a, b) => b.population - a.population)
    .slice(0, 10)
    .map(c => ({
      capitale: c.capital[0],
      pays: c.name.common,
      population: c.population,
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
  const withCapital = store.countries
    .filter(c => c.capital?.length && c.population)
    .sort((a, b) => b.population - a.population)
    .slice(0, 10)
  
  const data = {
    labels: withCapital.map(c => c.capital[0]),
    datasets: [
      {
        label: 'Population',
        data: withCapital.map(c => c.population),
        backgroundColor: '#36A2EB',
      },
    ],
  }
  
  const options: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Population des capitales les plus peuplées',
        color: '#e5e7eb', // gris clair
      },
      legend: {
        labels: {
          color: '#e5e7eb',
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#e5e7eb',
        },
        grid: {
          color: '#4b5563', // gris foncé
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: '#e5e7eb',
          callback: value => Number(value).toLocaleString(),
        },
        grid: {
          color: '#4b5563',
        },
      },
    },
  }

  
  if (populationChartRef.value) {
    new Chart(populationChartRef.value, {
      type: 'bar',
      data,
      options,
    })
  }
}
</script>
  