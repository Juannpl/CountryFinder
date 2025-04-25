<!-- components/ExportButton.vue -->
<template>
  <div class="flex justify-center gap-2 pt-4">
    <button @click="exportCSV" class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
      Exporter CSV
    </button>
    <button @click="exportXLSX" class="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">
      Exporter XLSX
    </button>
  </div>
</template>
  
<script setup lang="ts">
import * as XLSX from 'xlsx'
  
const props = defineProps<{
  data: any[]
  filename: string
}>()
  
const exportCSV = () => {
  const headers = Object.keys(props.data[0] || {})
  const rows = props.data.map(obj => headers.map(header => obj[header]))
  const csv = [headers.join(','), ...rows.map(row => row.join(','))].join('\n')
 
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', `${props.filename}.csv`)
  link.click()
}
  
const exportXLSX = () => {
  const worksheet = XLSX.utils.json_to_sheet(props.data)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Feuille1')
  XLSX.writeFile(workbook, `${props.filename}.xlsx`)
}
</script>
  