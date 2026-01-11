<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Riwayat Sertifikat</h1>
        <p class="text-gray-600">Daftar semua sertifikat yang telah digenerate.</p>
      </div>
      <NuxtLink
        to="/admin/certificates/generate"
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-200 flex items-center gap-2"
      >
        <Icon name="heroicons:plus-circle" class="w-5 h-5" />
        Generate Sertifikat
      </NuxtLink>
    </div>

    <!-- Filters & Stats (Optional) -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
        <div class="p-3 bg-blue-50 rounded-lg text-blue-600">
          <Icon name="heroicons:document-text" class="w-6 h-6" />
        </div>
        <div>
          <p class="text-sm text-gray-500 uppercase tracking-wider font-semibold">Total Sertifikat</p>
          <p class="text-2xl font-bold">{{ totalItems }}</p>
        </div>
      </div>
    </div>

    <!-- Table Section -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-gray-50 border-b border-gray-100">
              <th class="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">No. Sertifikat</th>
              <th class="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">Nama Peserta</th>
              <th class="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">Event</th>
              <th class="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">Skor</th>
              <th class="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">Tanggal</th>
              <th class="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-if="isLoading" v-for="i in 5" :key="i" class="animate-pulse">
              <td v-for="j in 6" :key="j" class="px-6 py-4">
                <div class="h-4 bg-gray-200 rounded w-full"></div>
              </td>
            </tr>
            <tr v-else-if="certificates.length === 0">
              <td colspan="6" class="px-6 py-10 text-center text-gray-500">
                <div class="flex flex-col items-center">
                  <Icon name="heroicons:document-magnifying-glass" class="w-12 h-12 mb-2 text-gray-300" />
                  Belum ada data sertifikat.
                </div>
              </td>
            </tr>
            <tr v-for="cert in certificates" :key="cert.id" class="hover:bg-gray-50 transition duration-150">
              <td class="px-6 py-4">
                <div class="font-medium text-blue-600">{{ cert.certificateNumber }}</div>
              </td>
              <td class="px-6 py-4">
                <div class="text-gray-800 font-medium">{{ cert.name }}</div>
                <div class="text-xs text-gray-500">{{ cert.user?.email || 'N/A' }}</div>
              </td>
              <td class="px-6 py-4 text-gray-600">{{ cert.event }}</td>
              <td class="px-6 py-4">
                <span class="px-2 py-1 bg-green-50 text-green-700 rounded text-sm font-bold">{{ cert.score }}</span>
              </td>
              <td class="px-6 py-4 text-gray-600">{{ formatDate(cert.date) }}</td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                  <a
                    v-if="cert.pdfUrl"
                    :href="cert.pdfUrl"
                    target="_blank"
                    class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Download PDF"
                  >
                    <Icon name="heroicons:arrow-down-tray" class="w-5 h-5" />
                  </a>
                  <a
                    v-if="cert.verifyUrl"
                    :href="cert.verifyUrl"
                    target="_blank"
                    class="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                    title="Verify Link"
                  >
                    <Icon name="heroicons:link" class="w-5 h-5" />
                  </a>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
        <div class="text-sm text-gray-600">
          Menampilkan <span class="font-medium">{{ certificates.length }}</span> dari <span class="font-medium">{{ totalItems }}</span> data
        </div>
        <div class="flex gap-2">
          <button
            :disabled="currentPage === 1"
            @click="fetchCertificates(currentPage - 1)"
            class="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            :disabled="currentPage === totalPages"
            @click="fetchCertificates(currentPage + 1)"
            class="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCertificates } from '@/composables/useCertificates'
import { onMounted } from 'vue'
definePageMeta({
  title: 'History Certificate - Admin Panel',
  layout: 'admin',
  middleware: ['auth', 'role-check'],
  permission: "batch.read" // Adjust permission key
})
const {
  certificates,
  isLoading,
  totalItems,
  totalPages,
  currentPage,
  fetchCertificates
} = useCertificates()

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

onMounted(() => {
  fetchCertificates()
})
</script>
