<template>
  <div class="card">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4 border-b border-gray-100 pb-4">
      <div>
        <h3 class="card-title mb-1">Struktur Ujian</h3>
        <p class="text-xs text-gray-500">Kelola section dan group soal untuk batch ini.</p>
      </div>
      <div class="flex gap-2">
        <button class="btn-primary px-4 py-2 text-sm">Tambah Section</button>
        <button @click="goToEditor(batch.id)" class="btn-primary bg-indigo-600 hover:bg-indigo-700 px-4 py-2 text-sm">
          <Icon name="lucide:pencil" class="mr-1" />
          Kelola Ujian
        </button>
      </div>
    </div>

    <!-- Daftar Section -->
    <div class="space-y-5">
      <section v-for="section in batch.sections" :key="section.id" class="border border-gray-200 rounded-xl overflow-hidden">
        <!-- Header Section -->
        <div class="flex items-center justify-between bg-gray-50 p-4 border-b border-gray-200">
          <div>
            <h4 class="font-semibold text-gray-800">{{ section.name }}</h4>
            <p class="text-xs text-gray-500">{{ section.description }}</p>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-xs text-gray-600 bg-white border border-gray-200 rounded-full px-2 py-0.5">
              {{ section.groups.length }} Group
            </span>
            <button class="btn-small bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 text-xs">
              + Tambah Group
            </button>
          </div>
        </div>

        <!-- Daftar Group dalam Section -->
        <div class="divide-y divide-gray-100">
          <div v-for="group in section.groups" :key="group.id" class="flex items-center justify-between p-4 hover:bg-gray-50/60 transition-colors">
            <div class="flex items-center gap-3">
              <Icon name="lucide:layers" class="w-4 h-4 text-gray-400" />
              <div>
                <p class="font-medium text-sm text-gray-800">{{ group.name }}</p>
                <p class="text-xs text-gray-500">Jumlah Soal: {{ group.questionsCount }}</p>
              </div>
            </div>
            <div class="flex gap-2">
              <button @click="goToEditor(batch.id, section.id)" class="btn-small inline-flex items-center gap-1 text-xs">
                <Icon name="lucide:edit-3" class="w-3 h-3" />
                <span>Edit</span>
              </button>
            </div>
          </div>
          <div v-if="!section.groups.length" class="p-4 text-center text-xs text-gray-400 italic">
            Belum ada group di section ini.
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

const goToEditor = (batchId, sectionId) => {
  let path = `/admin/exam/edit/${batchId}`;
  if (sectionId) {
    path += `?section=${sectionId}`;
  }
  router.push(path);
};
</script>