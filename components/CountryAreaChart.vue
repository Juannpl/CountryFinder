<template>
  <div class="flex justify-center mt-10">
    <div class="max-w-4xl w-full">
      <canvas ref="areaChartRef"></canvas>
      <ExportButton :data="exportData" filename="superficies_pays" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import {
  Chart,
  BarElement,
  CategoryScale,
  LinearScale,
  BarController,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import { useCountryStore } from "@/stores/useCountryStore";
import ExportButton from "@/components/ExportButton.vue";

Chart.register(
  BarElement,
  CategoryScale,
  LinearScale,
  BarController,
  Tooltip,
  Legend,
  Title
);

const areaChartRef = ref<HTMLCanvasElement | null>(null);
const store = useCountryStore();

// Préparer les 10 plus grands pays par superficie
const largestCountries = computed(() => {
  return [...store.countries]
    .filter((c) => typeof c.area === "number")
    .sort((a, b) => b.area - a.area)
    .slice(0, 10);
});

const exportData = computed(() =>
  largestCountries.value.map((c) => ({
    pays: c.translations.fra.common,
    superficie: c.area,
  }))
);

onMounted(() => {
  if (!store.countries.length) {
    store.fetchCountries().then(renderChart);
  } else {
    renderChart();
  }
});

function renderChart() {
  if (!areaChartRef.value) return;

  const labels = largestCountries.value.map((c) => c.translations.fra.common);
  const areas = largestCountries.value.map((c) => c.area);

  new Chart(areaChartRef.value, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Superficie (km²)",
          data: areas,
          backgroundColor: "rgba(59, 130, 246, 0.6)",
          borderColor: "rgba(59, 130, 246, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          labels: { color: "#e5e7eb" },
        },
        title: {
          display: true,
          text: "Top 10 des pays par superficie",
          color: "#e5e7eb",
          font: { size: 18 },
        },
      },
      scales: {
        x: {
          ticks: { color: "#e5e7eb" },
          grid: { color: "#4b5563" },
        },
        y: {
          beginAtZero: true,
          ticks: {
            color: "#e5e7eb",
            callback: (value) => Number(value).toLocaleString(),
          },
          grid: {
            color: "#4b5563",
          },
        },
      },
    },
  });
}
</script>
