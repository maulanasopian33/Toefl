<template>
  <TransitionRoot as="template" :show="show">
    <Dialog as="div" class="relative z-[100]" @close="$emit('close')">
      <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" />
      </TransitionChild>

      <div class="fixed inset-0 z-10 overflow-y-auto">
        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200" leave-from="opacity-100 translate-y-0 sm:scale-100" leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
            <DialogPanel class="relative transform overflow-hidden rounded-[2.5rem] bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-xl border border-gray-100">
              
              <!-- Modal Header -->
              <div class="px-8 pt-8 pb-6 border-b border-gray-50 flex items-center justify-between sticky top-0 bg-white z-20">
                <div class="flex items-center gap-4">
                  <div class="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
                    <Icon :name="initialData ? 'lucide:file-edit' : 'lucide:file-plus-2'" class="w-6 h-6" />
                  </div>
                  <div>
                    <DialogTitle as="h3" class="text-xl font-black text-gray-900">{{ initialData ? 'Edit Template' : 'Tambah Template Baru' }}</DialogTitle>
                    <p class="text-xs text-gray-400 font-bold uppercase tracking-widest mt-0.5">Atur file template sertifikat Anda</p>
                  </div>
                </div>
                <button @click="$emit('close')" class="p-2.5 rounded-2xl text-gray-400 hover:bg-slate-50 hover:text-gray-900 transition-all active:scale-90">
                  <Icon name="lucide:x" class="w-6 h-6" />
                </button>
              </div>

              <!-- Form Body -->
              <div class="px-8 py-8 space-y-6">
                <!-- Name Input -->
                <div class="space-y-2">
                  <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] leading-none">Nama Template</label>
                  <input 
                    v-model="form.name" 
                    type="text" 
                    class="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold text-gray-700 text-sm shadow-sm"
                    placeholder="Contoh: Sertifikat Kelulusan TOEFL"
                  />
                </div>

                <!-- File Selection -->
                <div class="space-y-2">
                  <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] leading-none">File Template (.docx)</label>
                  <div 
                    @click="triggerFileUpload"
                    class="flex items-center gap-4 px-5 py-6 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl hover:border-indigo-400 hover:bg-indigo-50/20 cursor-pointer transition-all group/upload"
                  >
                    <div class="h-12 w-12 bg-white rounded-xl shadow-sm flex items-center justify-center group-hover/upload:bg-indigo-600 group-hover/upload:text-white transition-colors">
                      <Icon :name="selectedFile || existingFile ? 'lucide:file-check' : 'lucide:upload-cloud'" class="w-6 h-6 opacity-60 group-hover/upload:opacity-100" />
                    </div>
                    <div class="flex-grow min-w-0">
                      <p class="text-sm font-bold text-gray-700 truncate" v-if="selectedFile">{{ selectedFile.name }}</p>
                      <p class="text-sm font-bold text-gray-700 truncate" v-else-if="existingFile">{{ existingFile.split('/').pop() }}</p>
                      <p class="text-sm font-bold text-gray-400" v-else>Klik untuk memilih file</p>
                    </div>
                    <input 
                      id="template-file-upload" 
                      type="file" 
                      accept=".docx" 
                      class="hidden" 
                      @change="handleFileChange"
                    />
                  </div>
                </div>

                <!-- Status Switch -->
                <div class="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <span class="text-sm font-bold text-gray-700">Status Aktif</span>
                  <Switch
                    v-model="form.status"
                    :class="form.status ? 'bg-emerald-500' : 'bg-gray-300'"
                    class="relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
                  >
                    <span
                      aria-hidden="true"
                      :class="form.status ? 'translate-x-5' : 'translate-x-0'"
                      class="pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                    />
                  </Switch>
                </div>

                <!-- Info Alert -->
                <div class="bg-amber-50 p-5 rounded-2xl border border-amber-100 flex gap-4">
                  <Icon name="lucide:info" class="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <p class="text-[11px] text-amber-800 leading-relaxed font-bold">
                    Gunakan variabel <code class="bg-white px-1.5 py-0.5 rounded-md text-amber-600">\{{nama}}</code> di dalam file DOCX untuk menampilkan nama peserta secara otomatis.
                  </p>
                </div>
              </div>

              <!-- Action Footer -->
              <div class="px-8 py-6 border-t border-gray-50 flex items-center justify-end gap-3 bg-gray-50/50">
                <button
                  @click="$emit('close')"
                  class="px-6 py-3 rounded-2xl text-sm font-bold text-gray-500 hover:bg-white hover:text-gray-900 transition-all border border-transparent hover:border-gray-200"
                >
                  Batal
                </button>
                <button
                  @click="handleSave"
                  class="inline-flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white font-black rounded-2xl shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 hover:scale-105 active:scale-95 transition-all transform disabled:opacity-50 disabled:pointer-events-none"
                  :disabled="!isFormValid || isSaving"
                >
                  <Icon v-if="isSaving" name="lucide:loader-2" class="w-5 h-5 animate-spin" />
                  <Icon v-else name="lucide:check" class="w-5 h-5" />
                  {{ isSaving ? 'Menyimpan...' : 'Simpan Template' }}
                </button>
              </div>

            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot, Switch } from '@headlessui/vue'
import type { CertificateTemplate } from '@/composables/useCertificateTemplates'

const props = defineProps<{
  show: boolean;
  initialData: CertificateTemplate | null;
}>()

const emit = defineEmits(['close', 'save'])
const { isSaving } = useCertificateTemplates()

const form = reactive({
  id: props.initialData?.id || null,
  name: props.initialData?.name || '',
  status: props.initialData?.status ?? true
})

const existingFile = ref(props.initialData?.formats?.[0]?.file_docx || '')
const selectedFile = ref<File | null>(null)

const isFormValid = computed(() => {
  return form.name && (selectedFile.value || existingFile.value)
})

const triggerFileUpload = () => {
  document.getElementById('template-file-upload')?.click()
}

const handleFileChange = (event: any) => {
  const file = event.target.files[0]
  if (file) {
    selectedFile.value = file
  }
}

const handleSave = () => {
  if (!isFormValid.value) return

  const formData = new FormData()
  if (form.id) formData.append('id', form.id.toString())
  formData.append('name', form.name)
  formData.append('status', form.status.toString())
  
  if (selectedFile.value) {
    formData.append('file_docx', selectedFile.value)
  } else {
    formData.append('file_docx', existingFile.value)
  }

  emit('save', formData)
}
</script>
