<template>
  <TransitionRoot appear :show="!!item" as="template">
    <Dialog as="div" @close="$emit('close')" class="relative z-50">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/40 backdrop-blur-md" />
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
            <DialogPanel class="w-full max-w-2xl transform overflow-hidden rounded-[2rem] bg-white p-0 text-left align-middle shadow-2xl transition-all border border-gray-100 ring-1 ring-gray-900/5">
              <!-- Header -->
              <div class="px-8 py-6 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between gap-4">
                 <div class="flex items-center gap-4">
                    <div class="p-2 bg-blue-100 rounded-xl">
                       <Icon :name="item?.type === 'image' ? 'lucide:image' : 'lucide:music'" class="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                       <DialogTitle as="h3" class="text-sm font-extrabold text-gray-900 truncate max-w-[300px]" :title="item?.originalName">
                          {{ item?.originalName }}
                       </DialogTitle>
                       <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                          {{ item?.mimeType }} • {{ formatSize(item?.size) }}
                       </p>
                    </div>
                 </div>
                 <button
                   class="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all"
                   @click="$emit('close')"
                 >
                   <Icon name="lucide:x" class="w-5 h-5" />
                 </button>
              </div>

              <!-- Content -->
              <div class="p-8 bg-white overflow-hidden min-h-[300px] flex items-center justify-center">
                 <div v-if="item" class="w-full flex items-center justify-center">
                    <template v-if="item.type === 'image'">
                       <div class="relative rounded-2xl overflow-hidden shadow-2xl bg-gray-900 ring-1 ring-white/10 group">
                         <img
                           :src="getFullUrl ? getFullUrl(item.url) : item.url"
                           :alt="item.originalName"
                           class="max-h-[60vh] max-w-full object-contain mx-auto transition-transform duration-500 group-hover:scale-[1.02]"
                         />
                       </div>
                    </template>
                    <template v-else-if="item.type === 'audio'">
                       <div class="w-full max-w-md bg-gray-50 p-8 rounded-[2rem] border border-gray-100 shadow-sm text-center">
                          <div class="flex items-center justify-center mb-6 text-amber-500">
                             <div class="p-5 bg-amber-50 rounded-[1.5rem] shadow-sm ring-1 ring-amber-100">
                                <Icon name="lucide:music" class="w-12 h-12" />
                             </div>
                          </div>
                          <audio :src="getFullUrl ? getFullUrl(item.url) : item.url" controls class="w-full rounded-full" />
                          <p class="mt-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Audio Preview</p>
                       </div>
                    </template>
                    <template v-else>
                       <div class="flex flex-col items-center gap-4 text-gray-300 py-16">
                         <div class="p-6 bg-gray-50 rounded-[2rem] border border-dashed border-gray-200">
                            <Icon name="lucide:file-question" class="w-16 h-16 opacity-20" />
                         </div>
                         <span class="text-sm font-bold text-gray-400 italic">Pratinjau tidak tersedia</span>
                       </div>
                    </template>
                 </div>
              </div>

              <!-- Footer Actions -->
              <div class="px-8 py-6 border-t border-gray-50 bg-gray-50/50 flex items-center justify-between gap-4">
                 <button
                   class="flex-1 px-5 py-3 bg-white border border-gray-200 hover:bg-gray-100 text-gray-700 text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm transform active:scale-95"
                   @click="$emit('download', item)"
                 >
                   <Icon name="lucide:download" class="w-4 h-4" />
                   <span>Download</span>
                 </button>
                 <button
                   class="flex-1 px-5 py-3 bg-rose-50 border border-rose-100 hover:bg-rose-100 text-rose-600 text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition-all transform active:scale-95 shadow-sm shadow-rose-100/50"
                   @click="$emit('delete', item)"
                 >
                   <Icon name="lucide:trash-2" class="w-4 h-4" />
                   <span>Hapus File</span>
                 </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { Dialog, DialogPanel, DialogTitle, TransitionRoot, TransitionChild } from '@headlessui/vue'

defineProps(['item', 'formatSize', 'formatDate', 'getFullUrl']);
defineEmits(['close', 'download', 'delete']);
</script>