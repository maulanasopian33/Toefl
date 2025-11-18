<template>
  <div class="overflow-x-auto">
    <table class="w-full text-sm min-w-[720px]">
      <thead>
        <tr class="text-left text-xs text-gray-500 bg-gray-50 border-y border-gray-100">
          <th class="px-4 py-3 font-semibold">
            <button @click="$emit('sort', 'name')" class="flex items-center gap-1 hover:text-gray-900">
              Peserta
              <Icon v-if="sortKey === 'name'" :name="sortOrder === 'asc' ? 'lucide:arrow-up' : 'lucide:arrow-down'" class="w-3 h-3" />
            </button>
          </th>
          <th class="px-4 py-3 font-semibold">Batch</th>
          <th class="px-4 py-3 font-semibold">Jumlah</th>
          <th class="px-4 py-3 font-semibold">
            <button @click="$emit('sort', 'date')" class="flex items-center gap-1 hover:text-gray-900">
              Tanggal
              <Icon v-if="sortKey === 'date'" :name="sortOrder === 'asc' ? 'lucide:arrow-up' : 'lucide:arrow-down'" class="w-3 h-3" />
            </button>
          </th>
          <th class="px-4 py-3 font-semibold text-center">Status</th>
          <th class="px-4 py-3 font-semibold text-right">Aksi</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="payment in payments"
          :key="payment.id"
          class="border-b border-gray-100 hover:bg-gray-50/60 transition-colors"
        >
          <td class="px-4 py-3">
            <p class="font-medium text-gray-800">{{ payment.name }}</p>
            <p class="text-xs text-gray-500">{{ payment.email }}</p>
          </td>
          <td class="px-4 py-3 text-gray-700">{{ payment.batchName || '-' }}</td>
          <td class="px-4 py-3 text-gray-800">{{ formatCurrency(payment.amount) }}</td>
          <td class="px-4 py-3 text-gray-600">{{ formatDate(payment.date) }}</td>
          <td class="px-4 py-3 text-center">
            <span
              :class="paymentStatusClass(payment.status)"
              class="inline-flex items-center justify-center px-3 py-1 text-[11px] rounded-full font-semibold"
            >
              {{ payment.status }}
            </span>
          </td>
          <td class="px-4 py-3 text-right">
            <button class="btn-small inline-flex items-center gap-1" @click="$emit('detail', payment)">
              <Icon name="lucide:eye" class="w-3 h-3" />
              <span>Detail</span>
            </button>
          </td>
        </tr>

        <tr v-if="!payments.length">
          <td colspan="6" class="py-6 text-center text-sm text-gray-500">
            Tidak ada data pembayaran yang sesuai dengan filter.
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
defineProps({
  payments: {
    type: Array,
    required: true,
  },
  sortKey: String,
  sortOrder: String,
});

defineEmits(['sort', 'detail']);

const formatCurrency = (value) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value || 0);

const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(d);
};

const paymentStatusClass = (status) => {
  const s = (status || '').toLowerCase();
  if (s === 'paid') return 'bg-emerald-100 text-emerald-800';
  if (s === 'pending') return 'bg-amber-100 text-amber-800';
  return 'bg-red-100 text-red-800'; // unpaid / lainnya
};
</script>