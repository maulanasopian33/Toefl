<template>
  <ClientOnly>
    <apexchart
      type="donut"
      height="260"
      :options="options"
      :series="series"
    />
  </ClientOnly>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  paid: {
    type: Number,
    required: true,
  },
  pending: {
    type: Number,
    required: true,
  },
  failed: {
    type: Number,
    required: true,
  },
});

const series = computed(() => [props.paid, props.pending, props.failed]);

const options = {
  labels: ['Lunas', 'Pending', 'Gagal / Refund'],
  legend: {
    position: 'bottom',
    fontSize: '11px',
  },
  dataLabels: { enabled: false },
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
};
</script>
