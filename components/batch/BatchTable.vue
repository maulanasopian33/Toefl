<template>
  <RanaCard>
    <div class="flex justify-between items-center mb-4">
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
          v-for="batch in filtered"
          :key="batch.idBatch"
          class="border-b hover:bg-gray-50 transition"
        >
          <td class="p-3">{{ batch.namaBatch }}</td>
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
        <tr v-if="filtered.length === 0">
          <td colspan="4" class="text-center text-gray-500 py-4">Tidak ada data</td>
        </tr>
      </tbody>
    </table>
  </RanaCard>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import RanaButton from '@/components/Rana/RanaButton.vue';
import RanaCard from '@/components/Rana/RanaCard.vue';
import RanaInput from '@/components/Rana/RanaInput.vue';

const props = defineProps({
  batches: Array
});
const emit = defineEmits(['add', 'edit', 'delete']);
const searchTerm = ref('');

const filtered = computed(() =>
  props.batches?.filter((b) =>
    b.namaBatch.toLowerCase().includes(searchTerm.value.toLowerCase())
  ) ?? []
);

const onAdd = () => emit('add');
const formatDate = (d: Date) =>
  new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
</script>
