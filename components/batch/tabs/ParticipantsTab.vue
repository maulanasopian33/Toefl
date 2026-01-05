<template>
  <div class="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col">
    <!-- Header & Actions -->
    <div class="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <div class="p-2 bg-blue-50 rounded-lg text-blue-600">
          <Icon name="lucide:users" class="w-5 h-5" />
        </div>
        <div>
          <h3 class="font-semibold text-slate-800">Daftar Peserta</h3>
          <p class="text-xs text-slate-500">Kelola siswa yang terdaftar di batch ini.</p>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <button class="inline-flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 text-slate-600 text-xs font-medium rounded-lg hover:bg-slate-50 hover:text-slate-800 transition-colors">
          <Icon name="lucide:upload" class="w-3.5 h-3.5" />
          Import
        </button>
        <button 
          @click="$emit('requestAddParticipant')"
          class="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 shadow-sm transition-colors"
        >
          <Icon name="lucide:plus" class="w-3.5 h-3.5" />
          Tambah Peserta
        </button>
      </div>
    </div>

    <!-- Filters -->
    <div class="p-5 bg-slate-50/50 border-b border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div class="relative">
        <Icon name="lucide:search" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input 
          v-model="q" 
          type="text" 
          placeholder="Cari nama atau email..." 
          class="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
        >
      </div>
      <div class="flex items-center gap-2">
        <div class="relative w-full sm:w-48">
           <Icon name="lucide:filter" class="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
           <select v-model="filterStatus" class="w-full pl-9 pr-8 py-2 bg-white border border-slate-200 rounded-lg text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer">
             <option value="">Semua Status</option>
             <option value="Paid">Lunas</option>
             <option value="Unpaid">Belum Lunas</option>
           </select>
           <Icon name="lucide:chevron-down" class="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto">
      <table class="w-full text-sm text-left">
        <thead class="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
          <tr>
            <th class="px-6 py-3 w-16 text-center">#</th>
            <th class="px-6 py-3">Nama Peserta</th>
            <th class="px-6 py-3">Email</th>
            <th class="px-6 py-3">Status Pembayaran</th>
            <th class="px-6 py-3 text-right">Aksi</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr v-for="(p, index) in paginatedParticipants" :key="p.id" class="hover:bg-slate-50/80 transition-colors group">
            <td class="px-6 py-3 text-center text-slate-400 text-xs">
              {{ (currentPage - 1) * itemsPerPage + index + 1 }}
            </td>
            <td class="px-6 py-3 font-medium text-slate-700">
              {{ p.user?.name }}
            </td>
            <td class="px-6 py-3 text-slate-500">
              {{ p.user?.email }}
            </td>
            <td class="px-6 py-3">
              <span :class="paymentStatusClass(p.payments[0]?.status)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border">
                {{ p.payments[0]?.status }}
              </span>
            </td>
            <td class="px-6 py-3 text-right">
              <button class="text-slate-400 hover:text-blue-600 transition-colors p-1 rounded-md hover:bg-blue-50">
                <Icon name="lucide:more-horizontal" class="w-4 h-4" />
              </button>
            </td>
          </tr>
          <tr v-if="paginatedParticipants.length === 0">
            <td colspan="5" class="px-6 py-12 text-center text-slate-400">
              <div class="flex flex-col items-center gap-2">
                <Icon name="lucide:search-x" class="w-8 h-8 opacity-50" />
                <p class="text-sm">Tidak ada peserta ditemukan.</p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="p-4 border-t border-slate-100 flex items-center justify-between">
      <p class="text-xs text-slate-500">
        Menampilkan <span class="font-medium text-slate-700">{{ (currentPage - 1) * itemsPerPage + 1 }}</span> - <span class="font-medium text-slate-700">{{ Math.min(currentPage * itemsPerPage, filteredParticipants.length) }}</span> dari <span class="font-medium text-slate-700">{{ filteredParticipants.length }}</span> data
      </p>
      <div class="flex items-center gap-2">
        <button 
          @click="prevPage" 
          :disabled="currentPage === 1"
          class="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Icon name="lucide:chevron-left" class="w-4 h-4" />
        </button>
        <button 
          @click="nextPage" 
          :disabled="currentPage === totalPages"
          class="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Icon name="lucide:chevron-right" class="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
  batch: { type: Object, required: true },
});

const q = ref('');
const filterStatus = ref('');
const currentPage = ref(1);
const itemsPerPage = 10;

// Reset page when filter changes
watch([q, filterStatus], () => {
  currentPage.value = 1;
});

const filteredParticipants = computed(() => {
  let items = props.batch.participants || [];
  
  // Filter by Search
  if (q.value) {
    const query = q.value.toLowerCase();
    items = items.filter(p =>
      p.user?.name?.toLowerCase().includes(query) ||
      p.user?.email?.toLowerCase().includes(query)
    );
  }

  // Filter by Status
  if (filterStatus.value) {
    items = items.filter(p => {
      const status = (p.payments && p.payments.length > 0 ? p.payments[0].status : 'unpaid')?.toLowerCase();
      if (filterStatus.value === 'Paid') return status === 'paid';
      if (filterStatus.value === 'Unpaid') return status !== 'paid';
      return true;
    });
  }

  return items;
});

const totalPages = computed(() => Math.ceil(filteredParticipants.value.length / itemsPerPage));

const paginatedParticipants = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredParticipants.value.slice(start, end);
});

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};

const paymentStatusClass = (status) => {
  const s = (status || '').toLowerCase();
  if (s === 'paid') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  if (s === 'pending') return 'bg-amber-50 text-amber-700 border-amber-200';
  return 'bg-rose-50 text-rose-700 border-rose-200';
};
</script>
