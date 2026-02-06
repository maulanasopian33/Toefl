<template>
  <div class="space-y-8 animate-fade-in-up">
    <!-- HEADER -->
    <header class="flex flex-col gap-4 rounded-[2rem] bg-white px-8 py-6 border border-gray-100 shadow-xl ring-1 ring-gray-900/5 sm:flex-row sm:items-center sm:justify-between transition-all hover:shadow-2xl">
      <div>
        <h1 class="text-xl md:text-2xl font-black text-gray-900 tracking-tight flex items-center gap-3">
          <div class="p-2.5 bg-indigo-100 rounded-2xl">
            <Icon name="lucide:award" class="w-6 h-6 text-indigo-600" />
          </div>
          Template Sertifikat
        </h1>
        <p class="mt-2 text-sm text-gray-500 font-medium">
          Kelola template sertifikat dan format file DOCX dengan variabel dinamis.
        </p>
      </div>

      <button
        @click="openModal()"
        class="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all transform active:scale-95 whitespace-nowrap"
      >
        <Icon name="lucide:plus" class="w-5 h-5" />
        Tambah Template
      </button>
    </header>

    <!-- CONTENT -->
    <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="i in 3" :key="i" class="h-64 bg-white rounded-[2.5rem] border border-gray-100 animate-pulse shadow-sm"></div>
    </div>

    <div v-else-if="templates.length === 0" class="flex flex-col items-center justify-center py-20 bg-white rounded-[2.5rem] border border-dashed border-gray-200 shadow-inner">
      <div class="p-6 bg-slate-50 rounded-full mb-4">
        <Icon name="lucide:file-question" class="w-12 h-12 text-slate-300" />
      </div>
      <p class="text-lg font-bold text-gray-400">Belum ada template</p>
      <p class="text-sm text-gray-400 mt-1">Klik tombol 'Tambah Template' untuk memulai.</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="template in templates"
        :key="template.id"
        class="group bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
      >
        <div class="p-8">
          <div class="flex justify-between items-start mb-6">
            <div class="p-4 bg-indigo-50 rounded-[1.5rem] text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
              <Icon name="lucide:file-text" class="w-8 h-8" />
            </div>
            <div 
              class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border"
              :class="template.status ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'"
            >
              {{ template.status ? 'Aktif' : 'Non-Aktif' }}
            </div>
          </div>

          <h3 class="text-xl font-black text-gray-900 group-hover:text-indigo-600 transition-colors mb-2 truncate">
            {{ template.name }}
          </h3>
          <p class="text-xs text-gray-400 font-medium flex items-center gap-1.5 mb-6">
            <Icon name="lucide:layers" class="w-3.5 h-3.5" />
            {{ template.formats?.length || 0 }} Format Tersedia
          </p>

          <div class="flex items-center gap-2">
            <button
              @click="openModal(template)"
              class="flex-grow inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-50 border border-slate-100 px-4 py-2.5 text-xs font-bold text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-100 transition-all active:scale-95"
            >
              <Icon name="lucide:edit-3" class="w-4 h-4" />
              Kelola
            </button>
            <button
              @click="deleteTemplate(template.id!)"
              class="inline-flex items-center justify-center h-10 w-10 rounded-2xl bg-slate-50 border border-slate-100 text-slate-400 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 transition-all active:scale-90"
            >
              <Icon name="lucide:trash-2" class="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <!-- Quick Preview of Formats -->
        <div class="px-8 pb-8 pt-0 space-y-2">
           <div v-for="format in template.formats?.slice(0, 2)" :key="format.id" class="flex items-center justify-between text-[10px] font-bold text-gray-400 bg-slate-50/50 px-3 py-2 rounded-xl">
              <span class="truncate pr-4">{{ format.name }}</span>
              <Icon v-if="format.is_active" name="lucide:check-circle" class="w-3 h-3 text-emerald-500" />
           </div>
           <div v-if="(template.formats?.length || 0) > 2" class="text-[9px] text-center text-gray-300 font-bold uppercase tracking-widest pt-1">
             + {{ template.formats!.length - 2 }} format lainnya
           </div>
        </div>
      </div>
    </div>

    <!-- MODAL -->
    <TemplateModal
      v-if="isModalOpen"
      :show="isModalOpen"
      :initial-data="selectedTemplate"
      @close="isModalOpen = false"
      @save="handleSave"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useCertificateTemplates, type CertificateTemplate } from '@/composables/useCertificateTemplates'
import TemplateModal from '@/components/admin/certificate/TemplateModal.vue'

definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'role-check'],
  permission: 'system.app'
})

const { templates, isLoading, fetchTemplates, deleteTemplate, saveTemplate } = useCertificateTemplates()

const isModalOpen = ref(false)
const selectedTemplate = ref<CertificateTemplate | null>(null)

const openModal = (template: CertificateTemplate | null = null) => {
  selectedTemplate.value = template ? JSON.parse(JSON.stringify(template)) : null
  isModalOpen.value = true
}

const handleSave = async (data: CertificateTemplate) => {
  const result = await saveTemplate(data)
  if (result) {
    isModalOpen.value = false
  }
}

onMounted(() => {
  fetchTemplates()
})
</script>

<style scoped>
.animate-fade-in-up {
  animation: fade-in-up 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
