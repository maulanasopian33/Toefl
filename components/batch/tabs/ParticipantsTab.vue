<template>
  <div class="card">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4 border-b border-gray-100 pb-3">
      <h3 class="card-title mb-0">Daftar Peserta</h3>

      <div class="flex gap-2 w-full md:w-auto justify-end">
        <button class="btn-primary px-4 py-2 text-xs sm:text-sm">
          Import
        </button>
        <button
          class="btn-primary px-4 py-2 text-xs sm:text-sm"
          @click="$emit('requestAddParticipant')"
        >
          Tambah Peserta
        </button>
      </div>
    </div>

    <!-- Search -->
    <div class="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
      <Icon name="lucide:search" class="w-4 h-4 text-gray-400 flex-shrink-0" />
      <input
        v-model="q"
        placeholder="Cari nama atau email peserta..."
        class="input !border-0 !bg-transparent !px-0 !py-0 text-xs sm:text-sm"
      />
    </div>

    <!-- Table -->
    <div class="overflow-x-auto mt-4">
      <table class="w-full text-sm min-w-[540px]">
        <thead>
          <tr class="text-left text-xs text-gray-500 bg-gray-50 border-y border-gray-100">
            <th class="px-4 py-3 font-semibold">Nama</th>
            <th class="px-4 py-3 font-semibold">Email</th>
            <th class="px-4 py-3 font-semibold">Pembayaran</th>
            <th class="px-4 py-3 font-semibold text-right">Aksi</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="p in filtered"
            :key="p.id"
            class="border-b border-gray-100 hover:bg-gray-50/60 transition-colors"
          >
            <td class="px-4 py-3 font-medium text-gray-800">
              {{ p.name }}
            </td>
            <td class="px-4 py-3 text-gray-700">
              {{ p.email }}
            </td>
            <td class="px-4 py-3">
              <span
                :class="paymentStatusClass(p.paymentStatus)"
                class="inline-flex items-center justify-center px-3 py-1 text-[11px] rounded-full font-semibold"
              >
                {{ p.paymentStatus }}
              </span>
            </td>
            <td class="px-4 py-3 text-right">
              <button class="btn-small inline-flex items-center gap-1">
                <Icon name="lucide:eye" class="w-3 h-3" />
                <span>Detail</span>
              </button>
            </td>
          </tr>

          <tr v-if="!filtered.length">
            <td colspan="4" class="py-6 text-center text-sm text-gray-500">
              Tidak ada peserta.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  batch: { type: Object, required: true },
});

const q = ref('');

const filtered = computed(() => {
  const query = q.value.toLowerCase();
  if (!query) return props.batch.participants;
  return props.batch.participants.filter(
    (p) =>
      p.name.toLowerCase().includes(query) ||
      p.email.toLowerCase().includes(query)
  );
});

// styling badge pembayaran
const paymentStatusClass = (status) => {
  const s = (status || '').toLowerCase();
  if (s === 'paid') return 'bg-emerald-100 text-emerald-800';
  if (s === 'pending') return 'bg-amber-100 text-amber-800';
  return 'bg-red-100 text-red-800'; // Unpaid atau lainnya
};
</script>
