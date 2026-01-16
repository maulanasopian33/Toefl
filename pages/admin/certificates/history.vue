<template>
  <div class="min-h-screen bg-gray-50/50 p-6 lg:p-10">
    <div class="max-w-7xl mx-auto space-y-8">
      
      <!-- Header Section -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
            <div class="p-2 bg-blue-100 rounded-lg">
               <Icon name="heroicons:clock" class="w-8 h-8 text-blue-600" />
            </div>
            Riwayat Sertifikat
          </h1>
          <p class="text-gray-500 mt-2 text-lg">Daftar semua sertifikat yang telah diterbitkan sistem.</p>
        </div>
        <NuxtLink
          to="/admin/certificates/generate"
          class="group flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 font-medium"
        >
          <Icon name="heroicons:plus-circle" class="w-5 h-5 group-hover:scale-110 transition-transform" />
          Generate Baru
        </NuxtLink>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5 ring-1 ring-gray-900/5">
          <div class="p-4 bg-blue-50 rounded-xl text-blue-600">
            <Icon name="heroicons:document-text" class="w-8 h-8" />
          </div>
          <div>
            <p class="text-sm text-gray-500 uppercase tracking-wider font-semibold">Total Sertifikat</p>
            <p class="text-3xl font-extrabold text-gray-900 mt-1">{{ totalItems }}</p>
          </div>
        </div>
      </div>

      <!-- Main Content Card -->
      <div class="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden ring-1 ring-gray-900/5">
        
        <!-- Table Section -->
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
               <!-- Loading State -->
               <tr v-if="isLoading" v-for="i in 5" :key="i">
                  <td colspan="6" class="px-6 py-4">
                     <div class="h-8 bg-gray-100 rounded animate-pulse"></div>
                  </td>
               </tr>

               <!-- Empty State -->
               <tr v-else-if="certificates.length === 0">
                  <td colspan="6" class="px-6 py-16 text-center text-gray-500">
                     <div class="flex flex-col items-center">
                        <Icon name="heroicons:document-magnifying-glass" class="w-12 h-12 mb-2 text-gray-300" />
                        <p class="font-medium">Belum ada data sertifikat.</p>
                     </div>
                  </td>
               </tr>

               <!-- Data Rows -->
               <tr 
                 v-for="cert in certificates" 
                 :key="cert.id" 
                 class="group hover:bg-gray-50 transition-colors"
               >
                 <td class="px-6 py-4">
                   <div class="font-mono text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded w-fit">
                     {{ cert.certificateNumber }}
                   </div>
                 </td>
                 <td class="px-6 py-4">
                   <div class="flex flex-col">
                     <span class="font-bold text-gray-900 group-hover:text-blue-700 transition-colors">{{ cert.name }}</span>
                     <span class="text-xs text-gray-400 mt-0.5">{{ cert.user?.email || 'User ID: ' + cert.userId }}</span>
                   </div>
                 </td>
                 <td class="px-6 py-4">
                    <span class="text-sm text-gray-600 font-medium">{{ cert.event }}</span>
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
                 <td class="px-6 py-4 text-center">
                    <div class="flex justify-center gap-2">
                       <a
                          v-if="cert.pdfUrl"
                          :href="cert.pdfUrl"
                          target="_blank"
                          class="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200"
                          title="Download PDF"
                       >
                          <Icon name="heroicons:arrow-down-tray" class="w-5 h-5" />
                       </a>
                       <a
                          v-if="cert.verifyUrl"
                          :href="cert.verifyUrl"
                          target="_blank"
                          class="p-2 text-gray-500 bg-gray-50 hover:bg-gray-100 hover:text-gray-700 rounded-lg transition-colors border border-gray-200"
                          title="Lihat Halaman Verifikasi"
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
        <div v-if="totalPages > 1" class="p-6 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
           <div class="text-sm text-gray-500">
              Menampilkan <span class="font-bold text-gray-800">{{ certificates.length }}</span> dari <span class="font-bold text-gray-800">{{ totalItems }}</span> sertifikat
           </div>
           <div class="flex gap-2">
              <button
                 :disabled="currentPage === 1"
                 @click="fetchCertificates(currentPage - 1)"
                 class="px-4 py-2 text-sm bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm font-medium"
              >
                 Previous
              </button>
              <button
                 :disabled="currentPage === totalPages"
                 @click="fetchCertificates(currentPage + 1)"
                 class="px-4 py-2 text-sm bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm font-medium"
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
