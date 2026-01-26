<template>
  <div class="p-6 sm:p-8">
    <header class="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-slate-800">Manajemen Template</h1>
        <p class="mt-1 text-slate-600">Kelola dan atur template sertifikat (file .docx) yang akan digunakan.</p>
      </div>
      <button 
        @click="openModal()"
        class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-all shadow-sm shadow-blue-200"
      >
        <Icon name="lucide:plus" class="w-4 h-4" />
        Tambah Template
      </button>
    </header>

    <!-- Template Grid -->
    <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
       <div v-for="i in 3" :key="i" class="animate-pulse bg-gray-200 rounded-3xl h-64"></div>
    </div>

    <div v-else-if="templates.length === 0" class="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-300 text-gray-400">
       <Icon name="lucide:file-text" class="w-16 h-16 mb-4 opacity-50" />
       <p class="font-medium">Belum ada template</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="template in templates" 
        :key="template.id"
        class="group relative bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:border-gray-300 flex flex-col"
      >
        <!-- Preview / Icon Area -->
        <div class="aspect-[4/3] bg-blue-50 relative overflow-hidden flex items-center justify-center group-hover:bg-blue-100/50 transition-colors">
           <!-- If explicit preview exists, show it, otherwise show generic DOCX icon -->
           <img 
            v-if="template.previewImage" 
            :src="template.previewImage" 
            :alt="template.name"
            class="w-full h-full object-cover"
           />
           <div v-else class="flex flex-col items-center text-blue-300 group-hover:text-blue-400 transition-colors transform group-hover:-translate-y-1 duration-300">
               <Icon name="lucide:file-text" class="w-20 h-20" />
               <span class="text-xs font-semibold mt-2 uppercase tracking-wide">DOCX Template</span>
           </div>
           
           <!-- Active Badge -->
           <div v-if="template.isActive" class="absolute top-3 left-3 z-10">
              <span class="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/90 backdrop-blur-sm text-white text-xs font-bold rounded-full shadow-sm">
                 <Icon name="lucide:check-circle-2" class="w-3.5 h-3.5" />
                 Digunakan
              </span>
           </div>

           <!-- Overlay Actions -->
           <div class="absolute inset-0 bg-gray-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2 backdrop-blur-[2px]">
              <!-- We can't easily preview DOCX in-browser without a viewer, so link to download or specialized viewer -->
              <a 
                 :href="template.templateFile" 
                 target="_blank"
                 download
                 class="p-2 bg-white/90 hover:bg-white text-gray-700 rounded-full shadow-sm transition-transform hover:scale-110"
                 title="Download Template"
              >
                 <Icon name="lucide:download" class="w-4 h-4" />
              </a>
              <button 
                 @click="openModal(template)"
                 class="p-2 bg-white/90 hover:bg-white text-blue-600 rounded-full shadow-sm transition-transform hover:scale-110"
                 title="Edit"
              >
                 <Icon name="lucide:edit-2" class="w-4 h-4" />
              </button>
              <button 
                 @click="confirmDelete(template)"
                 class="p-2 bg-white/90 hover:bg-white text-red-600 rounded-full shadow-sm transition-transform hover:scale-110"
                 title="Hapus"
              >
                 <Icon name="lucide:trash-2" class="w-4 h-4" />
              </button>
           </div>
        </div>

        <!-- Content Area -->
        <div class="p-4 flex-1 flex flex-col justify-between">
           <div>
              <div class="flex items-start justify-between gap-2 mb-1">
                 <h3 class="font-bold text-gray-800 line-clamp-1" :title="template.name">{{ template.name }}</h3>
              </div>
              <p class="text-xs text-gray-500 font-mono truncate mb-3" :title="template.templateFile">
                 {{ template.templateFile }}
              </p>
           </div>
           
           <div class="flex justify-between items-end mt-2 pt-3 border-t border-gray-50">
               <p class="text-[10px] text-gray-400">Ditambahkan {{ formatDate(template.createdAt) }}</p>
               
               <button 
                  v-if="!template.isActive"
                  @click="handleSetActive(template.id)"
                  class="text-xs font-semibold px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50"
                  :disabled="isLoading"
               >
                  Set Aktif
               </button>
               <span v-else class="text-xs font-semibold px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-100">
                  Aktif
               </span>
           </div>
        </div>
      </div>
    </div>

    <!-- Modal Form -->
    <TransitionRoot appear :show="isModalOpen" as="template">
      <Dialog as="div" @close="closeModal" class="relative z-50">
        <TransitionChild
          as="template"
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black/25 backdrop-blur-sm" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as="template"
              enter="duration-300 ease-out"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all border border-gray-100">
                <DialogTitle as="h3" class="text-lg font-bold leading-6 text-gray-900 mb-6 flex items-center gap-2">
                   <div class="p-1.5 bg-blue-100 rounded-lg">
                      <Icon :name="editingId ? 'lucide:edit-2' : 'lucide:plus'" class="w-5 h-5 text-blue-600" />
                   </div>
                   {{ editingId ? 'Edit Template' : 'Tambah Template Baru' }}
                </DialogTitle>
                
                <form @submit.prevent="handleSubmit" class="space-y-4">
                   <div class="space-y-2">
                      <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Nama Template</label>
                      <input 
                        type="text" 
                        v-model="formData.name" 
                        class="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-gray-700 text-sm"
                        placeholder="Contoh: Sertifikat Seminar"
                        required
                      />
                   </div>
                   
                   <div class="space-y-2">
                      <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Link File Template (.docx)</label>
                      <div class="relative">
                          <input 
                            type="text" 
                            v-model="formData.templateFile" 
                            class="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-mono font-bold text-gray-700 text-sm"
                            placeholder="/path/to/template.docx"
                            required
                          />
                          <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                             <Icon name="lucide:file-type" class="w-4 h-4 text-gray-400" />
                          </div>
                      </div>
                      <p class="text-[10px] text-gray-400 font-medium italic mt-1">* Pastikan URL dapat diakses atau path file valid.</p>
                   </div>
                   
                   <div class="bg-blue-50 rounded-lg p-3 flex items-start gap-3 mt-2">
                      <Icon name="lucide:info" class="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div class="text-xs text-blue-800">
                         <p class="font-semibold mb-1">Format Template:</p>
                         <p>Gunakan file Microsoft Word (.docx). Sistem akan mengganti placeholder (misal: <code>${Name}</code>, <code>${Score}</code>) secara otomatis.</p>
                      </div>
                   </div>

                   <div class="mt-8 flex justify-end gap-3">
                      <button 
                        type="button" 
                        @click="closeModal"
                        class="px-4 py-2.5 rounded-xl text-gray-700 hover:bg-gray-100 font-medium transition-colors text-sm"
                      >
                         Batal
                      </button>
                      <button 
                        type="submit" 
                        class="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-200 transition-all flex items-center gap-2 text-sm disabled:opacity-60"
                        :disabled="isLoading"
                      >
                         <Icon v-if="isLoading" name="lucide:loader-2" class="w-4 h-4 animate-spin" />
                         {{ editingId ? 'Simpan Perubahan' : 'Tambah Template' }}
                      </button>
                   </div>
                </form>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

  </div>
</template>

<script setup lang="ts">
import { useNotificationPopup } from '@/composables/NotificationPopup'

const { showConfirm } = useNotificationPopup()
const { templates, isLoading, addTemplate, updateTemplate, deleteTemplate, setActiveTemplate } = useCertificateTemplates()

// Modal State
const isModalOpen = ref(false)
const editingId = ref<string | null>(null)
const formData = reactive({
  name: '',
  templateFile: ''
})

const openModal = (template?: CertificateTemplate) => {
  if (template) {
    editingId.value = template.id
    formData.name = template.name
    formData.templateFile = template.templateFile
  } else {
    editingId.value = null
    formData.name = ''
    formData.templateFile = ''
  }
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  setTimeout(() => {
     editingId.value = null
     formData.name = ''
     formData.templateFile = ''
  }, 200)
}

const { showNotification } = useNotification()

const handleSubmit = async () => {
  try {
    if (editingId.value) {
      await updateTemplate(editingId.value, { ...formData })
    } else {
      await addTemplate({ ...formData })
    }
    closeModal()
    showNotification('Template berhasil disimpan.', 'success')
  } catch (e) {
    console.error(e)
    showNotification('Terjadi kesalahan saat menyimpan data.', 'error')
  }
}

const handleSetActive = async (id: string) => {
   await setActiveTemplate(id)
}

const confirmDelete = async (template: CertificateTemplate) => {
   const confirmed = await showConfirm(
     `Template "${template.name}" akan dihapus secara permanen.`,
     {
       title: 'Hapus Template?',
       type: 'danger',
       confirmText: 'Ya, Hapus'
     }
   )
   
   if (confirmed) {
      await deleteTemplate(template.id)
   }
}

const formatDate = (iso: string) => {
   return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}
</script>
