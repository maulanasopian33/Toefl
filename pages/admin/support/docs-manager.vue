<template>
  <div class="min-h-screen bg-[#F8FAFC] p-4 lg:p-8 space-y-6">

    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <div class="p-3 bg-violet-600 rounded-2xl shadow-lg shadow-violet-600/25">
          <Icon name="lucide:pencil-ruler" class="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 class="text-2xl font-black text-slate-900 tracking-tight">Kelola Panduan</h1>
          <p class="text-sm text-slate-500 font-medium mt-0.5">Buat dan kelola artikel panduan berbasis Markdown</p>
        </div>
      </div>
      <button
        @click="openModal(null)"
        class="inline-flex items-center gap-2 px-5 py-2.5 bg-violet-600 text-white font-black rounded-2xl shadow-lg shadow-violet-600/20 hover:bg-violet-700 hover:scale-105 active:scale-95 transition-all text-sm"
      >
        <Icon name="lucide:plus" class="w-4 h-4" />
        Artikel Baru
      </button>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <div v-for="stat in stats" :key="stat.label" class="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
        <div class="flex items-center justify-between">
          <p class="text-xs font-black text-slate-400 uppercase tracking-widest">{{ stat.label }}</p>
          <Icon :name="stat.icon" class="w-4 h-4 text-slate-300" />
        </div>
        <p class="text-2xl font-black text-slate-900 mt-2">{{ stat.value }}</p>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
      <!-- Table Header -->
      <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <h2 class="text-sm font-black text-slate-900">Daftar Artikel</h2>
          <span class="px-2.5 py-1 bg-violet-50 text-violet-700 text-[10px] font-black rounded-full">{{ allDocs.length }} total</span>
        </div>
        <div class="flex items-center gap-2">
          <!-- Category filter -->
          <select v-model="filterCategory" class="text-xs font-bold text-slate-600 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-violet-400">
            <option value="">Semua Kategori</option>
            <option v-for="cat in uniqueCategories" :key="cat" :value="cat">{{ cat }}</option>
          </select>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="isLoading" class="py-16 flex flex-col items-center justify-center gap-3 text-slate-400">
        <Icon name="lucide:loader-2" class="w-8 h-8 animate-spin" />
        <p class="text-sm font-bold">Memuat artikel...</p>
      </div>

      <!-- Empty -->
      <div v-else-if="filteredDocs.length === 0" class="py-16 flex flex-col items-center justify-center gap-4 text-slate-400">
        <Icon name="lucide:file-x" class="w-12 h-12" />
        <div class="text-center">
          <p class="text-sm font-black text-slate-600">Belum ada artikel</p>
          <p class="text-xs font-medium mt-1">Klik "Artikel Baru" untuk memulai.</p>
        </div>
      </div>

      <!-- Data Table -->
      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-slate-50">
              <th class="text-left text-[10px] font-black text-slate-400 uppercase tracking-widest px-6 py-3">Judul</th>
              <th class="text-left text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 py-3">Kategori</th>
              <th class="text-left text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 py-3">Urutan</th>
              <th class="text-left text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 py-3">Status</th>
              <th class="text-right text-[10px] font-black text-slate-400 uppercase tracking-widest px-6 py-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="doc in filteredDocs"
              :key="doc.id"
              class="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors group"
            >
              <td class="px-6 py-4">
                <div>
                  <p class="font-bold text-slate-800 text-sm group-hover:text-violet-700 transition-colors">{{ doc.title }}</p>
                  <p class="text-xs text-slate-400 font-mono mt-0.5">{{ doc.slug }}</p>
                </div>
              </td>
              <td class="px-4 py-4">
                <div class="flex items-center gap-1.5">
                  <Icon :name="doc.category_icon || 'lucide:tag'" class="w-3.5 h-3.5 text-slate-400" />
                  <span class="text-xs font-bold text-slate-600">{{ doc.category }}</span>
                </div>
              </td>
              <td class="px-4 py-4">
                <span class="text-xs font-black text-slate-500 w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center">{{ doc.order_num }}</span>
              </td>
              <td class="px-4 py-4">
                <span
                  class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black"
                  :class="doc.status ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'"
                >
                  <span class="w-1.5 h-1.5 rounded-full" :class="doc.status ? 'bg-emerald-500' : 'bg-slate-400'"></span>
                  {{ doc.status ? 'Aktif' : 'Draft' }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center justify-end gap-2">
                  <button
                    @click="openModal(doc)"
                    class="p-2 text-slate-400 hover:text-violet-600 hover:bg-violet-50 rounded-xl transition-colors"
                    title="Edit"
                  >
                    <Icon name="lucide:pencil" class="w-4 h-4" />
                  </button>
                  <button
                    @click="handleDelete(doc.id)"
                    class="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                    title="Hapus"
                  >
                    <Icon name="lucide:trash-2" class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ─── MODAL / EDITOR ─── -->
    <TransitionRoot as="template" :show="showModal">
      <Dialog as="div" class="relative z-[100]" @close="showModal = false">
        <TransitionChild
          as="template"
          enter="ease-out duration-200" enter-from="opacity-0" enter-to="opacity-100"
          leave="ease-in duration-150" leave-from="opacity-100" leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" />
        </TransitionChild>

        <div class="fixed inset-0 z-10 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4">
            <TransitionChild
              as="template"
              enter="ease-out duration-200" enter-from="opacity-0 scale-95" enter-to="opacity-100 scale-100"
              leave="ease-in duration-150" leave-from="opacity-100 scale-100" leave-to="opacity-0 scale-95"
            >
              <DialogPanel class="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden">
                <!-- Modal Header -->
                <div class="px-8 py-6 border-b border-slate-100 flex items-center justify-between flex-shrink-0">
                  <div class="flex items-center gap-4">
                    <div class="p-2.5 bg-violet-50 rounded-xl text-violet-600">
                      <Icon :name="editingDoc ? 'lucide:pencil' : 'lucide:file-plus-2'" class="w-5 h-5" />
                    </div>
                    <div>
                      <DialogTitle class="font-black text-slate-900">{{ editingDoc ? 'Edit Artikel' : 'Artikel Baru' }}</DialogTitle>
                      <p class="text-xs text-slate-400 font-bold mt-0.5">Tulis konten dengan format Markdown</p>
                    </div>
                  </div>
                  <button @click="showModal = false" class="p-2.5 rounded-2xl text-slate-400 hover:bg-slate-50 hover:text-slate-900 transition-all">
                    <Icon name="lucide:x" class="w-5 h-5" />
                  </button>
                </div>

                <!-- Modal Body -->
                <div class="flex-1 overflow-y-auto p-8 space-y-6">
                  <!-- Row 1: Title + Category + Icon + Order -->
                  <div class="grid grid-cols-2 gap-4">
                    <div class="col-span-2 space-y-2">
                      <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Judul Artikel *</label>
                      <input
                        v-model="form.title"
                        type="text"
                        placeholder="Contoh: Cara Membuat Batch Ujian"
                        class="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-900 outline-none focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 transition-all"
                      />
                    </div>
                    <div class="space-y-2">
                      <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Kategori</label>
                      <input
                        v-model="form.category"
                        type="text"
                        list="category-list"
                        placeholder="Contoh: Manajemen Batch"
                        class="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 transition-all"
                      />
                      <datalist id="category-list">
                        <option v-for="cat in uniqueCategories" :key="cat" :value="cat" />
                      </datalist>
                    </div>
                    <div class="grid grid-cols-2 gap-3">
                      <div class="space-y-2">
                        <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Icon (lucide:...)</label>
                        <input
                          v-model="form.category_icon"
                          type="text"
                          placeholder="lucide:book-open"
                          class="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-mono text-slate-700 outline-none focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 transition-all"
                        />
                      </div>
                      <div class="space-y-2">
                        <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Urutan</label>
                        <input
                          v-model.number="form.order_num"
                          type="number"
                          min="0"
                          class="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <!-- Markdown Editor + Preview -->
                  <div class="space-y-2">
                    <div class="flex items-center justify-between">
                      <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Konten (Markdown)</label>
                      <div class="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
                        <button
                          @click="editorMode = 'edit'"
                          class="px-3 py-1.5 text-[10px] font-black rounded-lg transition-all"
                          :class="editorMode === 'edit' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'"
                        >
                          <Icon name="lucide:code-2" class="w-3.5 h-3.5 inline mr-1" /> Editor
                        </button>
                        <button
                          @click="editorMode = 'preview'"
                          class="px-3 py-1.5 text-[10px] font-black rounded-lg transition-all"
                          :class="editorMode === 'preview' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'"
                        >
                          <Icon name="lucide:eye" class="w-3.5 h-3.5 inline mr-1" /> Preview
                        </button>
                        <button
                          @click="editorMode = 'split'"
                          class="px-3 py-1.5 text-[10px] font-black rounded-lg transition-all"
                          :class="editorMode === 'split' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'"
                        >
                          <Icon name="lucide:columns-2" class="w-3.5 h-3.5 inline mr-1" /> Split
                        </button>
                      </div>
                    </div>
                    <div class="border border-slate-200 rounded-2xl overflow-hidden" style="height: 420px;">
                      <div class="flex h-full">
                        <!-- Editor -->
                        <div v-show="editorMode !== 'preview'" :class="editorMode === 'split' ? 'w-1/2 border-r border-slate-200' : 'w-full'">
                          <textarea
                            v-model="form.content_md"
                            placeholder="# Judul&#10;&#10;Tulis panduan Anda di sini dengan format **Markdown**..."
                            class="w-full h-full p-5 text-sm font-mono text-slate-700 bg-slate-50 resize-none outline-none leading-relaxed"
                          ></textarea>
                        </div>
                        <!-- Preview -->
                        <div
                          v-show="editorMode !== 'edit'"
                          :class="editorMode === 'split' ? 'w-1/2' : 'w-full'"
                          class="overflow-y-auto p-5 prose prose-sm prose-slate max-w-none prose-headings:font-black prose-code:bg-slate-100 prose-code:text-violet-700 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded"
                          v-html="modalRenderedContent"
                        ></div>
                      </div>
                    </div>
                    <!-- Markdown Cheatsheet -->
                    <div class="flex flex-wrap gap-2 mt-2">
                      <span v-for="hint in markdownHints" :key="hint.label" class="text-[10px] font-mono text-slate-400 bg-slate-50 border border-slate-100 px-2 py-1 rounded-lg">{{ hint.label }}</span>
                    </div>
                  </div>

                  <!-- Status -->
                  <div class="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div>
                      <p class="text-sm font-bold text-slate-700">Status Artikel</p>
                      <p class="text-xs text-slate-400 font-medium">Draft tidak akan ditampilkan ke pengguna</p>
                    </div>
                    <Switch
                      v-model="form.status"
                      :class="form.status ? 'bg-emerald-500' : 'bg-slate-300'"
                      class="relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200"
                    >
                      <span aria-hidden="true" :class="form.status ? 'translate-x-5' : 'translate-x-0'" class="pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200" />
                    </Switch>
                  </div>
                </div>

                <!-- Modal Footer -->
                <div class="px-8 py-5 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end gap-3 flex-shrink-0">
                  <button @click="showModal = false" class="px-5 py-2.5 rounded-2xl text-sm font-bold text-slate-500 hover:bg-white hover:text-slate-900 transition-all border border-transparent hover:border-slate-200">
                    Batal
                  </button>
                  <button
                    @click="handleSave"
                    :disabled="!isFormValid || isSaving"
                    class="inline-flex items-center gap-2 px-7 py-2.5 bg-violet-600 text-white font-black rounded-2xl shadow-lg shadow-violet-600/20 hover:bg-violet-700 hover:scale-105 active:scale-95 transition-all text-sm disabled:opacity-50 disabled:pointer-events-none"
                  >
                    <Icon v-if="isSaving" name="lucide:loader-2" class="w-4 h-4 animate-spin" />
                    <Icon v-else name="lucide:check" class="w-4 h-4" />
                    {{ isSaving ? 'Menyimpan...' : editingDoc ? 'Perbarui Artikel' : 'Simpan Artikel' }}
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot, Switch } from '@headlessui/vue'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import type { Doc } from '@/composables/useDocs'

definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'role-check'],
  permission: 'system.app'
})

const { allDocs, isLoading, isSaving, fetchAllDocs, createDoc, updateDoc, deleteDoc } = useDocs()

// ─── State ───
const showModal = ref(false)
const editingDoc = ref<Doc | null>(null)
const editorMode = ref<'edit' | 'preview' | 'split'>('split')
const filterCategory = ref('')

const defaultForm = () => ({
  title: '',
  category: 'Umum',
  category_icon: 'lucide:book-open',
  content_md: '',
  order_num: 0,
  status: true
})
const form = reactive(defaultForm())

// ─── Computed ───
const uniqueCategories = computed(() =>
  [...new Set(allDocs.value.map(d => d.category))].sort()
)

const filteredDocs = computed(() => {
  if (!filterCategory.value) return allDocs.value
  return allDocs.value.filter(d => d.category === filterCategory.value)
})

const stats = computed(() => [
  { label: 'Total Artikel', value: allDocs.value.length, icon: 'lucide:files' },
  { label: 'Aktif', value: allDocs.value.filter(d => d.status).length, icon: 'lucide:check-circle' },
  { label: 'Draft', value: allDocs.value.filter(d => !d.status).length, icon: 'lucide:file-clock' },
  { label: 'Kategori', value: uniqueCategories.value.length, icon: 'lucide:folder' }
])

const isFormValid = computed(() => form.title.trim().length > 0)

const modalRenderedContent = computed(() => {
  if (!form.content_md) return '<p class="text-slate-400">Preview akan muncul di sini...</p>'
  const raw = marked.parse(form.content_md) as string
  if (typeof window !== 'undefined') return DOMPurify.sanitize(raw)
  return raw
})

const markdownHints = [
  { label: '# H1' }, { label: '## H2' }, { label: '**bold**' },
  { label: '*italic*' }, { label: '`code`' }, { label: '```block```' },
  { label: '- list' }, { label: '> quote' }, { label: '[text](url)' }
]

// ─── Methods ───
const openModal = (doc: Doc | null) => {
  editingDoc.value = doc
  if (doc) {
    Object.assign(form, {
      title: doc.title,
      category: doc.category,
      category_icon: doc.category_icon,
      content_md: doc.content_md || '',
      order_num: doc.order_num,
      status: doc.status
    })
  } else {
    Object.assign(form, defaultForm())
  }
  showModal.value = true
}

const handleSave = async () => {
  if (!isFormValid.value) return
  const payload = { ...form }
  if (editingDoc.value) {
    await updateDoc(editingDoc.value.id, payload)
  } else {
    await createDoc(payload)
  }
  showModal.value = false
}

const handleDelete = async (id: number) => {
  await deleteDoc(id)
}

onMounted(async () => {
  await fetchAllDocs()
})
</script>
