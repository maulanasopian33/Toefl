<template>
  <RanaCard>
    <div class="flex flex-col md:flex-row justify-between items-center mb-4">
      <h3 class="text-2xl font-bold">Daftar Batch</h3>
      <RanaButton color="primary" @click="onAdd">
        <Icon name="ic:baseline-add" class="mr-2" /> Tambah Batch
      </RanaButton>
    </div>

    <RanaInput v-model="searchTerm" placeholder="Cari batch..." />
    <table class="w-full mt-4">
      <thead>
        <tr class="bg-gray-100 text-left">
          <th class="p-3">Nama Batch</th>
          <th class="p-3">Tanggal</th>
          <th class="p-3">Peserta</th>
          <th class="p-3 text-center">Aksi</th>
        </tr>
      </thead>
      <tbody>
        <tr 
          v-for="batch in batches"
          :key="batch.idBatch"
          class="border-b hover:bg-gray-50 transition"
        >
          <td class="px-4 py-3 font-medium text-gray-800">
              <NuxtLink :to="`/admin/batch/${batch.idBatch}`" class="hover:text-teal-600 hover:underline">
                {{ batch.namaBatch }}
              </NuxtLink>
            </td>
          <td class="p-3">{{ formatDate(batch.tanggalMulai) }} - {{ formatDate(batch.tanggalSelesai) }}</td>
          <td class="p-3">{{ batch.batasMaksimalPeserta }}</td>
          <td class="p-3 text-center space-x-2">
            <RanaButton color="secondary" size="sm" @click="$emit('edit', batch)">
              <Icon name="ic:baseline-edit" />
            </RanaButton>
            <RanaButton color="danger" size="sm" @click="$emit('delete', batch)">
              <Icon name="ic:baseline-delete" />
            </RanaButton>
          </td>
        </tr>
        <tr v-if="batches.length === 0">
          <td colspan="4" class="text-center text-gray-500 py-4">Tidak ada data yang ditemukan</td>
        </tr>
      </tbody>
    </table>
    <div v-if="filteredBatches.length > itemsPerPage" class="flex justify-between items-center mt-4">
      <button @click="prevPage" :disabled="currentPage === 1" class="py-2 px-4 rounded border">Previous</button>
      <span>Halaman {{ currentPage }} dari {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages" class="py-2 px-4 rounded border">Next</button>
    </div>
  </RanaCard>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import RanaButton from '@/components/Rana/RanaButton.vue';
import RanaCard from '@/components/Rana/RanaCard.vue';
import RanaInput from '@/components/Rana/RanaInput.vue';

const itemsPerPage = 5; // Jumlah item per halaman
const currentPage = ref(1); // Halaman saat ini

const props = defineProps({
  batches: Array
});
const emit = defineEmits(['add', 'edit', 'delete']);
const searchTerm = ref('');

const filteredBatches = computed(() =>
  props.batches?.filter((b) => 
    b.namaBatch.toLowerCase().includes(searchTerm.value.toLowerCase())
  ) ?? []
);

// Reset paginasi ke halaman pertama setiap kali pencarian berubah
watch(searchTerm, () => {
  currentPage.value = 1;
});

const totalPages = computed(() => {
  return Math.ceil((filteredBatches.value?.length ?? 0) / itemsPerPage);
});

const paginatedBatches = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredBatches.value?.slice(start, end) ?? [];
});

const batches = computed(() => paginatedBatches.value)



const onAdd = () => emit('add');
const formatDate = (d: Date) => new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};
</script>
