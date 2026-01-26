<template>
  <TransitionRoot appear :show="modelValue" as="template">
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
              <DialogTitle v-if="result" as="h3" class="text-lg font-bold leading-6 text-gray-900 mb-6 flex items-center gap-2">
                 <div class="p-1.5 bg-blue-100 rounded-lg">
                    <Icon name="lucide:award" class="w-5 h-5 text-blue-600" />
                 </div>
                 Detail Hasil Ujian
              </DialogTitle>
              
              <div v-if="result" class="space-y-6">
                 <div class="bg-gray-50 p-5 rounded-2xl border border-gray-100 transition-all hover:bg-white hover:shadow-md group">
                    <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 leading-none">Informasi Peserta</p>
                    <p class="font-extrabold text-gray-900 group-hover:text-blue-600 transition-colors">{{ result.name }}</p>
                    <p class="text-xs text-gray-500 font-medium">ID Peserta: #{{ result.id }}</p>
                 </div>

                 <div class="grid grid-cols-2 gap-4">
                    <div class="bg-blue-50/50 p-4 rounded-2xl border border-blue-100/50">
                       <p class="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1 leading-none">Skor Akhir</p>
                       <p class="text-2xl font-black text-blue-700 tabular-nums">{{ result.score ?? '---' }}</p>
                    </div>
                    <div class="p-4 rounded-2xl border flex flex-col justify-center" :class="result.score >= 500 ? 'bg-emerald-50 border-emerald-100' : 'bg-rose-50 border-rose-100'">
                       <p class="text-[10px] font-bold uppercase tracking-widest mb-1 leading-none" :class="result.score >= 500 ? 'text-emerald-400' : 'text-rose-400'">Status</p>
                       <p v-if="result.score !== null" class="font-extrabold text-sm" :class="result.score >= 500 ? 'text-emerald-700' : 'text-rose-700'">
                          {{ result.score >= 500 ? 'Lulus' : 'Tidak Lulus' }}
                       </p>
                       <p v-else class="text-gray-400 font-bold text-sm italic">Pending</p>
                    </div>
                 </div>

                 <div class="space-y-3">
                    <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none px-1">Riwayat Pengerjaan</p>
                    <div class="bg-gray-50 rounded-2xl border border-gray-100 divide-y divide-gray-100 overflow-hidden">
                       <template v-if="result.attempts && result.attempts.length">
                          <div v-for="(attempt, i) in result.attempts" :key="i" class="px-5 py-3.5 flex items-center justify-between hover:bg-white transition-colors">
                             <span class="text-sm font-bold text-gray-600">Pengerjaan ke-{{ i + 1 }}</span>
                             <span class="text-sm font-black text-gray-900 tabular-nums">{{ attempt.score }}</span>
                          </div>
                       </template>
                       <div v-else class="px-5 py-8 text-center text-gray-400 italic text-sm">
                          Belum ada riwayat pengerjaan.
                       </div>
                    </div>
                 </div>

                 <div class="bg-amber-50 rounded-2xl p-4 border border-amber-100 flex gap-3">
                    <Icon name="lucide:info" class="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <p class="text-xs text-amber-800 font-medium leading-relaxed">
                       Sertifikat dapat diunduh oleh peserta setelah 7 hari kerja sejak hasil ujian diterbitkan.
                    </p>
                 </div>

                 <div class="mt-8 flex justify-end">
                    <button 
                      type="button" 
                      @click="closeModal"
                      class="px-6 py-2.5 rounded-xl bg-gray-900 text-white font-bold shadow-lg shadow-gray-200 transition-all transform active:scale-95 text-sm hover:bg-gray-800"
                    >
                       Tutup Detail
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
import { Dialog, DialogPanel, DialogTitle, TransitionRoot, TransitionChild } from '@headlessui/vue'

const props = defineProps({
  modelValue: Boolean,
  result: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(['update:modelValue']);

const closeModal = () => emit('update:modelValue', false);
</script>