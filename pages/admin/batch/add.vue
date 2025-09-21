<template>
  <div class="flex-1 p-4">

      <!-- Page Title -->
      <h1 class="text-3xl font-bold text-gray-800 mb-6">Tambah Batch Ujian Baru</h1>

      <!-- Info Card -->
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div class="flex items-start space-x-3">
          <Icon name="lucide:alert-circle" class="text-blue-500 mt-0.5" size="20" />
          <div>
            <h4 class="font-semibold text-blue-800 mb-2">Informasi Penting</h4>
            <ul class="text-blue-700 text-sm space-y-1">
              <li>• Pastikan semua data telah diisi dengan benar sebelum menyimpan</li>
              <li>• Tanggal ujian harus dalam format yang benar (YYYY-MM-DD)</li>
              <li>• ID Batch akan dibuat otomatis setelah penyimpanan</li>
              <li>• Peserta dapat mendaftar setelah batch aktif</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Form -->
      <div class="bg-white rounded-xl shadow-sm p-8">
        <div class="space-y-6">
          <!-- Nama Batch -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              Nama Batch <span class="text-red-500">*</span>
            </label>
            <input
              v-model="formData.namaBatch"
              type="text"
              name="namaBatch"
              class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
              :class="[
                errors.namaBatch ? 'border-red-500' : 'border-gray-300'
              ]"
              placeholder="Contoh: Ujian TOEFL Periode Juli 2025"
              @input="clearError('namaBatch')"
            />
            <p v-if="errors.namaBatch" class="mt-1 text-sm text-red-500">
              {{ errors.namaBatch }}
            </p>
          </div>

          <!-- Deskripsi Batch -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              Deskripsi Batch <span class="text-red-500">*</span>
            </label>
            <textarea
              v-model="formData.deskripsiBatch	"
              name="deskripsiBatch	"
              rows="4"
              class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors resize-y"
              :class="[
                errors.deskripsiBatch	 ? 'border-red-500' : 'border-gray-300'
              ]"
              placeholder="Batch ujian TOEFL ini dirancang untuk menguji kemampuan Bahasa Inggris Anda secara komprehensif, mencakup Reading, Listening, Speaking, dan Writing. Peserta diharapkan telah mempersiapkan diri dengan baik."
              @input="clearError('deskripsiBatch	')"
            />
            <p v-if="errors.deskripsiBatch	" class="mt-1 text-sm text-red-500">
              {{ errors.deskripsiBatch	 }}
            </p>
          </div>

          <!-- Tanggal -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                <Icon name="lucide:calendar" class="inline mr-1" size="16" />
                Tanggal Mulai Ujian <span class="text-red-500">*</span>
              </label>
              <input
                v-model="formData.tanggalMulai"
                type="date"
                name="tanggalMulai"
                class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                :class="[
                  errors.tanggalMulai ? 'border-red-500' : 'border-gray-300'
                ]"
                @change="clearError('tanggalMulai')"
              />
              <p v-if="errors.tanggalMulai" class="mt-1 text-sm text-red-500">
                {{ errors.tanggalMulai }}
              </p>
            </div>
            
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                <Icon name="lucide:calendar" class="inline mr-1" size="16" />
                Tanggal Selesai Ujian <span class="text-red-500">*</span>
              </label>
              <input
                v-model="formData.tanggalSelesai"
                type="date"
                name="tanggalSelesai"
                class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                :class="[
                  errors.tanggalSelesai ? 'border-red-500' : 'border-gray-300'
                ]"
                @change="clearError('tanggalSelesai')"
              />
              <p v-if="errors.tanggalSelesai" class="mt-1 text-sm text-red-500">
                {{ errors.tanggalSelesai }}
              </p>
            </div>
          </div>

          <!-- Batas Peserta & Status -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                <Icon name="lucide:users" class="inline mr-1" size="16" />
                Batas Maksimal Peserta
              </label>
              <input
                v-model="formData.batasMaksimalPeserta"
                type="number"
                name="batasMaksimalPeserta"
                min="1"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                placeholder="Contoh: 50"
              />
            </div>
            
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                Status Batch <span class="text-red-500">*</span>
              </label>
              <select
                v-model="formData.statusBatch	"
                name="statusBatch	"
                class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                :class="[
                  errors.statusBatch	 ? 'border-red-500' : 'border-gray-300'
                ]"
                @change="clearError('statusBatch	')"
              >
                <option value="">Pilih Status</option>
                <option value="aktif">Aktif (Terbuka untuk pendaftaran)</option>
                <option value="penuh">Penuh</option>
                <option value="tutup">Tutup</option>
                <option value="selesai">Selesai</option>
              </select>
              <p v-if="errors.statusBatch	" class="mt-1 text-sm text-red-500">
                {{ errors.statusBatch	 }}
              </p>
            </div>
          </div>

          <!-- Instruksi Khusus -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              Instruksi Khusus
            </label>
            <textarea
              v-model="formData.intruksiKhusus	"
              name="intruksiKhusus	"
              rows="4"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors resize-y"
              placeholder="• Pastikan perangkat Anda memiliki baterai yang cukup dan koneksi internet stabil selama ujian.&#10;• Baca setiap instruksi pertanyaan dengan cermat sebelum menjawab.&#10;• Dilarang menggunakan bantuan pihak ketiga atau sumber daya eksternal selama ujian.&#10;• Jika mengalami masalah teknis, segera hubungi dukungan teknis."
            />
          </div>

          <!-- Materi Belajar -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              Link Materi Belajar (Opsional)
            </label>
            <input
              v-model="formData.materi_belajar"
              type="url"
              name="materi_belajar"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
              placeholder="https://example.com/materi-belajar"
            />
          </div>

          <!-- Form Actions -->
          <div class="flex justify-start space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              @click="goBack"
              class="inline-flex items-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors font-medium"
            >
              <Icon name="lucide:x" class="mr-2" size="18" />
              Batal
            </button>
            <button
              type="button"
              @click="handleSubmit"
              :disabled="isLoading"
              class="inline-flex items-center px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Icon 
                :name="isLoading ? 'lucide:loader-2' : 'lucide:save'" 
                class="mr-2 animate-spin" 
                :class="{ 'animate-spin': isLoading }"
                size="18" 
              />
              {{ isLoading ? 'Menyimpan...' : 'Simpan Batch' }}
            </button>
          </div>
        </div>
      </div>
    </div>
</template>

<script setup>
import { useBatchPost } from '@/composables/Batch/post'
const { startLoading, stopLoading } = useLoading()
const { showAlert, showConfirm } = useNotificationPopup();
// Define page meta
definePageMeta({
  title: 'Tambah Batch - Admin Panel',
  layout: 'admin'
})

// Reactive data
const isLoading = ref(false)
stopLoading();
startLoading();

setTimeout(() => {
  stopLoading();
}, 1000);
// Form data with default values
const formData = reactive({
  namaBatch: '',
  deskripsiBatch	: '',
  tanggalMulai: new Date().toISOString().split('T')[0],
  tanggalSelesai: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  batasMaksimalPeserta: '',
  statusBatch	: '',
  intruksiKhusus	: '',
  materi_belajar: ''
})

// Form errors
const errors = reactive({})

// Methods
const clearError = (field) => {
  if (errors[field]) {
    delete errors[field]
  }
}

const validateForm = () => {
  // Clear previous errors
  Object.keys(errors).forEach(key => delete errors[key])
  
  const newErrors = {}
  
  if (!formData.namaBatch.trim()) {
    newErrors.namaBatch = 'Nama batch wajib diisi'
  }
  
  if (!formData.deskripsiBatch	.trim()) {
    newErrors.deskripsiBatch	 = 'Deskripsi batch wajib diisi'
  }
  
  if (!formData.tanggalMulai) {
    newErrors.tanggalMulai = 'Tanggal mulai wajib diisi'
  }
  
  if (!formData.tanggalSelesai) {
    newErrors.tanggalSelesai = 'Tanggal selesai wajib diisi'
  }
  
  if (!formData.statusBatch	) {
    newErrors.statusBatch	 = 'Status batch wajib dipilih'
  }
  
  if (formData.tanggalMulai && formData.tanggalSelesai) {
    const startDate = new Date(formData.tanggalMulai)
    const endDate = new Date(formData.tanggalSelesai)
    
    if (startDate >= endDate) {
      newErrors.tanggalSelesai = 'Tanggal selesai harus lebih dari tanggal mulai'
    }
    
    if (startDate < new Date().setHours(0,0,0,0)) {
      newErrors.tanggalMulai = 'Tanggal mulai tidak boleh kurang dari hari ini'
    }
  }
  
  // Assign errors
  Object.assign(errors, newErrors)
  
  return Object.keys(newErrors).length === 0
}

const handleSubmit = async () => {
  if (!validateForm()) {
    // Show notification for validation errors
    showAlert('Periksa kembali form Anda.')
    return
  }
  
  isLoading.value = true
  startLoading();
  
  try {
    // Generate batch ID
    const batchId = 'BATCH' + String(Math.floor(Math.random() * 9000) + 1000).padStart(3, '0')
    const finalData = { ...formData, idBatch : batchId }
    
    // Simulate API call
    const { data, pending, error } = await useBatchPost(finalData)

    if (error.value) {
      throw error.value
    }
    
    console.log('Data batch yang akan disimpan:', finalData)
    
    // Show success notification
    await $toast.success(`Batch "${formData.namaBatch}" berhasil dibuat dengan ID: ${batchId}`)
    
    // Reset form
    resetForm()
    
    // Redirect to batch list after successful creation
    await navigateTo('/admin/batch')
  } catch (error) {
    stopLoading();
    console.error('Error creating batch:', error)
    await showAlert('Terjadi kesalahan saat membuat batch.')
  } finally {
    stopLoading();
    isLoading.value = false
  }
}

const resetForm = () => {
  Object.assign(formData, {
    namaBatch: '',
    deskripsiBatch	: '',
    tanggalMulai: new Date().toISOString().split('T')[0],
    tanggalSelesai: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    batasMaksimalPeserta: '',
    statusBatch	: '',
    intruksiKhusus	: '',
    materi_belajar: ''
  })
  
  // Clear errors
  Object.keys(errors).forEach(key => delete errors[key])
}

const goBack = () => {
  navigateTo('/admin/batch')
}
</script>

<style scoped>
/* Additional custom styles if needed */
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>