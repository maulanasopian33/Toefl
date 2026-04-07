<template>
  <div class="min-h-screen bg-gray-50/50 p-6 lg:p-10">
    <div class="max-w-7xl mx-auto space-y-8">

      <!-- Header -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
            <div class="p-2 bg-indigo-100 rounded-lg">
              <Icon name="heroicons:document-text" class="w-8 h-8 text-indigo-600" />
            </div>
            Riwayat Sertifikat
          </h1>
          <p class="text-gray-500 mt-2">Daftar semua sertifikat PDF yang telah diterbitkan sistem.</p>
        </div>
        <NuxtLink
          to="/admin/certificates/generate"
          class="group flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 font-medium"
        >
          <Icon name="heroicons:plus-circle" class="w-5 h-5 group-hover:scale-110 transition-transform" />
          Generate Baru
        </NuxtLink>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 ring-1 ring-gray-900/5">
          <div class="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <Icon name="heroicons:document-text" class="w-6 h-6" />
          </div>
          <div>
            <p class="text-sm text-gray-500 font-semibold">Total Sertifikat</p>
            <p class="text-2xl font-extrabold text-gray-900">{{ totalItems }}</p>
          </div>
        </div>
      </div>

      <!-- Main Table Card -->
      <div class="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden ring-1 ring-gray-900/5">

        <!-- Toolbar -->
        <div class="p-5 border-b border-gray-100 bg-gray-50/30 flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
          <!-- Search -->
          <div class="relative w-full sm:w-72 group">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icon name="heroicons:magnifying-glass" class="w-5 h-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
            </div>
            <input
              v-model="searchQuery"
              @input="handleSearch"
              type="text"
              placeholder="Cari nama / nomor sertifikat..."
              class="pl-10 pr-4 py-2.5 w-full bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none shadow-sm"
            />
          </div>
          <!-- Refresh -->
          <button
            @click="loadCertificates()"
            class="flex items-center justify-center w-10 h-10 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-indigo-600 transition-colors"
            title="Refresh"
          >
            <Icon name="heroicons:arrow-path" class="w-5 h-5" :class="{ 'animate-spin': isLoading }" />
          </button>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto relative">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-gray-50/50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                <th class="px-6 py-4">No. Sertifikat</th>
                <th class="px-6 py-4">Peserta</th>
                <th class="px-6 py-4">Event / Batch</th>
                <th class="px-6 py-4">Skor</th>
                <th class="px-6 py-4">Tanggal</th>
                <th class="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">

              <!-- Loading -->
              <tr v-if="isLoading" v-for="i in 5" :key="i">
                <td colspan="6" class="px-6 py-4">
                  <div class="h-8 bg-gray-100 rounded-xl animate-pulse" />
                </td>
              </tr>

              <!-- Empty -->
              <tr v-else-if="filteredCertificates.length === 0">
                <td colspan="6" class="px-6 py-16 text-center text-gray-500">
                  <div class="flex flex-col items-center gap-2">
                    <Icon name="heroicons:document-magnifying-glass" class="w-14 h-14 text-gray-200" />
                    <p class="font-semibold text-gray-400">
                      {{ searchQuery ? 'Hasil tidak ditemukan untuk pencarian ini.' : 'Belum ada data sertifikat.' }}
                    </p>
                  </div>
                </td>
              </tr>

              <!-- Data Rows -->
              <tr
                v-for="cert in filteredCertificates"
                :key="cert.id"
                class="group hover:bg-indigo-50/30 transition-colors"
              >
                <td class="px-6 py-4">
                  <div class="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-1.5 rounded-xl w-fit">
                    {{ cert.certificateNumber }}
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="flex flex-col">
                    <span class="font-bold text-gray-900 group-hover:text-indigo-700 transition-colors">{{ cert.name }}</span>
                    <span class="text-xs text-gray-400 mt-0.5">{{ cert.user?.email || 'User: ' + cert.userId }}</span>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <span class="text-sm text-gray-600 font-medium">{{ cert.event || '-' }}</span>
                </td>
                <td class="px-6 py-4">
                  <span class="inline-flex items-center justify-center px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-bold border border-indigo-100 min-w-[3rem]">
                    {{ cert.score }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-center gap-2 text-sm text-gray-500">
                    <Icon name="heroicons:calendar" class="w-4 h-4 text-gray-400" />
                    {{ formatDate(cert.date) }}
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="flex justify-center gap-2">
                    <!-- Download PDF -->
                    <button
                      v-if="cert.pdfUrl"
                      @click="handleDownload(cert)"
                      class="p-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors border border-indigo-200"
                      title="Download PDF"
                    >
                      <Icon name="heroicons:arrow-down-tray" class="w-4 h-4" />
                    </button>
                    <!-- Verifikasi QR -->
                    <a
                      v-if="cert.verifyUrl"
                      :href="cert.verifyUrl"
                      target="_blank"
                      class="p-2 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors border border-emerald-200"
                      title="Lihat Halaman Verifikasi"
                    >
                      <Icon name="heroicons:qr-code" class="w-4 h-4" />
                    </a>
                    <!-- Hapus -->
                    <button
                      @click="handleDelete(cert)"
                      class="p-2 text-rose-500 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors border border-rose-200 opacity-60 group-hover:opacity-100"
                      title="Hapus Sertifikat"
                    >
                      <Icon name="heroicons:trash" class="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="p-5 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
          <div class="text-sm text-gray-500">
            Halaman <span class="font-bold text-gray-800">{{ currentPage }}</span> dari <span class="font-bold text-gray-800">{{ totalPages }}</span>
            &nbsp;·&nbsp; Total <span class="font-bold text-gray-800">{{ totalItems }}</span> sertifikat
          </div>
          <div class="flex gap-2">
            <button
              :disabled="currentPage === 1"
              @click="loadCertificates(currentPage - 1)"
              class="px-4 py-2 text-sm bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm font-medium"
            >
              Previous
            </button>
            <button
              :disabled="currentPage === totalPages"
              @click="loadCertificates(currentPage + 1)"
              class="px-4 py-2 text-sm bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm font-medium"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useCertificates, type Certificate } from '@/composables/useCertificates'
import { useNotificationPopup } from '@/composables/NotificationPopup'

definePageMeta({
  title: 'Riwayat Sertifikat - Admin Panel',
  layout: 'admin',
  middleware: ['auth', 'role-check'],
  permission: 'batch.read'
})

const {
  certificates,
  isLoading,
  totalItems,
  totalPages,
  currentPage,
  fetchCertificates,
  downloadCertificate,
  deleteCertificate
} = useCertificates()

const { showConfirm } = useNotificationPopup()

const searchQuery = ref('')

// ── Debounce Search ──────────────────────────────────────────────────────────

let searchTimer: ReturnType<typeof setTimeout>
const handleSearch = () => {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => loadCertificates(), 400)
}

// ── Filtered (client-side untuk data yang sudah ada di page ini) ───────────

const filteredCertificates = computed<Certificate[]>(() => {
  if (!searchQuery.value.trim()) return certificates.value
  const q = searchQuery.value.toLowerCase()
  return certificates.value.filter(
    c =>
      c.name?.toLowerCase().includes(q) ||
      c.certificateNumber?.toLowerCase().includes(q) ||
      c.event?.toLowerCase().includes(q)
  )
})

// ── Load Data ─────────────────────────────────────────────────────────────────

const loadCertificates = (page = 1) => {
  fetchCertificates(page, 10, {
    search: searchQuery.value || undefined
  })
}

// ── Format Helpers ────────────────────────────────────────────────────────────

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric'
  })
}

// ── Actions ───────────────────────────────────────────────────────────────────

const handleDownload = (cert: Certificate) => {
  downloadCertificate(cert)
}

const handleDelete = async (cert: Certificate) => {
  const confirmed = await showConfirm(
    `Hapus sertifikat "${cert.certificateNumber}" milik ${cert.name}? File PDF akan ikut terhapus.`,
    {
      title: 'Hapus Sertifikat?',
      type: 'danger',
      confirmText: 'Ya, Hapus'
    }
  )
  if (!confirmed) return
  await deleteCertificate(cert.id)
}

onMounted(() => loadCertificates())
</script>
