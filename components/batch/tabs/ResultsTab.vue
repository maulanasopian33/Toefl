<template>
  <div class="card">

    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4 border-b border-gray-100 pb-4">
      <div>
        <h3 class="card-title mb-1">Hasil Ujian Peserta</h3>
        <p class="text-xs text-gray-500">Lihat dan kelola hasil ujian untuk semua peserta di batch ini.</p>
      </div>
      <div class="flex items-center gap-2 w-full md:w-auto">
        <input v-model="q" placeholder="Cari nama peserta..." class="input w-full md:w-64" />
      </div>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto">
      <table class="w-full text-sm min-w-[600px]">
        <thead>
          <tr class="text-left text-gray-600 bg-gray-50">
            <th class="p-3 font-semibold">
              <button @click="sortBy('name')" class="flex items-center gap-1 hover:text-gray-900">
                Nama Peserta
                <Icon v-if="sortKey === 'name'" :name="sortOrder === 'asc' ? 'lucide:arrow-up' : 'lucide:arrow-down'" class="w-3 h-3" />
              </button>
            </th>
            <th class="p-3 font-semibold text-center">
              <button @click="sortBy('score')" class="flex items-center gap-1 hover:text-gray-900">
                Skor
                <Icon v-if="sortKey === 'score'" :name="sortOrder === 'asc' ? 'lucide:arrow-up' : 'lucide:arrow-down'" class="w-3 h-3" />
              </button>
            </th>
            <th class="p-3 font-semibold text-center">Status Kelulusan</th>
            <th class="p-3 font-semibold text-right">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="result in sortedResults" :key="result.id" class="border-t hover:bg-gray-50">
            <td class="p-3 font-medium text-gray-800">{{ result.user?.name || result.name || '-' }}</td>
            <td class="p-3 text-center font-semibold" :class="result.score ? 'text-gray-800' : 'text-gray-400'">
              {{ result.score ?? 'N/A' }}
            </td>
            <td class="p-3 text-center">
              <span v-if="result.score !== null" :class="passStatusClass(result.score)" class="px-3 py-1 text-xs rounded-full font-semibold">
                {{ result.score >= 500 ? 'Lulus' : 'Tidak Lulus' }}
              </span>
              <span v-else class="text-gray-400 italic text-xs">Belum Mengerjakan</span>
            </td>
            <td class="p-3 text-right">
              <button v-if="result.score !== null" @click="showResultDetails(result)" class="btn-small inline-flex items-center gap-1 text-xs">
                <Icon name="lucide:award" class="w-3 h-3" />
                <span>Lihat Sertifikat</span>
              </button>
            </td>
          </tr>
          <tr v-if="!sortedResults.length">
            <td colspan="4" class="py-6 text-center text-gray-500">
              Tidak ada hasil untuk ditampilkan.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- Result Detail Modal -->
    <ExamResultDetailModal v-model="isDetailModalOpen" :result="selectedResult" />

  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import ExamResultDetailModal from '@/components/batch/modals/ExamResultDetailModal.vue';


const props = defineProps({
  batch: { type: Object, required: true },
});

const emit = defineEmits(['update:modelValue']);

const isDetailModalOpen = ref(false);
const selectedResult = ref(null);


const q = ref('');
const sortKey = ref('score'); // Default sort by score
const sortOrder = ref('desc'); // Default descending

const filteredResults = computed(() => {
  const query = q.value.toLowerCase();
  const items = props.batch.results || [];
  
  if (!query) return items;
  
  return items.filter(r => {
    const name = r.user?.name || r.name || '';
    return name.toLowerCase().includes(query);
  });
});

const showResultDetails = (result) => {
  selectedResult.value = result;
  isDetailModalOpen.value = true;
};

const sortedResults = computed(() => {
  const data = [...filteredResults.value];
  data.sort((a, b) => {
    let valA = a[sortKey.value];
    let valB = b[sortKey.value];

    // Null scores should go to the bottom
    if (valA === null) return 1;
    if (valB === null) return -1;

    if (valA < valB) return sortOrder.value === 'asc' ? -1 : 1;
    if (valA > valB) return sortOrder.value === 'asc' ? 1 : -1;
    return 0;
  });
  return data;
});

const sortBy = (key) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortKey.value = key;
    sortOrder.value = 'asc';
  }
};

const passStatusClass = (score) => {
  if (score >= 500) return 'bg-green-100 text-green-800';
  return 'bg-red-100 text-red-800';
};
</script>