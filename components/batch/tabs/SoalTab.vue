<template>
  <div class="space-y-8 pb-8">
    <!-- Header Area -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div class="space-y-1">
        <h3 class="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <div class="p-1.5 bg-blue-100 rounded-lg">
            <Icon name="lucide:layout-list" class="w-5 h-5 text-blue-600" />
          </div>
          Manajemen Struktur Soal
        </h3>
        <p class="text-sm text-slate-500 font-medium">Kelola section, group, dan soal untuk ujian batch ini.</p>
      </div>
      <button 
        @click="goToEditor(batch.idBatch)" 
        class="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl font-bold text-sm shadow-lg shadow-blue-200 hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all duration-200"
      >
        <Icon name="lucide:pencil-ruler" class="w-5 h-5" />
        Buka Editor Soal Lengkap
      </button>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div class="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex items-center gap-4">
        <div class="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
           <Icon name="lucide:box" class="w-6 h-6" />
        </div>
        <div>
          <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Total Section</p>
          <p class="text-2xl font-black text-slate-900 leading-none">{{ batch.sections?.length || 0 }}</p>
        </div>
      </div>
      <div class="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex items-center gap-4">
        <div class="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
           <Icon name="lucide:layers" class="w-6 h-6" />
        </div>
        <div>
          <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Total Group</p>
          <p class="text-2xl font-black text-slate-900 leading-none">{{ batch.totalGroups || 0 }}</p>
        </div>
      </div>
      <div class="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex items-center gap-4">
        <div class="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
           <Icon name="lucide:help-circle" class="w-6 h-6" />
        </div>
        <div>
          <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Total Soal</p>
          <p class="text-2xl font-black text-emerald-600 leading-none">{{ batch.totalQuestions || 0 }}</p>
        </div>
      </div>
    </div>

    <!-- Sections List -->
    <div class="space-y-6">
      <div v-if="!batch.sections || !batch.sections.length" class="bg-white p-12 rounded-[2rem] border border-dashed border-slate-200 text-center flex flex-col items-center gap-4">
        <div class="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100 shadow-sm">
          <Icon name="lucide:file-question" class="w-10 h-10 text-slate-200" />
        </div>
        <div>
          <h4 class="text-lg font-bold text-slate-900">Belum Ada Struktur Ujian</h4>
          <p class="text-sm text-slate-500 font-medium max-w-xs mx-auto mt-1">Silakan tambahkan section dan group terlebih dahulu melalui Editor Soal.</p>
        </div>
        <button 
          @click="goToEditor(batch.idBatch)" 
          class="mt-2 inline-flex items-center gap-2 text-blue-600 font-bold text-sm hover:text-blue-700 transition-colors"
        >
          Mulai Buat Struktur <Icon name="lucide:arrow-right" class="w-4 h-4" />
        </button>
      </div>

      <div v-for="(section, sIndex) in batch.sections" :key="section.idSection" class="bg-white rounded-[2rem] shadow-xl shadow-slate-200/40 border border-slate-200 overflow-hidden transform transition-all hover:border-blue-200">
        <!-- Section Header -->
        <div class="px-8 py-6 bg-slate-50/50 border-b border-slate-100 flex items-start justify-between gap-4">
          <div class="flex items-start gap-4">
            <div :class="getSectionTypeClass(section.namaSection)" class="p-3 rounded-2xl shadow-sm border mt-1">
              <Icon :name="getSectionIcon(section.namaSection)" class="w-6 h-6" />
            </div>
            <div>
              <div class="flex items-center gap-2 mb-1">
                <span class="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Section {{ sIndex + 1 }}</span>
                <span class="w-1 h-1 bg-slate-300 rounded-full"></span>
                <span class="text-[10px] font-extrabold text-blue-600 uppercase tracking-widest">{{ section.idSection || 'N/A' }}</span>
              </div>
              <h4 class="text-lg font-black text-slate-900 leading-tight">{{ section.namaSection }}</h4>
              <p v-if="section.deskripsi" class="text-sm text-slate-500 font-medium mt-1 pr-10">{{ formatDescription(section.deskripsi) }}</p>
              <p v-else class="text-sm text-slate-500 font-medium mt-1 pr-10">Tidak ada deskripsi section.</p>
            </div>
          </div>
          <div class="hidden sm:flex items-center bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm">
            <Icon name="lucide:layers" class="w-3.5 h-3.5 text-slate-400 mr-2" />
            <span class="text-xs font-bold text-slate-700">{{ section.totalGroups || 0 }} Group</span>
          </div>
        </div>

        <!-- Groups within Section -->
        <div class="p-4 space-y-3 bg-slate-50/20">
          <div v-for="(group, gIndex) in section.groups" :key="group.idGroup" class="group flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl transition-all hover:bg-white hover:shadow-lg hover:shadow-slate-100 hover:border-slate-200">
            <div class="flex items-center gap-5">
              <div class="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center font-bold text-xs text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 group-hover:border-blue-100 transition-colors">
                {{ String(gIndex + 1).padStart(2, '0') }}
              </div>
              <div>
                <p class="text-sm font-bold text-slate-800 transition-colors group-hover:text-blue-900">Group {{ gIndex + 1 }}</p>
                <div class="flex items-center gap-3 mt-0.5">
                  <span class="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400">
                    <Icon name="lucide:help-circle" class="w-3.5 h-3.5" />
                    {{ group.questions?.length || 0 }} Soal
                  </span>
                  <span v-if="group.passage" class="w-1 h-1 bg-slate-200 rounded-full"></span>
                  <span v-if="group.passage" class="inline-flex items-center gap-1.5 text-xs font-bold text-amber-500 bg-amber-50 px-2 py-0.5 rounded-md">
                    <Icon name="lucide:file-text" class="w-3.5 h-3.5" />
                    Passage
                  </span>
                </div>
              </div>
            </div>
            <button 
              @click="goToEditor(batch.idBatch, section.idSection, group.idGroup)" 
              class="opacity-0 group-hover:opacity-100 inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-xs font-bold hover:bg-blue-600 hover:text-white transition-all transform hover:scale-105 active:scale-95 shadow-sm"
            >
              <Icon name="lucide:pencil" class="w-3.5 h-3.5" />
              <span>Kelola</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { computed } from 'vue';

const props = defineProps({
  batch: { type: Object, required: true },
});

// Batch data

const router = useRouter();

// Helpers
const getSectionIcon = (name) => {
  const n = name?.toLowerCase() || '';
  if (n.includes('listening')) return 'lucide:headphones';
  if (n.includes('reading')) return 'lucide:book-open';
  if (n.includes('structure')) return 'lucide:code-2';
  return 'lucide:file-text';
};

const getSectionTypeClass = (name) => {
  const n = name?.toLowerCase() || '';
  if (n.includes('listening')) return 'bg-blue-50 text-blue-600 border-blue-100';
  if (n.includes('reading')) return 'bg-emerald-50 text-emerald-600 border-emerald-100';
  if (n.includes('structure')) return 'bg-purple-50 text-purple-600 border-purple-100';
  return 'bg-slate-50 text-slate-600 border-slate-100';
};

const formatDescription = (html) => {
  if (!html) return '';
  const text = html.replace(/<[^>]+>/g, '');
  return text.length > 100 ? text.substring(0, 100) + '...' : text;
};

const goToEditor = (batchId, sectionId, groupId) => {
  if (!batchId) return;
  let path = `/admin/exam/edit/${batchId}`;
  const query = new URLSearchParams();
  if (sectionId) query.append('section', sectionId);
  if (groupId) query.append('group', groupId);
  
  const queryString = query.toString();
  if (queryString) path += `?${queryString}`;
  
  router.push(path);
};
</script>