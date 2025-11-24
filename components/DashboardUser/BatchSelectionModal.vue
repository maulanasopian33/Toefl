<template>
  <div v-if="isOpen" class="relative z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <!-- Overlay -->
    <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity ease-out duration-300" :class="{'opacity-100': isOpen, 'opacity-0': !isOpen}"></div>

    <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
      <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <!-- Modal Panel -->
        <div class="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-xl transition-all ease-out duration-300 sm:my-8 sm:w-full sm:max-w-2xl"
             :class="{
               'opacity-100 translate-y-0 sm:scale-100': isOpen,
               'opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95': !isOpen
             }">
          <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                <Icon name="lucide:calendar-check" class="h-6 w-6 text-green-600" aria-hidden="true" />
              </div>
              <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                <h3 class="text-lg font-semibold leading-6 text-gray-900" id="modal-title">Batch Tes Anda</h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">Berikut adalah daftar batch yang telah Anda ikuti. Pilih salah satu untuk memulai tes.</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Daftar Batch -->
          <div class="border-t border-gray-200 px-4 py-5 sm:p-6">
            <div v-if="isLoading" class="text-center text-gray-500">
              <Icon name="lucide:loader-2" class="mx-auto h-8 w-8 animate-spin" />
              <p class="mt-2 text-sm">Memuat batch yang tersedia...</p>
            </div>
            <div v-else-if="error" class="text-center text-red-500 text-sm">
              Gagal memuat data batch. Coba lagi nanti.
            </div>
            <div v-else-if="!batches || batches.length === 0" class="text-center text-gray-500 text-sm">
              <Icon name="lucide:calendar-off" class="mx-auto h-8 w-8" />
              <p class="mt-2">Anda belum terdaftar di batch manapun.</p>
            </div>
            <ul v-else role="list" class="space-y-3">
              <li v-for="batch in batches" :key="batch.id" class="overflow-hidden rounded-xl border border-gray-200 bg-white hover:border-green-500 transition-colors duration-200">
                <div class="flex items-center justify-between gap-x-6 p-4">
                  <div class="min-w-0">
                    <p class="font-semibold text-gray-900">{{ batch.namaBatch }}</p>
                    <p class="mt-1 text-xs leading-5 text-gray-500">
                      {{ formatDate(batch.tanggalMulai) }} - {{ formatDate(batch.tanggalSelesai) }}
                    </p>
                  </div>
                  <div class="flex flex-none items-center gap-x-4">
                    <span class="text-sm font-semibold text-gray-800">{{ formatCurrency(batch.price) }}</span>
                    <button @click="startTest(batch.idBatch)" class="rounded-md bg-green-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600">
                      Mulai Tes
                    </button>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          
          <div class="bg-gray-50 px-4 py-3 sm:flex sm:justify-between sm:items-center sm:px-6 border-t">
            <button type="button" @click="openRegistrationModal" class="w-full sm:w-auto inline-flex justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 mb-2 sm:mb-0">
              Join Batch Lain
            </button>
            <button type="button" class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto" @click="closeModal">Tutup</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue' // Tambahkan watch
import type { Batch } from '@/composables/useActiveBatches'

const props = defineProps<{
  modelValue: boolean,
  batches: Batch[],
  isLoading: boolean,
  error: Error | null
}>()

const emit = defineEmits(['update:modelValue', 'start-test', 'open-registration'])

const isOpen = ref(props.modelValue)

watch(() => props.modelValue, (newValue) => {
  isOpen.value = newValue
})

const closeModal = () => {
  emit('update:modelValue', false)
}

const startTest = (batchId: string) => {
  emit('start-test', batchId)
}

const openRegistrationModal = () => {
  emit('open-registration')
}

const formatDate = (isoString: string) => {
  if (!isoString) return '-'
  return new Date(isoString).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

const formatCurrency = (value: number) => {
  if (value === 0) return 'Gratis'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value)
}
</script>