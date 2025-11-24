<template>
  <div v-if="modelValue" class="relative z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <!-- Overlay -->
    <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

    <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
      <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <!-- Modal Panel -->
        <div class="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl">
          <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                <Icon name="lucide:plus-circle" class="h-6 w-6 text-blue-600" aria-hidden="true" />
              </div>
              <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                <h3 class="text-lg font-semibold leading-6 text-gray-900" id="modal-title">Join Batch Baru</h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">Pilih batch yang ingin Anda ikuti untuk memulai pendaftaran.</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Daftar Batch Publik -->
          <div class="border-t border-gray-200 px-4 py-5 sm:p-6">
            <div v-if="isLoading" class="text-center text-gray-500">
              <Icon name="lucide:loader-2" class="mx-auto h-8 w-8 animate-spin" />
              <p class="mt-2 text-sm">Memuat batch yang tersedia...</p>
            </div>
            <div v-else-if="error" class="text-center text-red-500 text-sm">
              Gagal memuat data batch. Coba lagi nanti.
            </div>
            <div v-else-if="batches.length === 0" class="text-center text-gray-500 text-sm">
              <Icon name="lucide:calendar-off" class="mx-auto h-8 w-8" />
              <p class="mt-2">Saat ini belum ada batch tes baru yang dibuka.</p>
            </div>
            <ul v-else role="list" class="space-y-3">
              <li v-for="batch in batches" :key="batch.id" class="overflow-hidden rounded-xl border border-gray-200 bg-white hover:border-blue-500 transition-colors duration-200">
                <div class="flex items-center justify-between gap-x-6 p-4">
                  <div class="min-w-0">
                    <p class="font-semibold text-gray-900">{{ batch.namaBatch }}</p>
                    <p class="mt-1 text-xs leading-5 text-gray-500">
                      {{ formatDate(batch.tanggalMulai) }} - {{ formatDate(batch.tanggalSelesai) }}
                    </p>
                  </div>
                  <div class="flex flex-none items-center gap-x-4">
                    <span class="text-sm font-semibold text-gray-800">{{ formatCurrency(batch.price) }}</span>
                    <button @click="joinBatch(batch.idBatch)" class="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
                      Join Batch
                    </button>
                  </div>
                </div>
              </li>
            </ul>
          </div>

          <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button type="button" class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto" @click="$emit('update:modelValue', false)">Tutup</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Batch } from '@/composables/useActiveBatches'

defineProps<{
  modelValue: boolean,
  batches: Batch[],
  isLoading: boolean,
  error: Error | null
}>()

const emit = defineEmits(['update:modelValue', 'join-batch'])

const joinBatch = (batchId: string) => {
  emit('join-batch', batchId)
}

const formatDate = (isoString: string) => {
  if (!isoString) return '-'
  return new Date(isoString).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}

const formatCurrency = (value: number) => {
  if (value === 0) return 'Gratis'
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value)
}
</script>