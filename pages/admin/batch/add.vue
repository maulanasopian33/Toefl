<template>
  <div class="min-h-screen flex flex-col bg-slate-50">
    <div class="container mx-auto px-4 sm:px-6 py-8 flex-grow max-w-5xl">
      
      <!-- Header -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">Buat Batch Baru</h1>
          <p class="text-gray-500 mt-1">Lengkapi formulir di bawah untuk membuat program batch baru.</p>
        </div>
        <NuxtLink
          to="/admin/batch"
          class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
        >
          <Icon name="lucide:arrow-left" class="mr-2 w-4 h-4" />
          Kembali
        </NuxtLink>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-8">
        
        <!-- Informasi Utama -->
        <div class="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
            <h3 class="text-lg font-semibold text-gray-800">Informasi Utama</h3>
          </div>
          <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">Nama Batch <span class="text-red-500">*</span></label>
              <input v-model="formData.name" type="text" class="form-input w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500" placeholder="Contoh: TOEFL Intensive Batch 1" required />
            </div>
            
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
              <textarea v-model="formData.description" rows="3" class="form-textarea w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500" placeholder="Deskripsi program..."></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Tipe Program <span class="text-red-500">*</span></label>
              <select v-model="formData.type" class="form-select w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500" required>
                <option value="">Pilih Tipe</option>
                <option value="FULL_PACKAGE">Full Package</option>
                <option value="PREP_CLASS">Preparation Class</option>
                <option value="TRYOUT_ONLY">Tryout Only</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Status <span class="text-red-500">*</span></label>
              <select v-model="formData.status" class="form-select w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500" required>
                <option value="DRAFT">Draft</option>
                <option value="OPEN">Open (Dibuka)</option>
                <option value="CLOSED">Closed (Ditutup)</option>
                <option value="FULL">Full (Penuh)</option>
                <option value="COMPLETED">Completed (Selesai)</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Jadwal & Pendaftaran -->
        <div class="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
            <h3 class="text-lg font-semibold text-gray-800">Jadwal & Pendaftaran</h3>
          </div>
          <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Tanggal Mulai Program <span class="text-red-500">*</span></label>
              <input v-model="formData.start_date" type="date" class="form-input w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500" required />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Tanggal Selesai Program <span class="text-red-500">*</span></label>
              <input v-model="formData.end_date" type="date" class="form-input w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500" required />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Pendaftaran Dibuka</label>
              <input v-model="formData.registration_open_at" type="datetime-local" class="form-input w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Pendaftaran Ditutup</label>
              <input v-model="formData.registration_close_at" type="datetime-local" class="form-input w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500" />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Total Durasi (Menit)</label>
              <input v-model="formData.duration_minutes" type="number" class="form-input w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500" placeholder="Contoh: 2400" />
            </div>
          </div>
        </div>

        <!-- Kapasitas & Harga -->
        <div class="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
            <h3 class="text-lg font-semibold text-gray-800">Kapasitas & Harga</h3>
          </div>
          <div class="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Min. Peserta</label>
              <input v-model="formData.min_participants" type="number" class="form-input w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500" placeholder="0" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Max. Peserta</label>
              <input v-model="formData.max_participants" type="number" class="form-input w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500" placeholder="0" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Harga (IDR) <span class="text-red-500">*</span></label>
              <div class="relative rounded-md shadow-sm">
                <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span class="text-gray-500 sm:text-sm">Rp</span>
                </div>
                <input v-model="formData.price" type="number" class="form-input w-full rounded-lg border-gray-300 pl-10 focus:border-blue-500 focus:ring-blue-500" placeholder="0" required />
              </div>
            </div>
          </div>
        </div>

        <!-- Instruksi Khusus -->
        <div class="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
            <h3 class="text-lg font-semibold text-gray-800">Instruksi Tambahan</h3>
          </div>
          <div class="p-6">
            <textarea v-model="formData.special_instructions" rows="4" class="form-textarea w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500" placeholder="Instruksi khusus untuk peserta..."></textarea>
          </div>
        </div>

        <!-- Sesi (Sessions) -->
        <div class="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
            <h3 class="text-lg font-semibold text-gray-800">Sesi Pertemuan</h3>
            <button type="button" @click="addSession" class="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
              <Icon name="lucide:plus-circle" class="w-4 h-4" /> Tambah Sesi
            </button>
          </div>
          <div class="p-6 space-y-4">
            <div v-if="formData.sessions.length === 0" class="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              Belum ada sesi yang ditambahkan.
            </div>
            
            <div v-for="(session, index) in formData.sessions" :key="index" class="bg-gray-50 rounded-lg border border-gray-200 p-4 relative group">
              <button type="button" @click="removeSession(index)" class="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors">
                <Icon name="lucide:trash-2" class="w-4 h-4" />
              </button>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pr-8">
                <div class="md:col-span-2">
                  <label class="block text-xs font-medium text-gray-500 uppercase mb-1">Judul Sesi</label>
                  <input v-model="session.title" type="text" class="form-input w-full text-sm rounded-md border-gray-300" placeholder="Judul Sesi" />
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-500 uppercase mb-1">Tipe</label>
                  <select v-model="session.session_type" class="form-select w-full text-sm rounded-md border-gray-300">
                    <option value="CLASS">Class</option>
                    <option value="TRYOUT">Tryout</option>
                    <option value="CONSULTATION">Consultation</option>
                  </select>
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-500 uppercase mb-1">Meeting URL</label>
                  <input v-model="session.meeting_url" type="url" class="form-input w-full text-sm rounded-md border-gray-300" placeholder="https://..." />
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-500 uppercase mb-1">Mulai</label>
                  <input v-model="session.start_at" type="datetime-local" class="form-input w-full text-sm rounded-md border-gray-300" />
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-500 uppercase mb-1">Selesai</label>
                  <input v-model="session.end_at" type="datetime-local" class="form-input w-full text-sm rounded-md border-gray-300" />
                </div>
                <div class="md:col-span-2">
                  <label class="block text-xs font-medium text-gray-500 uppercase mb-1">Catatan</label>
                  <input v-model="session.notes" type="text" class="form-input w-full text-sm rounded-md border-gray-300" placeholder="Catatan tambahan..." />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-end gap-4 pt-4">
          <button type="button" @click="goBack" class="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-all">
            Batal
          </button>
          <button type="submit" :disabled="isLoading" class="inline-flex items-center px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed">
            <Icon v-if="isLoading" name="lucide:loader-2" class="w-4 h-4 mr-2 animate-spin" />
            {{ isLoading ? 'Menyimpan...' : 'Simpan Batch' }}
          </button>
        </div>

      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useBatchPost } from '@/composables/Batch/post'
import { useLoading } from '@/composables/Loading'
import { useNotificationPopup } from '@/composables/NotificationPopup'

const { $toast } = useNuxtApp() 
const { startLoading, stopLoading } = useLoading()
const { showAlert } = useNotificationPopup()

definePageMeta({ 
  title: 'Tambah Batch - Admin Panel',
  layout: 'admin',
  middleware: ['auth', 'role-check'],
  permission: "batch.create"
})

const isLoading = ref(false)

interface Session {
  title: string;
  session_type: string;
  start_at: string;
  end_at: string;
  meeting_url: string;
  capacity: number;
  notes: string;
}

const formData = reactive({
  name: '',
  description: '',
  type: 'FULL_PACKAGE',
  start_date: '',
  end_date: '',
  registration_open_at: '',
  registration_close_at: '',
  max_participants: null as number | null,
  min_participants: null as number | null,
  status: 'OPEN',
  price: 0,
  currency: 'IDR',
  duration_minutes: null as number | null,
  special_instructions: '',
  sessions: [] as Session[]
})

const addSession = () => {
  formData.sessions.push({
    title: '',
    session_type: 'CLASS',
    start_at: '',
    end_at: '',
    meeting_url: '',
    capacity: formData.max_participants || 20,
    notes: ''
  })
}

const removeSession = (index: number) => {
  formData.sessions.splice(index, 1)
}

const validateForm = () => {
  if (!formData.name.trim()) return { valid: false, message: 'Nama batch wajib diisi' }
  if (!formData.type) return { valid: false, message: 'Tipe program wajib dipilih' }
  if (!formData.start_date) return { valid: false, message: 'Tanggal mulai wajib diisi' }
  if (!formData.end_date) return { valid: false, message: 'Tanggal selesai wajib diisi' }
  if (formData.price < 0) return { valid: false, message: 'Harga tidak boleh negatif' }
  
  if (formData.start_date > formData.end_date) {
    return { valid: false, message: 'Tanggal selesai harus setelah tanggal mulai' }
  }

  return { valid: true }
}

const handleSubmit = async () => {
  const validation = validateForm()
  if (!validation.valid) {
    showAlert(validation.message || 'Form tidak valid')
    return
  }
  
  isLoading.value = true
  startLoading()
  
  try {
    // Prepare payload
    const payload = {
      ...formData,
      // Ensure numbers are numbers
      max_participants: formData.max_participants ? Number(formData.max_participants) : null,
      min_participants: formData.min_participants ? Number(formData.min_participants) : null,
      price: Number(formData.price),
      duration_minutes: formData.duration_minutes ? Number(formData.duration_minutes) : null,
      // Convert empty strings to null for optional dates
      registration_open_at: formData.registration_open_at || null,
      registration_close_at: formData.registration_close_at || null,
      // Format sessions if needed (e.g. ensure dates are ISO)
      sessions: formData.sessions.map(s => ({
        ...s,
        start_at: s.start_at ? new Date(s.start_at).toISOString() : null,
        end_at: s.end_at ? new Date(s.end_at).toISOString() : null,
        capacity: s.capacity ? Number(s.capacity) : null
      }))
    }

    await useBatchPost(payload)
    
    showAlert(`Batch "${formData.name}" berhasil dibuat!`)
    navigateTo('/admin/batch')
  } catch (err: any) {
    console.error('Error saat menyimpan batch:', err)
    showAlert(err.message || 'Gagal membuat batch. Silakan coba lagi.')
  } finally {
    stopLoading()
    isLoading.value = false
  }
}

const goBack = () => navigateTo('/admin/batch')
</script>