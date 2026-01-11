<template>
    <div class="p-6 max-w-6xl mx-auto">
    <div class="mb-8 flex justify-between items-center">
        <div>
        <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight">Generate Certificate</h1>
        <p class="text-gray-500 mt-1">Buat sertifikat baru untuk peserta secara individual atau massal.</p>
        </div>
        <NuxtLink
        to="/admin/certificates/history"
        class="text-gray-600 hover:text-gray-900 flex items-center gap-2 transition-colors font-medium"
        >
        <Icon name="heroicons:arrow-left" class="w-5 h-5" />
        Lihat Riwayat
        </NuxtLink>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Form Section -->
        <div class="lg:col-span-1 space-y-6">
        <div class="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 ring-1 ring-gray-900/5">
            <h2 class="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Icon name="heroicons:pencil-square" class="w-6 h-6 text-blue-600" />
            Input Sertifikat
            </h2>
            <form @submit.prevent="addToQueue" class="space-y-4">
            <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">Nama Lengkap</label>
                <input
                v-model="form.name"
                type="text"
                required
                placeholder="Contoh: PUCUK IDEA"
                class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none bg-gray-50/50"
                />
            </div>
            <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">Event / Ujian</label>
                <input
                v-model="form.event"
                type="text"
                required
                placeholder="Contoh: TOAFL Testa"
                class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none bg-gray-50/50"
                />
            </div>
            <div class="grid grid-cols-2 gap-4">
                <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">Skor</label>
                <input
                    v-model.number="form.score"
                    type="number"
                    required
                    placeholder="520"
                    class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none bg-gray-50/50"
                />
                </div>
                <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">Tanggal</label>
                <input
                    v-model="form.date"
                    type="date"
                    required
                    class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none bg-gray-50/50"
                />
                </div>
            </div>
            <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">Nomor Sertifikat</label>
                <input
                v-model="form.certificate_number"
                type="text"
                required
                placeholder="Contoh: TOAfld"
                class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none bg-gray-50/50"
                />
            </div>
            <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">User ID</label>
                <input
                v-model="form.user_id"
                type="text"
                required
                placeholder="Firebase UID"
                class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none bg-gray-50/50"
                />
            </div>
            
            <button
                type="submit"
                class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-blue-200 transition-all transform hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2"
            >
                <Icon name="heroicons:plus" class="w-5 h-5" />
                Tambah ke Antrian
            </button>
            </form>
        </div>

        <div class="bg-blue-50 p-4 rounded-xl border border-blue-100 flex gap-3">
            <Icon name="heroicons:information-circle" class="w-6 h-6 text-blue-500 shrink-0" />
            <p class="text-sm text-blue-700 leading-relaxed">
            Anda bisa memasukkan data satu per satu untuk digenerate secara massal. Callback URL secara otomatis diarahkan ke sistem.
            </p>
        </div>
        </div>

        <!-- Queue Section -->
        <div class="lg:col-span-2 space-y-6">
        <div class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden flex flex-col h-full min-h-[600px]">
            <div class="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h2 class="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Icon name="heroicons:queue-list" class="w-6 h-6 text-orange-500" />
                Antrian ({{ queue.length }})
            </h2>
            <button
                v-if="queue.length > 0"
                @click="clearQueue"
                class="text-sm text-red-600 hover:text-red-700 font-semibold"
            >
                Hapus Semua
            </button>
            </div>

            <div class="flex-grow overflow-y-auto p-0">
            <div v-if="queue.length === 0" class="flex flex-col items-center justify-center h-full text-gray-400 py-20">
                <Icon name="heroicons:document-plus" class="w-20 h-20 mb-4 opacity-20" />
                <p>Belum ada data di antrian.</p>
                <p class="text-sm">Silakan isi formulir di samping untuk memulai.</p>
            </div>

            <div v-else class="divide-y divide-gray-100">
                <div v-for="(item, index) in queue" :key="index" class="p-4 hover:bg-gray-50 transition-colors flex justify-between items-center group">
                <div class="flex items-center gap-4">
                    <div class="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0">
                    {{ index + 1 }}
                    </div>
                    <div>
                    <div class="font-bold text-gray-800">{{ item.data.name }}</div>
                    <div class="text-sm text-gray-500 flex items-center gap-3 mt-0.5">
                        <span class="flex items-center gap-1">
                        <Icon name="heroicons:calendar" class="w-4 h-4" />
                        {{ item.data.date }}
                        </span>
                        <span class="flex items-center gap-1">
                        <Icon name="heroicons:academic-cap" class="w-4 h-4" />
                        Skor: {{ item.data.score }}
                        </span>
                    </div>
                    </div>
                </div>
                <button @click="removeFromQueue(index)" class="p-2 text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                    <Icon name="heroicons:trash" class="w-5 h-5" />
                </button>
                </div>
            </div>
            </div>

            <div class="p-6 bg-gray-50 border-t border-gray-100">
            <button
                @click="processGenerate"
                :disabled="queue.length === 0 || isLoading"
                class="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-lg shadow-xl shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3"
            >
                <Icon v-if="isLoading" name="heroicons:arrow-path" class="w-6 h-6 animate-spin" />
                <span v-else>Generate {{ queue.length }} Sertifikat</span>
            </button>
            </div>
        </div>
        </div>
    </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useCertificates, type GenerateRequest } from '@/composables/useCertificates'
import { useRouter } from 'vue-router'

const { generateCertificates, isLoading } = useCertificates()
const router = useRouter()

definePageMeta({
  title: 'Generate Certificate - Admin Panel',
  layout: 'admin',
  middleware: ['auth', 'role-check'],
  permission: "batch.read" // Adjust permission key
})
const form = reactive({
  name: '',
  event: '',
  date: new Date().toISOString().split('T')[0],
  certificate_number: '',
  score: 0,
  user_id: '',
  qr_token: 'auto-generated', // Misal default
  verify_url: 'https://verify.lbaiuqi.com/' // Misal default
})

const queue = ref<GenerateRequest[]>([])

const addToQueue = () => {
  // Buat copy dari form
  const data = { ...form }
  
  // Tambahkan ke queue
  queue.value.push({
    data: {
      ...data,
      qr_token: Math.random().toString(36).substring(7), // Dummy generator if not provided
      verify_url: `${data.verify_url}${data.certificate_number}`
    },
    callback_url: 'https://api-toefl.lbaiuqi.com/callback'
  })

  // Reset name and cert number for next input, keep event and date for convenience
  form.name = ''
  form.certificate_number = ''
  form.user_id = ''
}

const removeFromQueue = (index: number) => {
  queue.value.splice(index, 1)
}

const clearQueue = () => {
  queue.value = []
}

const processGenerate = async () => {
  if (queue.value.length === 0) return

  try {
    const response = await generateCertificates(queue.value)
    if (response.status) {
      alert('Sertifikat sedang diproses! Silakan cek riwayat beberapa saat lagi.')
      queue.value = []
      router.push('/admin/certificates/history')
    }
  } catch (error: any) {
    alert('Gagal generate sertifikat: ' + (error.message || 'Error tidak diketahui'))
  }
}
</script>

<style scoped>
/* Custom scrollbar for queue list */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
  background: #cbd5e1;
}
</style>
