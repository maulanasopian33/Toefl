<template>
  <TransitionRoot as="template" :show="show">
    <Dialog as="div" class="relative z-[200]" @close="$emit('close')">
      <!-- Backdrop (Optional for floating feel, but safe for accessibility) -->
      <TransitionChild 
        as="template" 
        enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100" 
        leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] transition-opacity" />
      </TransitionChild>

      <div class="fixed inset-0 z-20 overflow-hidden pointer-events-none">
        <div class="flex h-full items-center justify-end p-4 md:p-8">
          <TransitionChild 
            as="template" 
            enter="ease-out duration-500" enter-from="opacity-0 translate-x-32 scale-95" enter-to="opacity-100 translate-x-0 scale-100" 
            leave="ease-in duration-300" leave-from="opacity-100 translate-x-0 scale-100" leave-to="opacity-0 translate-x-32 scale-95"
          >
            <DialogPanel class="relative transform bg-white shadow-2xl transition-all h-full w-full max-w-2xl rounded-[2.5rem] border border-slate-100 flex flex-col pointer-events-auto">
              
              <!-- Popup Header -->
              <div class="px-8 py-6 border-b border-slate-100 flex items-center justify-between flex-shrink-0">
                <div class="flex items-center gap-3">
                  <div class="p-2 bg-emerald-50 rounded-xl text-emerald-600">
                    <Icon name="lucide:book-open" class="w-5 h-5" />
                  </div>
                  <div>
                    <h3 class="font-black text-slate-900">Panduan Mengambang</h3>
                    <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Membantu Anda Sambil Bekerja</p>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                   <button @click="$emit('close')" class="p-2.5 rounded-2xl text-slate-400 hover:bg-slate-50 hover:text-slate-900 transition-all">
                    <Icon name="lucide:x" class="w-6 h-6" />
                  </button>
                </div>
              </div>

              <!-- Content Body -->
              <div class="flex-1 overflow-y-auto p-8 custom-scrollbar">
                <slot></slot>
              </div>

              <!-- Footer info -->
              <div class="px-8 py-4 bg-slate-50/50 border-t border-slate-50 text-center">
                <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                  Geser atau buka jendela lain sambil tetap melihat panduan ini.
                </p>
              </div>

            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue'

defineProps<{
  show: boolean;
}>()

defineEmits(['close'])
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #E2E8F0;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #CBD5E1;
}
</style>
