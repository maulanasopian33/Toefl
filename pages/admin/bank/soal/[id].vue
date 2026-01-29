<template>
  <div class="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 font-sans">
    <div class="mx-auto max-w-5xl">
      <!-- Header -->
      <header class="mb-8">
        <NuxtLink to="/admin/bank/soal" class="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-rose-600 mb-6 group transition-colors">
          <div class="p-1.5 bg-gray-100 rounded-lg group-hover:bg-rose-50 transition-colors">
             <Icon name="lucide:arrow-left" class="h-4 w-4" />
          </div>
          Kembali ke Bank Soal
        </NuxtLink>
        
        <div v-if="section" class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
           <div class="flex items-center gap-4">
              <div class="p-3 bg-rose-600 text-white rounded-2xl shadow-lg shadow-rose-200">
                 <Icon name="lucide:file-text" class="w-8 h-8" />
              </div>
              <div>
                 <h1 class="text-3xl font-black tracking-tight text-slate-900">{{ section.namaSection }}</h1>
                 <div class="flex items-center gap-2 mt-1">
                    <span class="text-xs font-mono text-gray-400">ID: {{ section.idSection }}</span>
                    <span class="w-1 h-1 rounded-full bg-gray-300"></span>
                    <span class="text-xs font-bold text-rose-500 uppercase tracking-widest">Master Template</span>
                 </div>
              </div>
           </div>
        </div>
      </header>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex flex-col items-center justify-center py-24 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm animate-pulse">
        <Icon name="lucide:loader-2" class="h-12 w-12 animate-spin text-gray-200 mb-4" />
        <p class="text-gray-400 font-bold uppercase tracking-widest text-xs">Mengambil detail soal...</p>
      </div>

      <!-- Content -->
      <div v-else-if="section" class="space-y-8">
         <section class="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm relative overflow-hidden">
            <div class="absolute top-0 right-0 p-8 opacity-5">
               <Icon name="lucide:quote" class="w-24 h-24" />
            </div>
            <h2 class="text-lg font-black text-slate-800 mb-4 flex items-center gap-2">
               <Icon name="lucide:info" class="w-5 h-5 text-rose-500" />
               Instruksi & Deskripsi
            </h2>
            <div class="prose prose-slate max-w-none text-slate-600" v-html="section.deskripsi || 'Tidak ada instruksi khusus.'"></div>
         </section>

         <!-- Groups & Questions (Read Only Preview) -->
         <div class="space-y-6">
            <div v-for="(group, gIdx) in section.groups" :key="group.idGroup" class="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden border-t-4 border-t-indigo-500">
               <div class="p-8 bg-gray-50/50 border-b border-gray-50">
                  <div class="flex items-center justify-between mb-4">
                     <span class="text-[10px] font-black text-indigo-400 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-lg">Grup Soal #{{ gIdx + 1 }}</span>
                  </div>
                  <div v-if="group.passage" class="prose prose-sm max-w-none text-slate-700 bg-white p-6 rounded-2xl border border-indigo-100 shadow-inner" v-html="group.passage"></div>
               </div>
               
               <div class="p-8">
                  <div class="grid grid-cols-1 gap-8">
                     <div v-for="(question, qIdx) in group.questions" :key="question.idQuestion" class="space-y-4">
                        <div class="flex gap-4">
                           <div class="flex-shrink-0 w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-black text-sm">
                              {{ qIdx + 1 }}
                           </div>
                           <div class="flex-grow">
                              <div class="text-slate-800 font-bold mb-4" v-html="question.text"></div>
                              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                 <div v-for="opt in question.options" :key="opt.idOption" 
                                      class="p-4 rounded-2xl border transition-all flex items-center gap-3"
                                      :class="opt.isCorrect ? 'bg-emerald-50 border-emerald-200 ring-1 ring-emerald-100' : 'bg-gray-50 border-gray-100'">
                                    <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors"
                                         :class="opt.isCorrect ? 'bg-emerald-500 border-emerald-500' : 'bg-white border-gray-200'">
                                       <Icon v-if="opt.isCorrect" name="lucide:check" class="w-3 h-3 text-white" />
                                    </div>
                                    <span class="text-sm font-medium" :class="opt.isCorrect ? 'text-emerald-900' : 'text-slate-600'">{{ opt.text }}</span>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'role-check']
});

const route = useRoute();
const sectionId = route.params.id as string;
const config = useRuntimeConfig();
const { $auth } = useNuxtApp();

const section = ref<any>(null);
const isLoading = ref(true);

const fetchSectionDetail = async () => {
  isLoading.value = true;
  try {
    const token = await $auth.currentUser?.getIdToken();
    // Reusing standard section route but this will be Template specific if batchId is NULL
    const response: any = await $fetch(`${config.public.API_URL}/sections/${sectionId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    section.value = response;
    console.log(section.value);
  } catch (err) {
    console.error("Error fetching bank detail:", err);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchSectionDetail();
});
</script>
