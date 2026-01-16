<template>
  <div class="overflow-x-auto relative">
    <table class="w-full text-left border-collapse">
      <thead>
        <tr class="bg-gray-50/50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-semibold">
          <th class="px-6 py-4">
            <button @click="$emit('sort', 'name')" class="flex items-center gap-1 hover:text-blue-600 transition-colors group">
              Peserta
              <Icon v-if="sortKey === 'name'" :name="sortOrder === 'asc' ? 'lucide:arrow-up' : 'lucide:arrow-down'" class="w-3 h-3 text-blue-500" />
              <Icon v-else name="lucide:arrow-up-down" class="w-3 h-3 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </th>
          <th class="px-6 py-4">Batch</th>
          <th class="px-6 py-4">Jumlah</th>
          <th class="px-6 py-4">
            <button @click="$emit('sort', 'date')" class="flex items-center gap-1 hover:text-blue-600 transition-colors group">
              Tanggal
              <Icon v-if="sortKey === 'date'" :name="sortOrder === 'asc' ? 'lucide:arrow-up' : 'lucide:arrow-down'" class="w-3 h-3 text-blue-500" />
              <Icon v-else name="lucide:arrow-up-down" class="w-3 h-3 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </th>
          <th class="px-6 py-4 text-center">Status</th>
          <th class="px-6 py-4 text-right">Aksi</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-100">
        <tr
          v-for="payment in payments"
          :key="payment.id"
          class="group hover:bg-gray-50 transition-colors duration-200"
        >
          <td class="px-6 py-4">
            <div class="flex flex-col">
              <span class="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{{ payment.name }}</span>
              <span class="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                 <Icon name="lucide:mail" class="w-3 h-3 text-gray-400" />
                 {{ payment.email }}
              </span>
            </div>
          </td>
          <td class="px-6 py-4">
             <span class="text-sm font-medium text-gray-700">{{ payment.batchName || '-' }}</span>
          </td>
          <td class="px-6 py-4">
             <span class="font-bold text-gray-900 bg-gray-50 px-2 py-1 rounded border border-gray-100 text-sm">
                {{ formatCurrency(payment.amount) }}
             </span>
          </td>
          <td class="px-6 py-4">
             <div class="flex items-center gap-1.5 text-sm text-gray-600">
                <Icon name="lucide:calendar" class="w-3.5 h-3.5 text-gray-400" />
                {{ formatDate(payment.date) }}
             </div>
          </td>
          <td class="px-6 py-4 text-center">
            <span
              :class="paymentStatusClass(payment.status)"
              class="inline-flex items-center justify-center gap-1.5 px-3 py-1 text-[11px] rounded-full font-bold border"
            >
              <span class="w-1.5 h-1.5 rounded-full bg-current"></span>
              {{ payment.status }}
            </span>
          </td>
          <td class="px-6 py-4 text-right">
            <button 
              class="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all border border-transparent hover:border-blue-100" 
              @click="$emit('detail', payment)"
              title="Lihat Detail"
            >
              <Icon name="lucide:eye" class="w-4 h-4" />
            </button>
          </td>
        </tr>

        <tr v-if="!payments.length">
          <td colspan="6" class="px-6 py-16 text-center text-gray-500 bg-gray-50/30">
             <div class="flex flex-col items-center justify-center gap-3">
               <div class="p-3 bg-gray-100 rounded-full">
                 <Icon name="lucide:credit-card" class="w-6 h-6 text-gray-400" />
               </div>
               <p class="text-sm">Tidak ada data pembayaran.</p>
             </div>
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
  if (s === 'paid') return 'bg-emerald-50 text-emerald-700 border-emerald-100 border';
  if (s === 'pending') return 'bg-amber-50 text-amber-700 border-amber-100 border';
  return 'bg-red-50 text-red-700 border-red-100 border'; // unpaid / lainnya
};
</script>