<template>
  <div class="min-h-screen bg-gray-50/50 flex flex-col relative overflow-hidden font-sans">
    <!-- Decorative Elements -->
    <div class="absolute -top-24 -right-24 w-96 h-96 bg-emerald-50 rounded-full opacity-50 blur-3xl -z-10"></div>
    <div class="absolute top-1/2 -left-24 w-64 h-64 bg-emerald-50 rounded-full opacity-40 blur-3xl -z-10"></div>

    <main class="flex-grow container mx-auto px-4 py-12 md:px-6 lg:py-20 relative z-10 pb-24 lg:pb-12">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        
        <!-- Left Column: Profile Card -->
        <div class="lg:col-span-4 space-y-8">
          <!-- Main Profile Card -->
          <div class="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden relative group">
            <div class="h-32 bg-emerald-600 relative overflow-hidden">
               <div class="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>
               <div class="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
            </div>
            
            <div class="px-8 pb-8 text-center -mt-16 relative z-10">
              <div class="relative inline-block group/avatar">
                <img 
                  :src="userData.picture || `https://ui-avatars.com/api/?name=${userData.name}&background=random`" 
                  alt="Profile" 
                  class="w-32 h-32 rounded-[2rem] border-8 border-white shadow-2xl shadow-emerald-900/10 object-cover mx-auto bg-gray-50 transform transition-transform group-hover/avatar:scale-105 duration-500"
                />
                <div v-if="userData.email_verified" class="absolute bottom-1 right-1 bg-emerald-500 text-white p-2 rounded-2xl border-4 border-white shadow-xl" title="Terverifikasi">
                  <Icon name="heroicons:check-badge" class="w-5 h-5" />
                </div>
              </div>
              
              <div class="mt-6 space-y-1">
                <h1 class="text-2xl font-extrabold text-gray-900 tracking-tight leading-tight">{{ userData.name }}</h1>
                <p class="text-gray-400 font-medium text-sm">{{ userData.email }}</p>
              </div>
              
              <div class="mt-6 flex flex-wrap justify-center gap-3">
                <span class="px-4 py-1.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100 uppercase tracking-[0.1em]">
                  {{ userData.role }}
                </span>
                <span v-if="userData.detailuser?.nim" class="px-4 py-1.5 rounded-full text-[10px] font-bold bg-gray-900 text-white uppercase tracking-[0.1em] shadow-lg shadow-gray-900/20">
                  NIM: {{ userData.detailuser.nim }}
                </span>
              </div>
            </div>
            
            <div class="border-t border-gray-50 px-8 py-8 space-y-6">
              <div class="flex items-center gap-3 text-emerald-600">
                <Icon name="heroicons:identification" class="w-6 h-6" />
                <h3 class="text-sm font-bold uppercase tracking-[0.2em]">Informasi Akademik</h3>
              </div>
              
              <div class="space-y-4">
                <div v-for="(val, key) in { 'Nama Lengkap': userData.detailuser?.namaLengkap || '-', 'Fakultas': userData.detailuser?.fakultas || '-', 'Program Studi': userData.detailuser?.prodi || '-', 'Bergabung Sejak': formatDate(userData.createdAt) }" :key="key" class="space-y-1">
                  <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">{{ key }}</p>
                  <p class="text-sm font-bold text-gray-800 tracking-tight">{{ val }}</p>
                </div>
              </div>
            </div>

            <div class="p-6 bg-gray-50/50 border-t border-gray-50">
               <button @click="openEditModal" class="flex items-center justify-center gap-3 w-full py-4 text-sm font-bold text-emerald-600 bg-white rounded-2xl border border-emerald-100 shadow-sm hover:bg-emerald-600 hover:text-white hover:shadow-xl hover:shadow-emerald-600/20 transition-all duration-300 active:scale-95 group/btn">
                 <Icon name="heroicons:pencil-square" class="w-5 h-5 group-hover/btn:rotate-12 transition-transform" />
                 Perbarui Profil
               </button>
            </div>
          </div>
        </div>

        <!-- Right Column: Stats & Activity -->
        <div class="lg:col-span-8 space-y-8">
          
          <!-- Stats Grid -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-6">
            <div v-for="stat in [
              { label: 'Skor Tertinggi', val: userData.skor_tertinggi, color: 'emerald', icon: 'heroicons:trophy' },
              { label: 'Total Ujian', val: userData.total_Ujian, color: 'blue', icon: 'heroicons:document-check' },
              { label: 'Sertifikat', val: userData.total_sertifikat, color: 'amber', icon: 'heroicons:academic-cap' },
              { label: 'Total Bayar', val: userData.total_Pembayaran, color: 'purple', icon: 'heroicons:credit-card' }
            ]" :key="stat.label" class="bg-white p-6 rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 group hover:scale-105 transition-transform duration-300">
              <div class="flex flex-col items-center text-center space-y-4">
                <div :class="`bg-${stat.color}-50 text-${stat.color}-600`" class="p-4 rounded-2xl group-hover:rotate-12 transition-transform">
                  <Icon :name="stat.icon" class="w-8 h-8" />
                </div>
                <div class="space-y-1">
                  <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">{{ stat.label }}</p>
                  <p class="text-3xl font-extrabold text-gray-900 tracking-tighter">{{ stat.val }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Recent Activity Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <!-- Recent Tests -->
            <div class="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden flex flex-col">
              <div class="px-8 py-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
                <h3 class="text-lg font-extrabold text-gray-900 tracking-tight">Riwayat Ujian</h3>
                <NuxtLink to="/history" class="text-[10px] font-bold text-emerald-600 uppercase tracking-widest hover:text-emerald-700 transition-colors">Lihat Semua</NuxtLink>
              </div>
              <div class="flex-grow divide-y divide-gray-50">
                <div v-for="(test, index) in userData?.riwayat_ujian" :key="index" class="p-6 hover:bg-emerald-50/30 transition-colors flex items-center justify-between group">
                  <div class="flex items-center gap-5">
                    <div class="h-14 w-14 rounded-2xl bg-gray-50 border border-gray-100 flex flex-col items-center justify-center group-hover:bg-white group-hover:shadow-sm transition-all">
                      <p class="text-xl font-extrabold text-emerald-600 leading-none">{{ test.score }}</p>
                      <p class="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-1">Pts</p>
                    </div>
                    <div class="space-y-1">
                      <p class="text-sm font-bold text-gray-800 tracking-tight leading-tight">{{ test.batch.name }}</p>
                      <p class="text-[10px] font-bold text-gray-400 opacity-60 uppercase">{{ test.submittedAt }}</p>
                    </div>
                  </div>
                  <span :class="test.passed ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'" class="px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border">
                    {{ test.passed ? 'Lulus' : 'Gagal' }}
                  </span>
                </div>
                <div v-if="!userData?.riwayat_ujian?.length" class="p-12 text-center">
                   <p class="text-xs font-bold text-gray-300 uppercase tracking-widest">Belum Ada Riwayat</p>
                </div>
              </div>
            </div>

            <!-- Certificates -->
            <div class="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden flex flex-col">
              <div class="px-8 py-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
                <h3 class="text-lg font-extrabold text-gray-900 tracking-tight">Sertifikat</h3>
              </div>
              <div class="flex-grow p-6 space-y-4">
                <div v-if="userData?.list_sertifikat && userData.list_sertifikat.length > 0" class="space-y-4">
                   <div v-for="(cert, idx) in userData?.list_sertifikat" :key="idx" class="border border-gray-100 rounded-2xl p-5 flex items-start gap-4 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-900/5 transition-all cursor-pointer group bg-gray-50/30 hover:bg-white">
                      <div class="p-3 bg-white text-emerald-500 rounded-xl shadow-sm border border-gray-50 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500 rotate-0 group-hover:-rotate-6">
                        <Icon name="heroicons:academic-cap" class="w-7 h-7" />
                      </div>
                      <div class="space-y-3">
                        <div>
                          <p class="text-sm font-bold text-gray-900 leading-tight line-clamp-2 group-hover:text-emerald-600 transition-colors">{{ cert.title }}</p>
                          <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1 opacity-60">Terbit: {{ cert.date }}</p>
                        </div>
                        <p class="text-[10px] font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-2 group-hover:underline">
                          Unduh PDF <Icon name="heroicons:arrow-down-tray" class="w-3.5 h-3.5" />
                        </p>
                      </div>
                   </div>
                </div>
                <div v-else class="h-full flex flex-col items-center justify-center py-12 space-y-4">
                  <div class="p-6 bg-gray-50 rounded-full text-gray-200">
                    <Icon name="heroicons:document-text" class="w-12 h-12" />
                  </div>
                  <p class="text-xs font-bold text-gray-300 uppercase tracking-widest">Belum Ada Sertifikat</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>

    <!-- Edit Profile Modal -->
    <div v-if="isEditModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity" @click.self="isEditModalOpen = false">
      <div class="bg-white rounded-[2.5rem] shadow-xl w-full max-w-md overflow-hidden transform transition-all border border-gray-100">
        <div class="px-8 py-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
          <h3 class="text-xl font-extrabold text-gray-900 tracking-tight">Perbarui <span class="text-emerald-600">Profil</span></h3>
          <button @click="isEditModalOpen = false" class="text-gray-400 hover:text-rose-500 transition-colors">
            <Icon name="heroicons:x-mark" class="w-6 h-6" />
          </button>
        </div>
        
        <div class="p-8 space-y-6">
          <div class="space-y-2">
            <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Nama Lengkap</label>
            <input v-model="editForm.namaLengkap" type="text" class="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-bold text-gray-700" placeholder="Nama sesuai KTP/KTM" />
          </div>
          
          <div class="space-y-2">
            <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">NIM</label>
            <input v-model="editForm.nim" type="text" class="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-mono font-bold text-gray-700" placeholder="Nomor Induk Mahasiswa" />
          </div>

          <div class="grid grid-cols-2 gap-6">
            <div class="space-y-2">
              <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Fakultas</label>
              <input v-model="editForm.fakultas" type="text" class="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-bold text-gray-700" placeholder="FTIK" />
            </div>
            <div class="space-y-2">
              <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Program Studi</label>
              <input v-model="editForm.prodi" type="text" class="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-bold text-gray-700" placeholder="Prodi" />
            </div>
          </div>
        </div>

        <div class="px-8 py-6 bg-gray-50/50 border-t border-gray-50 flex gap-4">
          <button @click="isEditModalOpen = false" class="flex-1 px-6 py-4 text-sm font-bold text-gray-500 bg-white border border-gray-100 rounded-2xl hover:bg-gray-100 transition-all active:scale-95">
            Batal
          </button>
          <button @click="saveProfile" :disabled="isUpdating" class="flex-[1.5] px-6 py-4 text-sm font-bold text-white bg-gray-900 rounded-2xl hover:bg-black shadow-xl shadow-gray-900/10 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 transition-all active:scale-95">
            <Icon v-if="isUpdating" name="svg-spinners:ring-resize" class="w-5 h-5" />
            {{ isUpdating ? 'Menyimpan...' : 'Simpan Perubahan' }}
          </button>
        </div>
      </div>
    </div>

    <BottomNav class="z-50" />
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
  { name: 'Batch 12', date: '2 Jan 2026', score: 550, passed: true },
  { name: 'Simulasi Ujian Mandiri', date: '28 Des 2025', score: 480, passed: false },
  { name: 'Placement Test', date: '15 Des 2025', score: 510, passed: true },
]);

// Dummy Certificates
const dummyCertificates = ref([
  { title: 'Sertifikat Kompetensi Bahasa', date: '03 Jan 2026', id: 'CERT-001' }
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