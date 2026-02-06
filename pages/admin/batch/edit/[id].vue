<template>
  <div class="min-h-screen flex flex-col bg-slate-50">
    <div class="container mx-auto px-4 sm:px-6 py-8 flex-grow max-w-5xl space-y-8">
      
      <!-- Header -->
      <header
        class="flex flex-col gap-4 rounded-3xl bg-white px-8 py-6 border border-gray-100 shadow-xl ring-1 ring-gray-900/5 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 class="text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
            <div class="p-2 bg-blue-100 rounded-xl">
              <Icon name="lucide:pencil" class="w-6 h-6 text-blue-600" />
            </div>
            Edit Batch
          </h1>
          <p class="mt-2 text-sm text-gray-500 font-medium">
            Perbarui informasi, jadwal, dan sesi untuk batch ini.
          </p>
        </div>

        <NuxtLink
          to="/admin/batch"
          class="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all shadow-sm"
        >
          <Icon name="lucide:arrow-left" class="w-4 h-4" />
          Kembali
        </NuxtLink>
      </header>

      <!-- Loading State -->
      <div v-if="isLoading && !formData.name" class="flex justify-center py-12">
         <Icon name="lucide:loader-2" class="w-8 h-8 text-blue-600 animate-spin" />
      </div>

      <form v-else @submit.prevent="handleSubmit" class="space-y-8">
        
        <!-- Informasi Utama -->
        <section class="bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden ring-1 ring-gray-900/5">
          <div class="px-8 py-5 border-b border-gray-50 bg-gray-50/50">
            <h2 class="text-base font-extrabold text-gray-900 tracking-tight">Informasi Utama</h2>
          </div>
          <div class="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="md:col-span-2 space-y-2">
              <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Nama Batch <span class="text-rose-500">*</span></label>
              <input v-model="formData.name" type="text" class="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-gray-700 text-sm" placeholder="Contoh: TOEFL Intensive Batch 1" required />
            </div>
            
            <div class="md:col-span-2 space-y-2">
              <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Deskripsi</label>
              <textarea v-model="formData.description" rows="3" class="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium text-gray-700 text-sm" placeholder="Deskripsi program..."></textarea>
            </div>

            <div class="space-y-2">
              <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Tipe Program <span class="text-rose-500">*</span></label>
              <select v-model="formData.type" class="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-gray-700 text-sm cursor-pointer" required>
                <option value="">Pilih Tipe</option>
                <option value="FULL_PACKAGE">Full Package</option>
                <option value="PREP_CLASS">Preparation Class</option>
                <option value="TRYOUT_ONLY">Tryout Only</option>
              </select>
            </div>

            <div class="space-y-2">
              <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Status <span class="text-rose-500">*</span></label>
              <select v-model="formData.status" class="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-gray-700 text-sm cursor-pointer" required>
                <option value="DRAFT">Draft</option>
                <option value="OPEN">Open (Dibuka)</option>
                <option value="CLOSED">Closed (Ditutup)</option>
                <option value="FULL">Full (Penuh)</option>
                <option value="COMPLETED">Completed (Selesai)</option>
              </select>
            </div>
          </div>
        </section>

        <!-- Jadwal & Pendaftaran -->
        <section class="bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden ring-1 ring-gray-900/5">
          <div class="px-8 py-5 border-b border-gray-50 bg-gray-50/50">
            <h2 class="text-base font-extrabold text-gray-900 tracking-tight">Jadwal & Pendaftaran</h2>
          </div>
          <div class="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-2">
              <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Tanggal Mulai Program <span class="text-rose-500">*</span></label>
              <input v-model="formData.start_date" type="date" class="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-gray-700 text-sm" required />
            </div>
            <div class="space-y-2">
              <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Tanggal Selesai Program <span class="text-rose-500">*</span></label>
              <input v-model="formData.end_date" type="date" class="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-gray-700 text-sm" required />
            </div>

            <div class="space-y-2">
              <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Pendaftaran Dibuka</label>
              <input v-model="formData.registration_open_at" type="datetime-local" class="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-gray-700 text-sm" />
            </div>
            <div class="space-y-2">
              <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Pendaftaran Ditutup</label>
              <input v-model="formData.registration_close_at" type="datetime-local" class="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-gray-700 text-sm" />
            </div>
            
            <div class="space-y-2">
              <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Total Durasi (Menit)</label>
              <input v-model="formData.duration_minutes" type="number" class="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-gray-700 text-sm" placeholder="Contoh: 2400" />
            </div>
          </div>
        </section>

        <!-- Kapasitas & Harga -->
        <section class="bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden ring-1 ring-gray-900/5">
          <div class="px-8 py-5 border-b border-gray-50 bg-gray-50/50">
            <h2 class="text-base font-extrabold text-gray-900 tracking-tight">Kapasitas & Harga</h2>
          </div>
          <div class="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="space-y-2">
              <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Min. Peserta</label>
              <input v-model="formData.min_participants" type="number" class="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-gray-700 text-sm" placeholder="0" />
            </div>
            <div class="space-y-2">
              <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Max. Peserta</label>
              <input v-model="formData.max_participants" type="number" class="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-gray-700 text-sm" placeholder="0" />
            </div>
            <div class="space-y-2">
              <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Harga (IDR) <span class="text-rose-500">*</span></label>
              <div class="relative">
                <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <span class="text-gray-400 text-sm font-bold">Rp</span>
                </div>
                <input v-model="formData.price" type="number" class="w-full pl-11 pr-5 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-gray-700 text-sm" placeholder="0" required />
              </div>
            </div>
          </div>
        </section>

        <section class="bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden ring-1 ring-gray-900/5">
          <div class="px-8 py-5 border-b border-gray-50 bg-gray-50/50">
            <h2 class="text-base font-extrabold text-gray-900 tracking-tight">Instruksi Tambahan</h2>
          </div>
          <div class="p-8">
            <textarea v-model="formData.special_instructions" rows="4" class="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium text-gray-700 text-sm" placeholder="Instruksi khusus untuk peserta..."></textarea>
          </div>
        </section>

        <!-- Konfigurasi Penilaian (Scoring) -->
        <section class="bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden ring-1 ring-gray-900/5">
          <div class="px-8 py-5 border-b border-gray-50 bg-gray-50/50">
            <h2 class="text-base font-extrabold text-gray-900 tracking-tight">Konfigurasi Penilaian (Scoring)</h2>
          </div>
          <div class="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-2">
              <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Metode Penilaian</label>
              <select v-model="formData.scoring_type" class="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-gray-700 text-sm cursor-pointer">
                <option value="SCALE">SCALE (Menggunakan Tabel Konversi)</option>
                <option value="RAW">RAW (Nilai Langsung / Jumlah Benar)</option>
              </select>
            </div>
            <div v-if="formData.scoring_type === 'RAW'" class="space-y-2">
              <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Nilai Awal (Offset)</label>
              <input v-model.number="formData.scoring_config.initialScore" type="number" class="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-gray-700 text-sm" placeholder="0" />
            </div>
          </div>
        </section>

        <!-- Sesi (Sessions) -->
        <section class="bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden ring-1 ring-gray-900/5">
          <div class="px-8 py-5 border-b border-gray-50 bg-gray-50/50 flex justify-between items-center">
            <h2 class="text-base font-extrabold text-gray-900 tracking-tight">Sesi Pertemuan</h2>
            <button type="button" @click="addSession" class="text-sm text-blue-600 hover:text-blue-700 font-bold flex items-center gap-1.5 transition-colors">
              <Icon name="lucide:plus-circle" class="w-5 h-5" /> Tambah Sesi
            </button>
          </div>
          <div class="p-8 space-y-6">
            <div v-if="formData.sessions.length === 0" class="text-center py-12 text-gray-400 bg-gray-50/50 rounded-[2rem] border border-dashed border-gray-200">
              <Icon name="lucide:calendar-range" class="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p class="text-sm font-medium italic">Belum ada sesi yang ditambahkan.</p>
            </div>
            
            <div v-for="(session, index) in formData.sessions" :key="index" class="bg-gray-50/50 rounded-[2rem] border border-gray-100 p-8 relative group hover:border-blue-200 transition-all">
              <button type="button" @click="removeSession(index)" class="absolute top-6 right-6 p-2 text-gray-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all">
                <Icon name="lucide:trash-2" class="w-5 h-5" />
              </button>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pr-10">
                <div class="md:col-span-2 space-y-2">
                  <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Judul Sesi</label>
                  <input v-model="session.title" type="text" class="w-full px-5 py-3 bg-white border border-gray-100 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-gray-700 text-sm" placeholder="Judul Sesi" />
                </div>
                <div class="space-y-2">
                  <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Tipe</label>
                  <select v-model="session.session_type" class="w-full px-5 py-3 bg-white border border-gray-100 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-gray-700 text-sm cursor-pointer">
                    <option value="CLASS">Class</option>
                    <option value="TRYOUT">Tryout</option>
                    <option value="CONSULTATION">Consultation</option>
                  </select>
                </div>
                <div class="space-y-2">
                  <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Meeting URL</label>
                  <input v-model="session.meeting_url" type="url" class="w-full px-5 py-3 bg-white border border-gray-100 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-gray-700 text-sm" placeholder="https://..." />
                </div>
                <div class="space-y-2">
                  <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Mulai</label>
                  <input v-model="session.start_at" type="datetime-local" class="w-full px-5 py-3 bg-white border border-gray-100 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-gray-700 text-sm" />
                </div>
                <div class="space-y-2">
                  <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Selesai</label>
                  <input v-model="session.end_at" type="datetime-local" class="w-full px-5 py-3 bg-white border border-gray-100 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-gray-700 text-sm" />
                </div>
                <div class="md:col-span-2 space-y-2">
                  <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Catatan</label>
                  <input v-model="session.notes" type="text" class="w-full px-5 py-3 bg-white border border-gray-100 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium text-gray-700 text-sm" placeholder="Catatan tambahan..." />
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Action Buttons -->
        <div class="flex justify-end gap-3 pt-4">
          <button
            type="button"
            @click="goBack"
            class="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all shadow-sm"
          >
            Batal
          </button>
          <button
            type="submit"
            :disabled="isLoading"
            class="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all transform active:scale-95 disabled:opacity-60"
          >
            <Icon
              v-if="!isLoading"
              name="lucide:save"
              class="h-4 w-4"
            />
            <Icon
              v-else
              name="lucide:loader-2"
              class="h-4 w-4 animate-spin"
            />
            {{ isLoading ? 'Menyimpan...' : 'Perbarui Batch' }}
          </button>
        </div>

      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useBatchGetById } from '@/composables/Batch/getbyid';
import { useBatchUpdate } from '@/composables/Batch/Update';
import { useLoading } from '@/composables/Loading';
import { useNotificationPopup } from '@/composables/NotificationPopup';

const { $toast } = useNuxtApp() 
const { startLoading, stopLoading } = useLoading()
const { showAlert } = useNotificationPopup()

definePageMeta({
  title: 'Edit Batch - Admin Panel',
  layout: 'admin',
  middleware: ['auth', 'role-check'],
  permission: "batch.update",
})

const route = useRoute()
const id = route.params.id // ID Batch dari URL

const isLoading = ref(false)

interface Session {
  id?: number | string; // Optional for new sessions
  title: string;
  session_type: string;
  start_at: string;
  end_at: string;
  meeting_url: string;
  capacity: number;
  notes: string;
}

const formData = reactive({
  idBatch: '',
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
  scoring_type: 'SCALE',
  scoring_config: {
    initialScore: 0
  },
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

// Helper to format date for input
const formatDate = (dateStr: string) => {
  if (!dateStr) return ''
  return new Date(dateStr).toISOString().split('T')[0]
}

const formatDateTime = (dateStr: string) => {
  if (!dateStr) return ''
  // Handle timezone offset for local input
  const date = new Date(dateStr)
  const offset = date.getTimezoneOffset() * 60000
  return (new Date(date.getTime() - offset)).toISOString().slice(0, 16)
}

onMounted(async () => {
  isLoading.value = true
  startLoading()
  try {
    const { data } = await useBatchGetById(id)
    if (data.value) {
      const b = data.value
      formData.idBatch = b.idBatch
      formData.name = b.name
      formData.description = b.description
      formData.type = b.type
      formData.start_date = formatDate(b.start_date)
      formData.end_date = formatDate(b.end_date)
      formData.registration_open_at = formatDateTime(b.registration_open_at)
      formData.registration_close_at = formatDateTime(b.registration_close_at)
      formData.max_participants = b.max_participants
      formData.min_participants = b.min_participants
      formData.status = b.status
      formData.price = b.price
      formData.currency = b.currency || 'IDR'
      formData.duration_minutes = b.duration_minutes
      formData.special_instructions = b.special_instructions
      
      // Scoring config
      formData.scoring_type = b.scoring_type || 'SCALE'
      formData.scoring_config = b.scoring_config || { initialScore: 0 }
      
      // Map sessions
      if (b.sessions && Array.isArray(b.sessions)) {
        formData.sessions = b.sessions.map((s: any) => ({
          id: s.id,
          title: s.title,
          session_type: s.session_type,
          start_at: formatDateTime(s.start_at),
          end_at: formatDateTime(s.end_at),
          meeting_url: s.meeting_url,
          capacity: s.capacity,
          notes: s.notes
        }))
      }
    }
  } catch (err) {
    console.error('Gagal memuat data batch:', err)
    showAlert('Gagal memuat data batch.')
  } finally {
    stopLoading()
    isLoading.value = false
  }
})

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

    await useBatchUpdate(id, payload) 
    
    $toast.success(`Batch "${formData.name}" berhasil diperbarui!`)
    navigateTo('/admin/batch')
  } catch (err: any) {
    console.error('Error saat memperbarui batch:', err)
    showAlert(err.message || 'Gagal memperbarui batch. Silakan coba lagi.')
  } finally {
    stopLoading()
    isLoading.value = false
  }
}

const goBack = () => navigateTo('/admin/batch')
</script>