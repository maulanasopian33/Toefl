<template>
  <div class="min-h-screen flex flex-col">
    <div class="container mx-auto p-6 flex-grow">
      <header class="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h2 class="text-3xl font-bold text-gray-900 mb-4 sm:mb-0">Daftar Semua Batch Ujian</h2>
        <button
          @click="createBatch"
          class="main-button text-white font-semibold py-2 px-6 rounded-lg shadow-md flex items-center justify-center"
        >
          <svg
            class="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            ></path>
          </svg>
          Buat Batch Baru
        </button>
      </header>

      <div class="card overflow-x-auto">
        <div class="mb-4">
          <input
            type="text"
            placeholder="Cari batch..."
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-150 ease-in-out"
            v-model="searchTerm"
          />
        </div>

        <table class="w-full">
          <thead class="hidden md:table-header-group">
            <tr class="bg-gray-50">
              <th
                @click="requestSort('idBatch')"
                class="sortable-header px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                ID Batch
                <svg
                  class="sort-icon"
                  :class="getSortIconClass('idBatch')"
                  viewBox="0 0 24 24"
                >
                  <path d="M7 14L12 9L17 14H7Z" />
                </svg>
              </th>
              <th
                @click="requestSort('namaBatch')"
                class="sortable-header px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Nama Batch
                <svg
                  class="sort-icon"
                  :class="getSortIconClass('namaBatch')"
                  viewbox="0 0 24 24"
                >
                  <path d="M7 14L12 9L17 14H7Z" />
                </svg>
              </th>
              <th
                @click="requestSort('tanggalMulai')"
                class="sortable-header px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Tanggal Ujian
                <svg
                  class="sort-icon"
                  :class="getSortIconClass('tanggalMulai')"
                  viewBox="0 0 24 24"
                >
                  <path d="M7 14L12 9L17 14H7Z" />
                </svg>
              </th>
              <th
                @click="requestSort('batasMaksimalPeserta')"
                class="sortable-header px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Jumlah Peserta
                <svg
                  class="sort-icon"
                  :class="getSortIconClass('batasMaksimalPeserta')"
                  viewBox="0 0 24 24"
                >
                  <path d="M7 14L12 9L17 14H7Z" />
                </svg>
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Tindakan
              </th>
            </tr>
          </thead>
          <tbody class="block md:table-row-group">
            <template v-if="pending">
              <tr>
                <td colspan="5" class="text-center py-4 text-gray-500">
                  Memuat data...
                </td>
              </tr>
            </template>
            <template v-else-if="error">
              <tr>
                <td colspan="5" class="text-center py-4 text-red-500">
                  Gagal memuat data. Silakan coba lagi.
                </td>
              </tr>
            </template>
            <template v-else-if="sortedAndFilteredBatches.length === 0">
              <tr>
                <td colspan="5" class="text-center py-4 text-gray-500">
                  Belum ada batch yang dibuat.
                </td>
              </tr>
            </template>
            <template v-else>
              <tr
                v-for="(batch, index) in sortedAndFilteredBatches"
                :key="index"
                class="block md:table-row bg-white border hover:bg-primary/20 md:border-0 mb-4 p-3 md:mb-0"
              >
                <td class="block md:table-cell p-3 border-b md:border-b-0">
                  <span class="inline-block md:hidden font-bold pr-2">Id:</span>
                  {{ batch.idBatch }}
                </td>
                <td class="block md:table-cell p-2 border-b md:border-b-0">
                  <span class="inline-block md:hidden font-bold pr-2">Nama Batch :</span>
                  {{ batch.namaBatch }}
                </td>
                <td class="block md:table-cell p-2 border-b md:border-b-0">
                  <span class="inline-block md:hidden font-bold pr-2">Tanggal Ujian : </span>
                  {{ formatDate(batch.tanggalMulai) }} - {{ formatDate(batch.tanggalSelesai) }}
                </td>
                <td class="block md:table-cell p-2 border-b md:border-b-0">
                  <span class="inline-block md:hidden font-bold pr-2">Jumlah Peserta:</span>
                  {{ batch.batasMaksimalPeserta }}
                </td>
                <td class="block md:table-cell p-2 border-b md:border-b-0">
                  <span class="inline-block md:hidden font-bold pr-2">Aksi:</span>
                  <Icon name="ic:sharp-remove-red-eye"/>
                  <Icon name="ic:baseline-edit"/>
                  <Icon name="ic:baseline-delete"/>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
        <Icon name="ic:sharp-remove-red-eye"/>dasd
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useBatchGet } from '@/composables/Batch/get';
import { ref, computed } from 'vue';
import type { Batch } from '@/types/batch';
const { showAlert, showConfirm } = useNotificationPopup();
const { startLoading, stopLoading } = useLoading();
definePageMeta({
  title: 'Tambah Batch - Admin Panel',
  layout: 'admin'
})
startLoading();
const { data, pending, error } = await useBatchGet();
if(error.value) {
  showAlert('Gagal memuat data. Silakan coba lagi.');
  stopLoading();
}
const searchTerm = ref('');
const sortConfig = ref({ key: 'idBatch', direction: 'asc' });
const sortedAndFilteredBatches = computed(() => {
    if (pending.value || error.value || !data.value) {
        return [];
    }

    const filtered = data.value.filter(
        (batch: Batch) =>
            batch.idBatch.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
            batch.namaBatch.toLowerCase().includes(searchTerm.value.toLowerCase())
    );
    stopLoading();
    return filtered.sort((a: Batch, b: Batch) => {
        const key = sortConfig.value.key as keyof Batch;
        const direction = sortConfig.value.direction;
        let aValue: any, bValue: any;

        if (key === 'tanggalMulai' || key === 'tanggalSelesai') {
            aValue = a[key].getTime();
            bValue = b[key].getTime();
        } else if (key === 'batasMaksimalPeserta') {
            // Perhatikan konversi ke Number untuk sorting numerik
            aValue = Number(a.batasMaksimalPeserta);
            bValue = Number(b.batasMaksimalPeserta);
        } else {
            aValue = String(a[key]).toLowerCase();
            bValue = String(b[key]).toLowerCase();
        }

        if (aValue < bValue) {
            return direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
            return direction === 'asc' ? 1 : -1;
        }
        return 0;
    });
});

const requestSort = (key: keyof Batch) => {
    if (sortConfig.value.key === key) {
        sortConfig.value.direction = sortConfig.value.direction === 'asc' ? 'desc' : 'asc';
    } else {
        sortConfig.value.key = key;
        sortConfig.value.direction = 'asc';
    }
};

const getSortIconClass = (key: string): string => {
    if (sortConfig.value.key !== key) {
        return 'opacity-0';
    }
    return sortConfig.value.direction === 'desc' ? 'rotate-180' : '';
};

// Fungsi formatDate yang diperbaiki
const formatDate = (dateString: Date): string => {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime())
    ? date.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })
    : '';
};

const createBatch = () => {
    navigateTo('/admin/batch/add');
};
</script>

<style scoped>
body {
  font-family: 'Inter', sans-serif;
  background-color: #f3f4f6;
  line-height: 1.6;
}
.card {
  background-color: #ffffff;
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  padding: 1.5rem;
}
.main-button {
  background-color: #10b981;
  transition: all 0.2s ease-in-out;
}
.main-button:hover {
  background-color: #059669;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
}
.sortable-header {
  cursor: pointer;
  user-select: none;
  position: relative;
  padding-right: 2rem;
}
.sort-icon {
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1rem;
  height: 1rem;
  fill: currentColor;
  opacity: 0.3;
  transition: transform 0.2s ease-in-out;
}
.sort-icon.active {
  opacity: 1;
}
</style>