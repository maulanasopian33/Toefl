<template>
  <Transition name="modal-fade">
    <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-60" @click.self="closeModal">
      <Transition name="modal-scale">
        <div v-if="modelValue && result" class="relative transform overflow-hidden rounded-2xl bg-gray-50 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
          <div class="bg-white px-6 pt-5 pb-6">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                <Icon name="lucide:award" class="h-6 w-6 text-blue-600" aria-hidden="true" />
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 class="text-lg font-semibold leading-6 text-gray-900">Detail Hasil Ujian</h3>
                <p class="text-sm text-gray-500">
                  <span class="font-medium">{{ result.name }}</span> - ID Peserta: #{{ result.id }}
                </p>

                <div class="mt-5 space-y-4 border-t pt-4">
                  <!-- Informasi Skor -->
                  <div>
                    <p class="text-xs font-medium text-gray-500 uppercase">Skor</p>
                    <p class="font-semibold text-gray-800 text-xl">{{ result.score ?? 'Belum Mengerjakan' }}</p>
                  </div>

                  <!-- Status Kelulusan -->
                  <div>
                    <p class="text-xs font-medium text-gray-500 uppercase">Status Kelulusan</p>
                    <span v-if="result.score !== null" :class="passStatusClass(result.score)" class="px-3 py-1 text-xs rounded-full font-semibold">
                      {{ result.score >= 500 ? 'Lulus' : 'Tidak Lulus' }}
                    </span>
                    <span v-else class="text-gray-400 italic text-xs">Belum Mengerjakan</span>
                  </div>

                  <!-- Riwayat Pengerjaan -->
                  <div>
                    <p class="text-xs font-medium text-gray-500 uppercase">Riwayat Pengerjaan</p>
                    <ul class="space-y-2">
                      <li v-for="(attempt, i) in result.attempts" :key="i" class="flex items-center justify-between text-sm">
                        <span>Pengerjaan ke-{{ i + 1 }}</span>
                        <span class="font-semibold">{{ attempt.score }}</span>
                      </li>
                      <li v-if="!result.attempts || !result.attempts.length" class="text-gray-400 italic text-sm">
                        Belum ada riwayat pengerjaan.
                      </li>
                    </ul>
                  </div>

                  <!-- Informasi Tambahan (Dummy) -->
                  <div class="text-sm">
                    <p class="text-xs font-medium text-gray-500 uppercase">Informasi Tambahan</p>
                    <p class="text-gray-600">
                      Sertifikat dapat diunduh setelah 7 hari kerja.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-100 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 rounded-b-2xl">
            <button
              type="button"
              class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
              @click="closeModal"
            >
              Tutup
            </button>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  modelValue: Boolean,
  result: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(['update:modelValue']);

const closeModal = () => emit('update:modelValue', false);

const passStatusClass = (score) => {
  if (score >= 500) return 'bg-green-100 text-green-800';
  return 'bg-red-100 text-red-800';
};
</script>

<style scoped>
/* Animasi Modal */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-scale-enter-active {
  transition: all 0.3s ease-out;
}
.modal-scale-leave-active {
  transition: all 0.2s ease-in;
}
.modal-scale-enter-from,
.modal-scale-leave-to {
  opacity: 0;
  transform: translateY(1rem) scale(0.95);
}
</style>