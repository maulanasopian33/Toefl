<template>
  <div v-if="totalPages > 1" class="flex flex-col items-center justify-between gap-3 border-t border-slate-100 px-4 py-3 text-xs text-slate-500 sm:flex-row sm:px-5">
    <div class="flex items-center gap-2">
      <span>Halaman</span>
      <span class="font-semibold text-slate-800">{{ currentPage }}</span>
      <span>dari</span>
      <span class="font-semibold text-slate-800">{{ totalPages || 1 }}</span>
    </div>

    <div class="flex items-center gap-1.5">
      <button
        type="button"
        class="rounded-xl border border-slate-200 px-3 py-1.5 font-medium text-slate-600 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
        :disabled="currentPage === 1"
        @click="emit('update:currentPage', Math.max(1, currentPage - 1))"
      >
        Sebelumnya
      </button>
      <button
        v-for="p in pagesToShow"
        :key="p"
        type="button"
        class="min-w-[2.25rem] rounded-xl px-2 py-1.5 text-center text-xs font-semibold"
        :class="p === currentPage ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'"
        @click="emit('update:currentPage', p)"
      >
        {{ p }}
      </button>
      <button
        type="button"
        class="rounded-xl border border-slate-200 px-3 py-1.5 font-medium text-slate-600 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
        :disabled="currentPage === totalPages || totalPages === 0"
        @click="emit('update:currentPage', Math.min(totalPages, currentPage + 1))"
      >
        Berikutnya
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  currentPage: number
  totalPages: number
}>()

const emit = defineEmits(['update:currentPage'])

const pagesToShow = computed(() => {
  const total = props.totalPages
  const page = props.currentPage
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1)
  if (page <= 3) return [1, 2, 3, 4, 5]
  if (page >= total - 2) return [total - 4, total - 3, total - 2, total - 1, total]
  return [page - 2, page - 1, page, page + 1, page + 2]
})
</script>