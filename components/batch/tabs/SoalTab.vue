<template>
  <div class="card">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4 border-b border-gray-100 pb-4">
      <div>
        <h3 class="card-title mb-1">Manajemen Soal</h3>
        <p class="text-xs text-gray-500">Lihat ringkasan struktur soal dan akses editor untuk melakukan perubahan.</p>
      </div>
      <button @click="goToEditor(batch.idBatch)" class="btn-primary bg-indigo-600 hover:bg-indigo-700 px-4 py-2 text-sm">
        <Icon name="lucide:pencil-ruler" class="mr-1" />
        Buka Editor Soal Lengkap
      </button>
    </div>

    <!-- Daftar Section dan Group -->
    <div class="space-y-5">
      <div v-if="!batch.sections || !batch.sections.length" class="text-center py-10 text-gray-500">
        <Icon name="lucide:file-question" class="w-12 h-12 mx-auto mb-2 text-gray-300" />
        <h4 class="font-semibold">Belum Ada Struktur Ujian</h4>
        <p class="text-sm">Silakan tambahkan section dan group terlebih dahulu di tab "Section & Group".</p>
      </div>

      <section v-for="section in batch.sections" :key="section.id" class="border border-gray-200 rounded-xl overflow-hidden">
        <!-- Header Section -->
        <div class="bg-gray-50 p-4 border-b border-gray-200">
          <h4 class="font-semibold text-gray-800">{{ section.name }}</h4>
          <p class="text-xs text-gray-500">{{ section.description }}</p>
        </div>

        <!-- Daftar Group -->
        <div class="divide-y divide-gray-100">
          <div v-for="group in section.groups" :key="group.id" class="flex items-center justify-between p-4 hover:bg-gray-50/60 transition-colors">
            <div class="flex items-center gap-3">
              <Icon name="lucide:list-checks" class="w-4 h-4 text-gray-400" />
              <div>
                <p class="font-medium text-sm text-gray-800">{{ group.name }}</p>
                <p class="text-xs text-gray-500">Jumlah Soal: {{ group.questionsCount }}</p>
              </div>
            </div>
            <div class="flex gap-2">
              <button @click="goToEditor(batch.id, section.id, group.id)" class="btn-small inline-flex items-center gap-1 text-xs">
                <Icon name="lucide:edit" class="w-3 h-3" />
                <span>Kelola Soal</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const props = defineProps({
  batch: { type: Object, required: true },
});

const router = useRouter();

const goToEditor = (batchId, sectionId, groupId) => {
  let path = `/admin/exam/edit/${batchId}`;
  const query = new URLSearchParams();
  if (sectionId) query.append('section', sectionId);
  if (groupId) query.append('group', groupId);
  
  const queryString = query.toString();
  if (queryString) path += `?${queryString}`;
  
  router.push(path);
};
</script>