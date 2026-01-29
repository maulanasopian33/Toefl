<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionRoot, TransitionChild } from '@headlessui/vue'

const props = defineProps<{
  modelValue: boolean
  batchId: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void
  (e: 'imported'): void
}>()

const config = useRuntimeConfig()
const { $auth } = useNuxtApp()
const { showNotification } = useNotification()

const templates = ref<any[]>([])
const isLoading = ref(false)
const isImporting = ref<string | null>(null)

async function fetchTemplates() {
  isLoading.value = true
  try {
    const token = await $auth.currentUser?.getIdToken()
    const response: any = await $fetch(`${config.public.API_URL}/bank/templates`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    templates.value = response.data
  } catch (e) {
    showNotification('Gagal memuat Bank Soal.', 'error')
  } finally {
    isLoading.value = false
  }
}

async function handleImport(sectionId: string) {
  isImporting.value = sectionId
  try {
    const token = await $auth.currentUser?.getIdToken()
    await $fetch(`${config.public.API_URL}/bank/import/${sectionId}/to-batch/${props.batchId}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    })
    showNotification('Section berhasil di-import!', 'success')
    emit('imported')
    emit('update:modelValue', false)
  } catch (e) {
    showNotification('Gagal meng-import section.', 'error')
  } finally {
    isImporting.value = null
  }
}

onMounted(() => {
  if (props.modelValue) fetchTemplates()
})

watch(() => props.modelValue, (newVal) => {
  if (newVal) fetchTemplates()
})
</script>

<template>
  <TransitionRoot appear :show="modelValue" as="template">
    <Dialog as="div" @close="$emit('update:modelValue', false)" class="relative z-50">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/40 backdrop-blur-sm" />
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
            <DialogPanel class="w-full max-w-2xl transform overflow-hidden rounded-[2.5rem] bg-white text-left align-middle shadow-2xl transition-all border border-gray-100 flex flex-col h-[70vh]">
              <!-- Header -->
              <div class="px-8 py-6 border-b border-gray-50 flex items-center justify-between flex-shrink-0 bg-gray-50/30">
                <div class="flex items-center gap-3">
                   <div class="p-2.5 bg-rose-100 rounded-2xl flex items-center justify-center">
                      <Icon name="lucide:database-zap" class="w-6 h-6 text-rose-600" />
                   </div>
                   <div>
                      <DialogTitle as="h3" class="text-xl font-black text-gray-900 leading-none">Impor dari Bank Soal</DialogTitle>
                      <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1.5">Pilih section master untuk disalin ke batch ini</p>
                   </div>
                </div>
                <button @click="$emit('update:modelValue', false)" class="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all">
                  <Icon name="lucide:x" class="w-5 h-5" />
                </button>
              </div>

              <!-- Content -->
              <div class="flex-grow overflow-y-auto p-8 bg-white custom-scrollbar">
                <div v-if="isLoading" class="flex flex-col items-center justify-center h-full space-y-4">
                   <Icon name="lucide:loader-2" class="w-12 h-12 text-rose-100 animate-spin" />
                   <p class="text-[10px] font-black text-rose-300 uppercase tracking-widest">Sinkronisasi Pustaka...</p>
                </div>
                
                <div v-else-if="templates.length === 0" class="flex flex-col items-center justify-center h-full text-center p-8 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-100">
                   <Icon name="lucide:database" class="w-12 h-12 text-gray-200 mb-4" />
                   <p class="text-sm font-bold text-gray-400">Belum ada template di Bank Soal.</p>
                </div>

                <div v-else class="grid grid-cols-1 gap-4">
                  <div v-for="tpl in templates" :key="tpl.idSection" class="group p-5 bg-white border border-gray-100 rounded-[2rem] hover:border-rose-200 hover:shadow-xl hover:shadow-rose-50 transition-all flex items-center justify-between border-l-4 border-l-rose-500">
                     <div class="flex-grow">
                        <h4 class="font-black text-slate-800">{{ tpl.namaSection }}</h4>
                        <div class="flex items-center gap-3 mt-1">
                           <span class="text-[9px] font-mono text-gray-400 bg-gray-50 px-2 py-0.5 rounded-lg border border-gray-100">{{ tpl.idSection }}</span>
                           <span class="text-[9px] font-bold text-rose-400 uppercase tracking-wider">Template Master</span>
                        </div>
                     </div>
                     <button 
                       @click="handleImport(tpl.idSection)"
                       :disabled="!!isImporting"
                       class="inline-flex items-center gap-2 px-5 py-2.5 bg-rose-600 text-white rounded-2xl text-xs font-black shadow-lg shadow-rose-200 hover:bg-rose-700 transition-all transform active:scale-95 disabled:opacity-50"
                     >
                        <Icon v-if="isImporting === tpl.idSection" name="lucide:loader-2" class="w-4 h-4 animate-spin" />
                        <Icon v-else name="lucide:download" class="w-4 h-4" />
                        {{ isImporting === tpl.idSection ? 'Mengimpor...' : 'Impor Section' }}
                     </button>
                  </div>
                </div>
              </div>

              <!-- Footer -->
              <div class="px-8 py-5 border-t border-gray-50 bg-gray-50/30 flex justify-end flex-shrink-0">
                <p class="text-[9px] font-bold text-gray-400 italic">Menciptakan salinan independen soal ke batch ini.</p>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
