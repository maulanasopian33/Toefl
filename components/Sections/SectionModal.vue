<template>
  <TransitionRoot appear :show="show" as="template">
    <Dialog as="div" @close="emit('update:show', false)" class="relative z-50">
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
                    <Icon :name="payload?.id ? 'lucide:edit-3' : 'lucide:plus-circle'" class="w-5 h-5 text-blue-600" />
                 </div>
                 {{ payload?.id ? 'Edit' : 'Tambah' }} Bagian
              </DialogTitle>
              
              <div class="space-y-4">
                 <div class="space-y-2">
                    <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none px-1">Nama Bagian</label>
                    <input 
                      v-model="name" 
                      class="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-gray-700 text-sm"
                      placeholder="Contoh: Section 1" 
                    />
                 </div>

                 <div class="mt-8 flex justify-end gap-3">
                    <button 
                      type="button" 
                      @click="emit('update:show', false)"
                      class="px-4 py-2.5 rounded-xl text-gray-700 hover:bg-gray-100 font-medium transition-colors text-sm"
                    >
                       Batal
                    </button>
                    <button 
                      type="button" 
                      @click="save"
                      :disabled="!name"
                      class="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-200 transition-all transform active:scale-95 flex items-center gap-2 text-sm disabled:opacity-50"
                    >
                       Simpan Bagian
                    </button>
                 </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { ref, watch } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionRoot, TransitionChild } from '@headlessui/vue'

const props = defineProps({ show: Boolean, payload: Object })
const emit = defineEmits(['update:show', 'saved'])

const name = ref('')

watch(() => props.payload, (val) => {
  name.value = val?.name || ''
}, { immediate: true })

const save = async () => {
  const newPayload = { ...props.payload, name: name.value };
  emit('saved', newPayload)
  emit('update:show', false)
}
</script>
