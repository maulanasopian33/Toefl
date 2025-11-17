<template>
  <div class="card">
    <h3 class="card-title flex items-center gap-2">
      <Icon name="lucide:pie-chart" class="text-gray-500" />
      Status Pembayaran Peserta
    </h3>
    <div class="mt-4" style="height: 250px; position: relative;">
      <Doughnut v-if="chartData.datasets[0].data.length" :data="chartData" :options="chartOptions" />
      <div v-else class="flex items-center justify-center h-full">
        <p class="text-gray-500">Tidak ada data pembayaran untuk ditampilkan.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { Doughnut } from 'vue-chartjs';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const props = defineProps({
  participants: {
    type: Array,
    required: true,
  },
});

const paymentSummary = computed(() => {
  const summary = {
    Paid: 0,
    Pending: 0,
    Unpaid: 0,
  };

  props.participants.forEach(p => {
    if (summary.hasOwnProperty(p.paymentStatus)) {
      summary[p.paymentStatus]++;
    }
  });

  return summary;
});

const chartData = computed(() => ({
  labels: ['Lunas (Paid)', 'Pending', 'Belum Bayar (Unpaid)'],
  datasets: [
    {
      backgroundColor: ['#10B981', '#F59E0B', '#EF4444'],
      data: [
        paymentSummary.value.Paid,
        paymentSummary.value.Pending,
        paymentSummary.value.Unpaid,
      ],
    },
  ],
}));

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
    },
  },
};
</script>