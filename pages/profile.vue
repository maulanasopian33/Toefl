<template>
  <div class="min-h-screen bg-slate-50 pb-20 font-sans">
    <!-- Header Background -->
    <div class="h-48 bg-gradient-to-r from-slate-900 to-slate-800 relative">
       <div class="absolute inset-0 bg-pattern opacity-10"></div>
    </div>

    <div class="container mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-10">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- Left Column: Profile Card -->
        <div class="lg:col-span-1 space-y-6">
          <!-- Main Profile Card -->
          <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div class="p-6 text-center">
              <div class="relative inline-block">
                <img 
                  :src="userData.picture || `https://ui-avatars.com/api/?name=${userData.name}&background=random`" 
                  alt="Profile" 
                  class="w-32 h-32 rounded-full border-4 border-white shadow-md object-cover mx-auto bg-slate-100"
                />
                <div v-if="userData.email_verified" class="absolute bottom-2 right-2 bg-blue-500 text-white p-1.5 rounded-full border-2 border-white" title="Terverifikasi">
                  <Icon name="lucide:check" class="w-4 h-4" />
                </div>
              </div>
              
              <h1 class="mt-4 text-xl font-bold text-slate-900">{{ userData.name }}</h1>
              <p class="text-slate-500 text-sm">{{ userData.email }}</p>
              
              <div class="mt-4 flex justify-center gap-2">
                <span class="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 uppercase tracking-wide">
                  {{ userData.role }}
                </span>
                <span v-if="userData.detailuser?.nim" class="px-3 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-600 font-mono">
                  {{ userData.detailuser.nim }}
                </span>
              </div>
            </div>
            
            <div class="border-t border-slate-100 p-6">
              <h3 class="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Icon name="lucide:graduation-cap" class="w-4 h-4 text-slate-400" />
                Informasi Akademik
              </h3>
              <div class="space-y-3 text-sm">
                <div class="flex justify-between">
                  <span class="text-slate-500">Nama Lengkap</span>
                  <span class="font-medium text-slate-900">{{ userData.detailuser?.namaLengkap || '-' }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-slate-500">Fakultas</span>
                  <span class="font-medium text-slate-900">{{ userData.detailuser?.fakultas || '-' }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-slate-500">Program Studi</span>
                  <span class="font-medium text-slate-900">{{ userData.detailuser?.prodi || '-' }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-slate-500">Bergabung Sejak</span>
                  <span class="font-medium text-slate-900">{{ formatDate(userData.createdAt) }}</span>
                </div>
              </div>
            </div>

            <div class="p-4 bg-slate-50 border-t border-slate-100 text-center">
               <button @click="openEditModal" class="text-sm text-indigo-600 font-medium hover:text-indigo-700 flex items-center justify-center gap-2 w-full">
                 <Icon name="lucide:edit" class="w-4 h-4" />
                 Edit Profil
               </button>
            </div>
          </div>
        </div>

        <!-- Right Column: Stats & Activity -->
        <div class="lg:col-span-2 space-y-6">
          
          <!-- Stats Grid -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div class="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
              <div class="flex items-center gap-3 mb-2">
                <div class="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                  <Icon name="lucide:trophy" class="w-5 h-5" />
                </div>
                <span class="text-xs font-medium text-slate-500">Skor Tertinggi</span>
              </div>
              <p class="text-2xl font-bold text-slate-900">{{ userData.skor_tertinggi }}</p>
            </div>
            
            <div class="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
              <div class="flex items-center gap-3 mb-2">
                <div class="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <Icon name="lucide:file-check" class="w-5 h-5" />
                </div>
                <span class="text-xs font-medium text-slate-500">Total Ujian</span>
              </div>
              <p class="text-2xl font-bold text-slate-900">{{ userData.total_Ujian }}</p>
            </div>

            <div class="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
              <div class="flex items-center gap-3 mb-2">
                <div class="p-2 bg-amber-50 text-amber-600 rounded-lg">
                  <Icon name="lucide:award" class="w-5 h-5" />
                </div>
                <span class="text-xs font-medium text-slate-500">Sertifikat</span>
              </div>
              <p class="text-2xl font-bold text-slate-900">{{ userData.total_sertifikat }}</p>
            </div>

            <div class="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
              <div class="flex items-center gap-3 mb-2">
                <div class="p-2 bg-purple-50 text-purple-600 rounded-lg">
                  <Icon name="lucide:wallet" class="w-5 h-5" />
                </div>
                <span class="text-xs font-medium text-slate-500">Pembayaran</span>
              </div>
              <p class="text-2xl font-bold text-slate-900">{{ userData.total_Pembayaran }}</p>
            </div>
          </div>

          <!-- Recent Tests -->
          <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div class="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h3 class="font-semibold text-slate-900">Riwayat Ujian Terakhir</h3>
              <NuxtLink to="/history" class="text-xs font-medium text-indigo-600 hover:text-indigo-700">Lihat Semua</NuxtLink>
            </div>
            <div class="divide-y divide-slate-100">
              <div v-for="(test, index) in userData?.riwayat_ujian" :key="index" class="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between">
                <div class="flex items-center gap-4">
                  <div class="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs">
                    {{ test.score }}
                  </div>
                  <div>
                    <p class="text-sm font-medium text-slate-900">{{ test.batch.name }}</p>
                    <p class="text-xs text-slate-500">{{ test.submittedAt }}</p>
                  </div>
                </div>
                <span :class="test.passed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'" class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase">
                  {{ test.passed ? 'Lulus' : 'Gagal' }}
                </span>
              </div>
            </div>
          </div>

          <!-- Certificates -->
          <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div class="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h3 class="font-semibold text-slate-900">Sertifikat Saya</h3>
            </div>
            <div v-if="userData?.list_sertifikat && userData.list_sertifikat.length > 0" class="p-4 grid gap-4 sm:grid-cols-2">
               <div v-for="(cert, idx) in userData?.list_sertifikat" :key="idx" class="border border-slate-200 rounded-xl p-4 flex items-start gap-3 hover:border-indigo-200 hover:shadow-sm transition-all cursor-pointer group">
                  <div class="p-2 bg-indigo-50 text-indigo-600 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <Icon name="lucide:file-badge" class="w-6 h-6" />
                  </div>
                  <div>
                    <p class="text-sm font-bold text-slate-900 line-clamp-1">{{ cert.title }}</p>
                    <p class="text-xs text-slate-500 mt-0.5">Terbit: {{ cert.date }}</p>
                    <p class="text-xs font-medium text-indigo-600 mt-2 flex items-center gap-1">
                      Download PDF <Icon name="lucide:download" class="w-3 h-3" />
                    </p>
                  </div>
               </div>
            </div>
            <div v-else class="p-8 text-center text-slate-500 text-sm">
              Belum ada sertifikat yang diterbitkan.
            </div>
          </div>

        </div>
      </div>
    </div>

    <!-- Edit Profile Modal -->
    <div v-if="isEditModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity" @click.self="isEditModalOpen = false">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden transform transition-all">
        <div class="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 class="font-bold text-slate-900">Edit Profil</h3>
          <button @click="isEditModalOpen = false" class="text-slate-400 hover:text-slate-600 transition-colors">
            <Icon name="lucide:x" class="w-5 h-5" />
          </button>
        </div>
        
        <div class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Nama Lengkap</label>
            <input v-model="editForm.namaLengkap" type="text" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" placeholder="Nama sesuai KTP/KTM" />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">NIM</label>
            <input v-model="editForm.nim" type="text" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" placeholder="Nomor Induk Mahasiswa" />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Fakultas</label>
              <input v-model="editForm.fakultas" type="text" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" placeholder="Contoh: FTIK" />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Prodi</label>
              <input v-model="editForm.prodi" type="text" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" placeholder="Contoh: MPI" />
            </div>
          </div>
        </div>

        <div class="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
          <button @click="isEditModalOpen = false" class="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-slate-200">
            Batal
          </button>
          <button @click="saveProfile" :disabled="isUpdating" class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2">
            <Icon v-if="isUpdating" name="lucide:loader-2" class="w-4 h-4 animate-spin" />
            {{ isUpdating ? 'Menyimpan...' : 'Simpan Perubahan' }}
          </button>
        </div>
      </div>
    </div>

    <BottomNav />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, reactive } from 'vue';
import { useAuth } from '@/composables/useAuth';
import { useUserMe } from '@/composables/UserMe';
import { useNotification } from '@/composables/useNotification';
import BottomNav from '@/components/DashboardUser/BottomNav.vue';

definePageMeta({
  middleware: ['auth'],
  title: 'Profil Saya'
});

const config = useRuntimeConfig();
const { showNotification } = useNotification();
const { user } = useAuth();
const { data: userDb, refresh } = await useUserMe();

// Data User
const userData = computed(() => {
  const data = userDb.value ? { ...userDb.value } : {
    uid: user.value?.uid,
    email: user.value?.email,
    name: user.value?.displayName || 'Pengguna',
    email_verified: user.value?.emailVerified,
    picture: user.value?.photoURL,
    role: 'user',
    detailuser: {}
  };

  // Fix relative picture URL
  if (data.picture && data.picture.startsWith('/')) {
    const baseUrl = config.public.API_URL.replace('/api/v1', '');
    data.picture = `${baseUrl}${data.picture}`;
  }

  return data;
});

// Dummy Summary Data
const summary = ref({
  bestScore: 550,
  totalTests: 3,
  certificates: 1,
  payments: 5
});

// Dummy Recent Tests
const dummyTests = ref([
  { name: 'TOAFL Batch 12', date: '2 Jan 2026', score: 550, passed: true },
  { name: 'Simulasi TOAFL Mandiri', date: '28 Des 2025', score: 480, passed: false },
  { name: 'Placement Test', date: '15 Des 2025', score: 510, passed: true },
]);

// Dummy Certificates
const dummyCertificates = ref([
  { title: 'Sertifikat Kompetensi Bahasa Arab (TOAFL)', date: '03 Jan 2026', id: 'CERT-001' }
]);

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
};

// --- Edit Profile Logic ---
const isEditModalOpen = ref(false);
const isUpdating = ref(false);
const editForm = reactive({
  namaLengkap: '',
  nim: '',
  fakultas: '',
  prodi: ''
});

const openEditModal = () => {
  const details = userData.value.detailuser || {};
  editForm.namaLengkap = details.namaLengkap || userData.value.name || '';
  editForm.nim = details.nim || '';
  editForm.fakultas = details.fakultas || '';
  editForm.prodi = details.prodi || '';
  isEditModalOpen.value = true;
};

const saveProfile = async () => {
  isUpdating.value = true;
  try {
    const token = await user.value?.getIdToken();
    await $fetch(`${config.public.API_URL}/users/detail`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: editForm
    });
    
    await refresh(); // Refresh data user dari server
    showNotification('Profil berhasil diperbarui', 'success');
    isEditModalOpen.value = false;
  } catch (e) {
    showNotification('Gagal menyimpan profil', 'error');
  } finally {
    isUpdating.value = false;
  }
};
</script>

<style scoped>
.bg-pattern {
  background-image: radial-gradient(#ffffff 1px, transparent 1px);
  background-size: 20px 20px;
}
</style>