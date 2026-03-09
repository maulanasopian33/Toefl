<template>
  <article class="w-full">
    <!-- Article Header -->
    <div class="mb-8 pb-6 border-b border-slate-100">
      <div v-if="showCategory" class="flex items-center gap-2 text-xs text-slate-400 font-bold uppercase tracking-wider mb-3">
        <Icon name="lucide:folder-open" class="w-3.5 h-3.5" />
        {{ doc.category }}
      </div>
      <div class="flex items-center justify-between gap-4">
        <h1 class="text-3xl font-black text-slate-900 tracking-tight leading-tight">{{ doc.title }}</h1>
        <slot name="header-actions"></slot>
      </div>
      <p class="text-sm text-slate-400 font-medium mt-2">
        Diperbarui {{ formatDate(doc.updatedAt) }}
      </p>
    </div>

    <!-- Markdown Rendered Content -->
    <div
      class="prose prose-slate max-w-none prose-headings:font-black prose-h1:text-2xl prose-h2:text-xl prose-h2:border-b prose-h2:border-slate-100 prose-h2:pb-2 prose-code:bg-slate-100 prose-code:text-emerald-700 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-pre:bg-slate-900 prose-a:text-emerald-600"
      v-html="renderedContent"
    ></div>

    <!-- Footer nav -->
    <div v-if="showFooter" class="mt-12 pt-6 border-t border-slate-100 flex justify-between items-center">
      <p class="text-xs text-slate-400 font-medium">Apakah halaman ini membantu?</p>
      <div class="flex gap-2">
        <button class="px-4 py-2 text-xs font-bold bg-slate-50 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl transition-colors border border-transparent hover:border-emerald-200">👍 Ya</button>
        <button class="px-4 py-2 text-xs font-bold bg-slate-50 hover:bg-rose-50 hover:text-rose-700 rounded-xl transition-colors border border-transparent hover:border-rose-200">👎 Tidak</button>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import type { Doc } from '@/composables/useDocs'

const props = withDefaults(defineProps<{
  doc: Doc;
  showCategory?: boolean;
  showFooter?: boolean;
}>(), {
  showCategory: true,
  showFooter: true
})

const renderedContent = computed(() => {
  if (!props.doc?.content_md) return '<p class="text-slate-400">Artikel ini belum memiliki konten.</p>'
  const raw = marked.parse(props.doc.content_md) as string
  if (typeof window !== 'undefined') {
    return DOMPurify.sanitize(raw)
  }
  return raw
})

const formatDate = (dateStr?: string) => {
  if (!dateStr) return '-'
  return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(dateStr))
}
</script>
