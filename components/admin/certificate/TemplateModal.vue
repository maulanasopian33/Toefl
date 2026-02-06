<template>
  <TransitionRoot as="template" :show="show">
    <Dialog as="div" class="relative z-[100]" @close="$emit('close')">
      <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" />
      </TransitionChild>

      <div class="fixed inset-0 z-10 overflow-y-auto">
        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200" leave-from="opacity-100 translate-y-0 sm:scale-100" leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
            <DialogPanel class="relative transform overflow-hidden rounded-[2.5rem] bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-3xl border border-gray-100">
              
              <!-- Modal Header -->
              <div class="px-8 pt-8 pb-6 border-b border-gray-50 flex items-center justify-between sticky top-0 bg-white z-20">
                <div class="flex items-center gap-4">
                  <div class="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
                    <Icon :name="initialData ? 'lucide:file-edit' : 'lucide:file-plus-2'" class="w-6 h-6" />
                  </div>
                  <div>
                    <DialogTitle as="h3" class="text-xl font-black text-gray-900">{{ initialData ? 'Edit Template' : 'Tambah Template Baru' }}</DialogTitle>
                    <p class="text-xs text-gray-400 font-bold uppercase tracking-widest mt-0.5">Definisikan format dan variabel</p>
                  </div>
                </div>
                <button @click="$emit('close')" class="p-2.5 rounded-2xl text-gray-400 hover:bg-slate-50 hover:text-gray-900 transition-all active:scale-90">
                  <Icon name="lucide:x" class="w-6 h-6" />
                </button>
              </div>

              <!-- Form Body -->
              <div class="px-8 py-8 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                
                <!-- Main Template Level Info -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8 border-b border-gray-100">
                  <div class="space-y-2">
                    <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] leading-none">Nama Sertifikat</label>
                    <input 
                      v-model="form.name" 
                      type="text" 
                      class="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold text-gray-700 text-sm shadow-sm"
                      placeholder="Contoh: Sertifikat Kelulusan TOEFL"
                    />
                  </div>
                  <div class="space-y-2">
                    <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] leading-none">Status</label>
                    <div class="flex items-center gap-4 h-[50px]">
                       <Switch
                        v-model="form.status"
                        :class="form.status ? 'bg-emerald-500' : 'bg-gray-200'"
                        class="relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
                      >
                        <span class="sr-only">Status</span>
                        <span
                          aria-hidden="true"
                          :class="form.status ? 'translate-x-5' : 'translate-x-0'"
                          class="pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                        />
                      </Switch>
                      <span class="text-sm font-bold" :class="form.status ? 'text-emerald-600' : 'text-gray-400'">
                        {{ form.status ? 'Aktif' : 'Non-Aktif' }}
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Formats Section -->
                <div class="space-y-6">
                  <div class="flex items-center justify-between">
                    <div>
                      <h4 class="text-sm font-black text-gray-900">Format File (DOCX)</h4>
                      <p class="text-[10px] text-gray-400 font-bold uppercase tracking-tight mt-0.5">Satu template bisa memiliki beberapa format desain</p>
                    </div>
                    <button 
                      @click="addFormat"
                      type="button" 
                      class="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-bold hover:bg-indigo-100 hover:scale-105 active:scale-95 transition-all"
                    >
                      <Icon name="lucide:plus" class="w-4 h-4" />
                      Tambah Format
                    </button>
                  </div>

                  <div class="space-y-4">
                    <div 
                      v-for="(f, index) in form.formats" 
                      :key="index"
                      class="p-6 bg-gray-50/50 rounded-3xl border border-gray-100 relative group/format hover:border-indigo-200 hover:bg-white transition-all duration-300 shadow-sm"
                    >
                      <button 
                        @click="removeFormat(index)"
                        class="absolute -top-3 -right-3 h-8 w-8 bg-white border border-rose-100 text-rose-500 rounded-full shadow-lg opacity-0 group-hover/format:opacity-100 transition-all active:scale-90 flex items-center justify-center z-10"
                      >
                        <Icon name="lucide:x" class="w-4 h-4" />
                      </button>

                      <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
                        <div class="md:col-span-5 space-y-2">
                           <label class="block text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Label Format</label>
                           <input 
                            v-model="f.name" 
                            type="text" 
                            class="w-full px-4 py-2.5 bg-white border border-gray-100 rounded-xl focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-bold text-gray-700 text-xs"
                            placeholder="Contoh: Portrait Modern"
                          />
                        </div>

                        <div class="md:col-span-12 space-y-2">
                           <label class="block text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">File DOCX</label>
                           
                           <!-- Upload Area -->
                           <div 
                            @click="triggerFileUpload(index)"
                            class="flex items-center gap-4 px-4 py-3 bg-white border-2 border-dashed border-gray-200 rounded-xl hover:border-indigo-400 hover:bg-indigo-50/20 cursor-pointer transition-all group/upload"
                           >
                             <div class="h-10 w-10 bg-slate-50 rounded-lg flex items-center justify-center group-hover/upload:bg-indigo-600 group-hover/upload:text-white transition-colors">
                               <Icon :name="f.file_docx ? 'lucide:file-check' : 'lucide:upload-cloud'" class="w-5 h-5 opacity-60 group-hover/upload:opacity-100" />
                             </div>
                             <div class="flex-grow min-w-0">
                               <p class="text-xs font-bold text-gray-700 truncate" v-if="f.file_docx">{{ f.file_docx.split('/').pop() }}</p>
                               <p class="text-xs font-bold text-gray-400" v-else>Klik untuk upload file .docx</p>
                             </div>
                             <input 
                              :id="`file-upload-${index}`" 
                              type="file" 
                              accept=".docx" 
                              class="hidden" 
                              @change="e => handleFileChange(index, e)"
                             />
                           </div>
                        </div>

                        <div class="md:col-span-12 flex items-center gap-2">
                           <input type="checkbox" v-model="f.is_active" class="rounded text-indigo-600 focus:ring-indigo-500" />
                           <span class="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Aktifkan format ini</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Variables Tip -->
                <div class="bg-amber-50 p-6 rounded-3xl border border-amber-100 flex gap-4">
                  <div class="p-2 bg-amber-100 rounded-xl text-amber-600 h-10 w-10 flex items-center justify-center flex-shrink-0">
                    <Icon name="lucide:info" class="w-6 h-6" />
                  </div>
                  <div>
                    <h5 class="text-sm font-black text-amber-900 leading-none mb-2">Informasi Variabel Jigga</h5>
                    <p class="text-xs text-amber-800 leading-relaxed font-medium">
                      Gunakan tag <code class="bg-white px-1.5 py-0.5 rounded-md font-bold text-amber-600">\{{nama}}</code> di dalam file DOCX Anda. Sistem akan menggantinya dengan nama lengkap peserta saat sertifikat dibuat.
                    </p>
                  </div>
                </div>
              </div>

              <!-- Action Footer -->
              <div class="px-8 py-6 border-t border-gray-50 flex items-center justify-end gap-4 bg-gray-50/50 sticky bottom-0 z-20">
                <button
                  @click="$emit('close')"
                  class="px-6 py-3 rounded-2xl text-sm font-bold text-gray-500 hover:bg-white hover:text-gray-900 transition-all border border-transparent hover:border-gray-200"
                >
                  Batal
                </button>
                <button
                  @click="handleSave"
                  class="inline-flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white font-black rounded-2xl shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 hover:scale-105 active:scale-95 transition-all transform"
                >
                  <Icon name="lucide:check" class="w-5 h-5" />
                  Simpan Template
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
import { ref, reactive, onMounted } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot, Switch } from '@headlessui/vue'
import type { CertificateTemplate, CertificateTemplateFormat } from '@/composables/useCertificateTemplates'

const props = defineProps<{
  show: boolean;
  initialData: CertificateTemplate | null;
}>()

const emit = defineEmits(['close', 'save'])
const config = useRuntimeConfig()

const form = reactive<CertificateTemplate>(props.initialData ? JSON.parse(JSON.stringify(props.initialData)) : {
  name: '',
  status: true,
  formats: []
})

if (form.formats.length === 0) {
  form.formats.push({ name: '', file_docx: '', is_active: true })
}

const addFormat = () => {
  form.formats.push({ name: '', file_docx: '', is_active: true })
}

const removeFormat = (index: number) => {
  form.formats.splice(index, 1)
  if (form.formats.length === 0) addFormat()
}

const triggerFileUpload = (index: number) => {
  document.getElementById(`file-upload-${index}`)?.click()
}

const handleFileChange = async (index: number, event: any) => {
  const file = event.target.files[0]
  if (!file) return

  // Need to upload the file and get the URL
  const formData = new FormData()
  formData.append('media', file)

  try {
    const { uploadMedia } = useAppSettings() // Reuse uploadMedia if available or create local
    const url = await uploadMedia(file)
    form.formats[index].file_docx = url
  } catch (err) {
    console.error('File upload failed', err)
  }
}

const handleSave = () => {
  if (!form.name) return
  emit('save', form)
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  @apply bg-transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  @apply bg-slate-200 rounded-full;
}
</style>
