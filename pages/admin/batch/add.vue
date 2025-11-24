<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <div class="container mx-auto px-6 py-10 flex-grow">
      
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-extrabold text-gray-800">Tambah Batch Ujian Baru 🚀</h1>
          <p class="text-gray-500 mt-1 text-base">Isi form di bawah ini dengan detail untuk membuat batch ujian baru</p>
        </div>
        <NuxtLink
          to="/admin/batch"
          class="inline-flex items-center text-gray-600 hover:text-green-600 transition-colors font-medium"
        >
          <Icon name="lucide:arrow-left" class="mr-2" size="18" />
          Kembali ke Daftar Batch
        </NuxtLink>
      </div>

      <div class="bg-green-50 border border-green-200 text-green-800 rounded-xl p-5 mb-8 shadow-sm">
        <div class="flex items-start space-x-3">
          <Icon name="lucide:info" class="mt-0.5 flex-shrink-0" size="20" />
          <div>
            <h4 class="font-bold text-green-800 mb-1 text-lg">Panduan Pengisian Form</h4>
            <ul class="text-sm space-y-1 list-disc list-inside">
              <li>Pastikan semua kolom bertanda <strong class="text-red-500">* Wajib Diisi</strong> terisi dengan benar.</li>
              <li>Format tanggal ujian yang digunakan adalah: <strong class="font-mono">YYYY-MM-DD</strong>.</li>
              <li><strong>ID Batch</strong> (e.g., BATCHXXXX) akan dibuat secara otomatis setelah Anda menyimpan data.</li>
            </ul>
          </div>
        </div>
      </div>

      <form
        @submit.prevent="handleSubmit"
        class="bg-white shadow-xl rounded-2xl p-8 border border-gray-100"
      >
        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
          
          <div class="space-y-6">
            <h3 class="text-xl font-semibold text-gray-700 border-b pb-2 mb-4">Detail Dasar Batch</h3>

            <div>
              <label for="namaBatch" class="block text-sm font-medium text-gray-700 mb-1">
                Nama Batch <span class="text-red-500">*</span>
              </label>
              <input
                id="namaBatch"
                type="text"
                v-model="formData.namaBatch"
                @input="clearError('namaBatch')"
                :class="{'border-red-500': errors.namaBatch}"
                class="w-full px-4 py-2 border rounded-lg focus:ring-green-500 focus:border-green-500 transition duration-150 shadow-sm"
                placeholder="Contoh: Ujian TOEFL Periode Juli 2025"
                required
              />
              <p v-if="errors.namaBatch" class="mt-1 text-sm text-red-600">{{ errors.namaBatch }}</p>
            </div>

            <div>
              <label for="deskripsiBatch" class="block text-sm font-medium text-gray-700 mb-1">
                Deskripsi Batch <span class="text-red-500">*</span>
              </label>
              <textarea
                id="deskripsiBatch"
                v-model="formData.deskripsiBatch"
                @input="clearError('deskripsiBatch')"
                :class="{'border-red-500': errors.deskripsiBatch}"
                class="w-full px-4 py-2 border rounded-lg focus:ring-green-500 focus:border-green-500 transition duration-150 shadow-sm h-24 resize-none"
                placeholder="Deskripsi singkat mengenai tujuan dan cakupan batch ujian..."
                required
              ></textarea>
              <p v-if="errors.deskripsiBatch" class="mt-1 text-sm text-red-600">{{ errors.deskripsiBatch }}</p>
            </div>

            <div>
              <label for="batasMaksimalPeserta" class="block text-sm font-medium text-gray-700 mb-1">
                Batas Maksimal Peserta
              </label>
              <input
                id="batasMaksimalPeserta"
                type="number"
                v-model="formData.batasMaksimalPeserta"
                min="1"
                class="w-full px-4 py-2 border rounded-lg focus:ring-green-500 focus:border-green-500 transition duration-150 shadow-sm"
                placeholder="Contoh: 50"
              />
            </div>
          </div>

          <div class="space-y-6">
            <h3 class="text-xl font-semibold text-gray-700 border-b pb-2 mb-4">Jadwal dan Konfigurasi</h3>

            <div>
              <label for="tanggalMulai" class="block text-sm font-medium text-gray-700 mb-1">
                Tanggal Mulai Ujian <span class="text-red-500">*</span>
              </label>
              <input
                id="tanggalMulai"
                type="date"
                v-model="formData.tanggalMulai"
                @input="clearError('tanggalMulai')"
                :class="{'border-red-500': errors.tanggalMulai}"
                class="w-full px-4 py-2 border rounded-lg focus:ring-green-500 focus:border-green-500 transition duration-150 shadow-sm"
                required
              />
              <p v-if="errors.tanggalMulai" class="mt-1 text-sm text-red-600">{{ errors.tanggalMulai }}</p>
            </div>

            <div>
              <label for="tanggalSelesai" class="block text-sm font-medium text-gray-700 mb-1">
                Tanggal Selesai Ujian <span class="text-red-500">*</span>
              </label>
              <input
                id="tanggalSelesai"
                type="date"
                v-model="formData.tanggalSelesai"
                @input="clearError('tanggalSelesai')"
                :class="{'border-red-500': errors.tanggalSelesai}"
                class="w-full px-4 py-2 border rounded-lg focus:ring-green-500 focus:border-green-500 transition duration-150 shadow-sm"
                required
              />
              <p v-if="errors.tanggalSelesai" class="mt-1 text-sm text-red-600">{{ errors.tanggalSelesai }}</p>
            </div>

            <div>
              <label for="statusBatch" class="block text-sm font-medium text-gray-700 mb-1">
                Status Batch <span class="text-red-500">*</span>
              </label>
              <select
                id="statusBatch"
                v-model="formData.statusBatch"
                @change="clearError('statusBatch')"
                :class="{'border-red-500': errors.statusBatch}"
                class="w-full px-4 py-2 border rounded-lg focus:ring-green-500 focus:border-green-500 transition duration-150 shadow-sm bg-white appearance-none"
                required
              >
                <option value="" disabled>-- Pilih Status --</option>
                <option value="aktif">Aktif (Pendaftaran Dibuka)</option>
                <option value="penuh">Penuh (Kuota Tercapai)</option>
                <option value="tutup">Tutup (Pendaftaran Ditutup)</option>
                <option value="selesai">Selesai (Ujian Sudah Berakhir)</option>
              </select>
              <p v-if="errors.statusBatch" class="mt-1 text-sm text-red-600">{{ errors.statusBatch }}</p>
            </div>
          </div>
        </div>

        <div class="mt-10 pt-6 border-t border-gray-100 space-y-6">
          <h3 class="text-xl font-semibold text-gray-700 border-b pb-2 mb-4">Informasi Tambahan</h3>

          <div>
            <label for="intruksiKhusus" class="block text-sm font-medium text-gray-700 mb-1">
              Instruksi Khusus
            </label>
            <textarea
              id="intruksiKhusus"
              v-model="formData.intruksiKhusus"
              class="w-full px-4 py-2 border rounded-lg focus:ring-green-500 focus:border-green-500 transition duration-150 shadow-sm h-32 resize-y"
              placeholder="• Pastikan perangkat Anda memiliki koneksi stabil.&#10;• Siapkan kartu identitas untuk verifikasi.&#10;• Instruksi lain yang perlu diketahui peserta..."
            ></textarea>
          </div>

          <div>
            <label for="materi_belajar" class="block text-sm font-medium text-gray-700 mb-1">
              Link Materi Belajar (Opsional)
            </label>
            <input
              id="materi_belajar"
              type="url"
              v-model="formData.materi_belajar"
              class="w-full px-4 py-2 border rounded-lg focus:ring-green-500 focus:border-green-500 transition duration-150 shadow-sm"
              placeholder="https://contoh.com/materi-belajar"
            />
          </div>
        </div>

        <div class="flex justify-end space-x-4 pt-8 border-t mt-8">
          <button
            type="button"
            @click="goBack"
            class="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 font-medium transition duration-150"
          >
            <Icon name="lucide:x" class="mr-2 inline" size="18" /> Batalkan
          </button>
          <button
            type="submit"
            :disabled="isLoading"
            class="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold flex items-center transition duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <Icon 
              :name="isLoading ? 'lucide:loader-2' : 'lucide:save'" 
              class="mr-2"
              :class="{ 'animate-spin': isLoading }"
              size="18"
            />
            {{ isLoading ? 'Menyimpan Data...' : 'Simpan Batch Baru' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { useBatchPost } from '@/composables/Batch/post'
import { useLoading } from '@/composables/Loading' // Asumsi composable ini ada
import { useNotificationPopup } from '@/composables/NotificationPopup' // Asumsi composable ini ada
// Asumsi penggunaan useNuxtApp untuk $toast
const { $toast } = useNuxtApp() 

const { startLoading, stopLoading } = useLoading()
const { showAlert } = useNotificationPopup()
definePageMeta({ 
  title: 'Tambah Batch - Admin Panel',
  layout: 'admin',
  middleware: ['auth', 'role-check'],
  roles: ['admin'],
})

const isLoading = ref(false)
const formData = reactive({
  namaBatch: '',
  deskripsiBatch: '',
  tanggalMulai: '',
  tanggalSelesai: '',
  batasMaksimalPeserta: '',
  statusBatch: '',
  intruksiKhusus: '',
  materi_belajar: ''
})
const errors = reactive({})

const clearError = field => delete errors[field]

const validateForm = () => {
  Object.keys(errors).forEach(k => delete errors[k])
  let isValid = true

  if (!formData.namaBatch.trim()) { errors.namaBatch = 'Nama batch wajib diisi'; isValid = false }
  if (!formData.deskripsiBatch.trim()) { errors.deskripsiBatch = 'Deskripsi wajib diisi'; isValid = false }
  if (!formData.tanggalMulai) { errors.tanggalMulai = 'Tanggal mulai wajib diisi'; isValid = false }
  if (!formData.tanggalSelesai) { errors.tanggalSelesai = 'Tanggal selesai wajib diisi'; isValid = false }
  if (!formData.statusBatch) { errors.statusBatch = 'Status wajib dipilih'; isValid = false }
  
  if (formData.tanggalMulai && formData.tanggalSelesai && formData.tanggalMulai > formData.tanggalSelesai) {
    errors.tanggalSelesai = 'Tanggal selesai harus setelah atau sama dengan tanggal mulai'; isValid = false
  }

  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) {
    showAlert('Periksa kembali form Anda. Ada kolom wajib yang belum terisi atau tidak valid.')
    return
  }
  
  isLoading.value = true
  startLoading()
  try {
    // Tambahkan validasi dan konversi untuk batasMaksimalPeserta
    const maxPeserta = formData.batasMaksimalPeserta ? parseInt(formData.batasMaksimalPeserta) : null
    
    // Logic pembuatan ID Batch
    const batchId = 'BATCH' + String(Math.floor(Math.random() * 9999)).padStart(4, '0')
    
    const finalData = { 
        ...formData, 
        idBatch: batchId,
        batasMaksimalPeserta: maxPeserta // Kirim sebagai number atau null
    }

    // Panggil API untuk menyimpan data
    await useBatchPost(finalData) 
    
    $toast.success(`Batch "${formData.namaBatch}" berhasil disimpan! ID: ${batchId}`)
    navigateTo('/admin/batch')
  } catch (err) {
    console.error('Error saat menyimpan batch:', err)
    showAlert('Gagal menyimpan batch. Silakan coba lagi.')
  } finally {
    stopLoading()
    isLoading.value = false
  }
}

const goBack = () => navigateTo('/admin/batch')
</script>