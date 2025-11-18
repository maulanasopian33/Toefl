<template>
  <ClientOnly>
    <apexchart
      type="area"
      height="260"
      :options="options"
      :series="series"
    />
  </ClientOnly>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  categories: {
    type: Array,
    required: true,
  },
  data: {
    type: Array,
    required: true,
  },
});

const series = computed(() => [
  {
    name: 'Pendapatan',
    data: props.data,
  },
]);

const options = computed(() => ({
  chart: {
    toolbar: { show: false },
    zoom: { enabled: false },
    fontFamily:
      'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  dataLabels: { enabled: false },
  stroke: {
    curve: 'smooth',
    width: 2,
  },
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 0.5,
      opacityFrom: 0.45,
      opacityTo: 0,
    },
  },
  xaxis: {
    categories: props.categories,
    labels: {
      style: { fontSize: '11px' },
    },
  },
  yaxis: {
    labels: {
      formatter: (val) =>
        new Intl.NumberFormat('id-ID', {
          style: 'currency',
          currency: 'IDR',
          notation: 'compact',
          maximumFractionDigits: 1,
        }).format(val || 0),
      style: { fontSize: '11px' },
    },
  },
  tooltip: {
    y: {
      formatter: (val) =>
        new Intl.NumberFormat('id-ID', {
          style: 'currency',
          currency: 'IDR',
          minimumFractionDigits: 0,
        }).format(val || 0),
    },
  },
}));
</script>
