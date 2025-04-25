<template>
  <div class="flex justify-center mt-10">
    <div class="max-w-[1000px] w-full">
      <canvas ref="populationChartRef"></canvas>
      <ExportButton :data="exportData" filename="pays_par_population" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import {
  Chart,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Title,
  Legend
} from 'chart.js'
import type { ChartOptions } from 'chart.js'
import { useCountryStore } from '@/stores/useCountryStore'
import ExportButton from '@/components/ExportButton.vue'

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Title, Legend)

const store = useCountryStore()
const populationChartRef = ref<HTMLCanvasElement | null>(null)

const topPopulatedCountries = computed(() => {
  return store.countries
    .filter(c => c.population && c.name?.common)
    .sort((a, b) => b.population - a.population)
    .slice(0, 10)
})

const exportData = computed(() =>
  topPopulatedCountries.value.map(c => ({
    pays: c.name.common,
    population: c.population,
  }))
)

onMounted(() => {
  if (!store.countries.length) {
    store.fetchCountries().then(renderChart)
  } else {
    renderChart()
  }
})

function renderChart() {
  const countries = topPopulatedCountries.value

  const data = {
    labels: countries.map(c => c.name.common),
    datasets: [
      {
        label: 'Population',
        data: countries.map(c => c.population),
        backgroundColor: 'rgba(59, 130, 246, 0.7)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
    ],
  }

  const options: ChartOptions<'bar'> = {
    indexAxis: 'y',
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Top 10 des pays les plus peuplés',
        color: '#e5e7eb',
        font: { size: 18 },
      },
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw as number
            return `Population : ${value.toLocaleString()}`
          }
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: '#e5e7eb',
          callback: value => Number(value).toLocaleString(),
        },
        grid: {
          color: '#4b5563',
        },
      },
      y: {
        ticks: {
          color: '#e5e7eb',
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
