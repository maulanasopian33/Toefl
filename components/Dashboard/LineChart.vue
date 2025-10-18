<template>
  <div class="bg-white p-6 rounded-xl shadow-md">
    <h3 class="text-lg font-semibold mb-4">{{ title }}</h3>
    <apexchart
      type="line"
      height="300"
      :options="chartOptions"
      :series="series"
    />
  </div>
</template>

<script setup>
const props = defineProps({
  title: String,
  categories: Array,      // contoh: ['Jan','Feb','Mar']
  seriesName: String,     // contoh: 'User Baru'
  data: Array,            // contoh: [5,10,15]
  color: { type: String, default: '#3b82f6' } // Tailwind blue-500
})

const series = [
  {
    name: props.seriesName,
    data: props.data
  }
]

const chartOptions = {
  chart: {
    toolbar: { show: false },
    zoom: { enabled: false },
    type: 'area'
  },
  stroke: {
    curve: 'smooth',
    width: 3
  },
  xaxis: {
    categories: props.categories
  },
  colors: [props.color],
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.4,
      opacityTo: 0.1,
      stops: [0, 90, 100]
    }
  },
  dataLabels: {
    enabled: false
  }
}
</script>
