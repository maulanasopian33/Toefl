<template>
  <div class="min-h-screen bg-[#F8FAFC]">

    <!-- Page Header -->
    <div class="px-6 lg:px-10 py-8 border-b border-slate-100 bg-white">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div class="p-3 bg-emerald-600 rounded-2xl shadow-lg shadow-emerald-600/25">
            <Icon name="lucide:book-open" class="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 class="text-2xl font-black text-slate-900 tracking-tight">Panduan Penggunaan</h1>
            <p class="text-sm text-slate-500 font-medium mt-0.5">Temukan jawaban dan panduan penggunaan platform</p>
          </div>
        </div>
        <!-- Search -->
        <div class="hidden md:flex items-center gap-2 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl w-72">
          <Icon name="lucide:search" class="w-4 h-4 text-slate-400 flex-shrink-0" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari panduan..."
            class="bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none w-full font-medium"
          />
        </div>
      </div>
    </div>

    <div class="flex h-[calc(100vh-129px)]">
      <!-- ───── Sidebar Navigation ───── -->
      <aside class="hidden lg:flex flex-col w-72 xl:w-80 border-r border-slate-100 bg-white overflow-y-auto shrink-0">
        <div class="p-5 space-y-1">
          <!-- Loading skeleton -->
          <template v-if="isLoading && categories.length === 0">
            <div v-for="i in 4" :key="i" class="space-y-2 mb-4">
              <div class="h-4 bg-slate-100 rounded-lg w-3/4 animate-pulse"></div>
              <div v-for="j in 3" :key="j" class="h-9 bg-slate-50 rounded-xl animate-pulse ml-2"></div>
            </div>
          </template>

          <div v-for="cat in filteredCategories" :key="cat.category" class="mb-4">
            <!-- Category Header -->
            <div class="flex items-center gap-2.5 px-3 py-2 mb-1">
              <Icon :name="cat.icon" class="w-4 h-4 text-emerald-600" />
              <span class="text-[10px] font-black text-slate-500 uppercase tracking-widest">{{ cat.category }}</span>
            </div>
            <!-- Articles -->
            <button
              v-for="article in cat.articles"
              :key="article.slug"
              @click="openArticle(article.slug)"
              class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left group mb-0.5"
              :class="activeDoc?.slug === article.slug
                ? 'bg-emerald-50 text-emerald-700'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'"
            >
              <Icon
                name="lucide:file-text"
                class="w-4 h-4 flex-shrink-0 transition-colors"
                :class="activeDoc?.slug === article.slug ? 'text-emerald-500' : 'text-slate-300 group-hover:text-slate-500'"
              />
              <span class="text-sm font-semibold truncate">{{ article.title }}</span>
            </button>
          </div>

          <!-- Empty State -->
          <div v-if="!isLoading && filteredCategories.length === 0" class="text-center py-12">
            <Icon name="lucide:search-x" class="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p class="text-xs text-slate-400 font-bold">Tidak ditemukan</p>
          </div>
        </div>
      </aside>

      <!-- ───── Article Content ───── -->
      <main class="flex-1 overflow-y-auto">
        <!-- Welcome Screen -->
        <div v-if="!activeDoc && !isLoadingDoc" class="h-full flex flex-col items-center justify-center text-center px-8">
          <div class="max-w-md space-y-5">
            <div class="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center mx-auto">
              <Icon name="lucide:book-open-check" class="w-10 h-10 text-emerald-500" />
            </div>
            <div>
              <h2 class="text-2xl font-black text-slate-900">Selamat Datang di Panduan</h2>
              <p class="text-slate-500 font-medium text-sm mt-2 leading-relaxed">
                Pilih salah satu panduan dari daftar di sebelah kiri untuk memulai.
              </p>
            </div>
            <div class="flex flex-wrap justify-center gap-2">
              <button
                v-for="cat in categories.slice(0, 3)"
                :key="cat.category"
                @click="cat.articles[0] && openArticle(cat.articles[0].slug)"
                class="px-4 py-2 text-xs font-bold bg-white border border-slate-200 rounded-xl hover:border-emerald-300 hover:text-emerald-700 hover:bg-emerald-50 transition-all"
              >
                <Icon :name="cat.icon" class="w-3.5 h-3.5 inline mr-1.5" />
                {{ cat.category }}
              </button>
            </div>
          </div>
        </div>

        <!-- Doc Loading Skeleton -->
        <div v-else-if="isLoadingDoc" class="max-w-3xl mx-auto px-8 py-10 space-y-6">
          <div class="h-8 bg-slate-100 rounded-xl w-2/3 animate-pulse"></div>
          <div class="h-4 bg-slate-100 rounded w-1/3 animate-pulse"></div>
          <div class="space-y-3 mt-8">
            <div v-for="i in 12" :key="i" class="h-4 bg-slate-50 rounded animate-pulse" :style="{ width: `${60 + Math.random() * 40}%` }"></div>
          </div>
        </div>

        <!-- Article Content -->
        <div v-else-if="activeDoc" class="max-w-3xl mx-auto px-8 py-10">
          <AdminSupportDocReaderContent :doc="activeDoc">
            <template #header-actions>
              <button
                @click="openInPopup(activeDoc)"
                class="hidden sm:flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-xl text-xs font-black transition-all active:scale-95"
                title="Buka di Jendela Mengambang"
              >
                <Icon name="lucide:external-link" class="w-4 h-4" />
                Pop-out
              </button>
            </template>
          </AdminSupportDocReaderContent>
        </div>
      </main>

      <!-- ───── Right Sidebar ───── -->
      <aside class="hidden xl:flex flex-col w-64 border-l border-slate-100 bg-white shrink-0 overflow-y-auto">
        <div class="p-6 space-y-6">
          <!-- Support Card -->
          <div class="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-2xl p-5 text-white">
            <Icon name="lucide:headphones" class="w-8 h-8 mb-3 opacity-80" />
            <h3 class="font-black text-sm mb-1">Butuh Bantuan Lebih?</h3>
            <p class="text-indigo-100 text-xs leading-relaxed mb-3">Hubungi tim support kami.</p>
            <NuxtLink to="/admin/support/contact" class="inline-flex items-center gap-1.5 bg-white text-indigo-600 px-4 py-2 rounded-xl font-black text-xs hover:bg-slate-50 transition-all">
              Hubungi <Icon name="lucide:arrow-right" class="w-3.5 h-3.5" />
            </NuxtLink>
          </div>

          <!-- Quick Links -->
          <div>
            <h3 class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Pintasan Cepat</h3>
            <div class="space-y-1">
              <NuxtLink
                v-for="link in shortcuts"
                :key="link.href"
                :to="link.href"
                class="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
              >
                <div class="p-1.5 rounded-lg bg-slate-50 group-hover:bg-white transition-colors">
                  <Icon :name="link.icon" class="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
                </div>
                <span class="text-xs font-bold text-slate-600 group-hover:text-slate-900">{{ link.name }}</span>
              </NuxtLink>
            </div>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useDocPopupStore } from '@/stores/useDocPopupStore'
import type { Doc } from '@/composables/useDocs'

definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'role-check'],
  permission: 'system.app'
})

const { categories, activeDoc, isLoading, fetchPublishedDocs, fetchDocBySlug } = useDocs()
const { openDoc } = useDocPopupStore()

const searchQuery = ref('')
const isLoadingDoc = ref(false)

// Filtered categories based on search
const filteredCategories = computed(() => {
  if (!searchQuery.value.trim()) return categories.value
  const q = searchQuery.value.toLowerCase()
  return categories.value
    .map(cat => ({
      ...cat,
      articles: cat.articles.filter(a => a.title.toLowerCase().includes(q))
    }))
    .filter(cat => cat.articles.length > 0 || cat.category.toLowerCase().includes(q))
})


const openArticle = async (slug: string) => {
  isLoadingDoc.value = true
  await fetchDocBySlug(slug)
  isLoadingDoc.value = false
}

const openInPopup = (doc: any) => {
  openDoc(doc)
}

const formatDate = (dateStr?: string) => {
  if (!dateStr) return '-'
  return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(dateStr))
}

const shortcuts = [
  { name: 'Tambah Batch Baru', href: '/admin/batch/add', icon: 'lucide:plus-circle' },
  { name: 'Lihat Transaksi', href: '/admin/payments', icon: 'lucide:credit-card' },
  { name: 'Audit Log System', href: '/admin/audit-logs', icon: 'lucide:shield-check' },
  { name: 'Kelola Panduan', href: '/admin/support/docs-manager', icon: 'lucide:pencil-ruler' }
]

onMounted(async () => {
  await fetchPublishedDocs()
})
</script>
