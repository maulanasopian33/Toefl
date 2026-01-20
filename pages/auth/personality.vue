<template>
  <div class="personality-content space-y-6">
    <div class="mb-4">
      <h1 class="text-3xl font-extrabold text-gray-900 mb-2">Informasi Pribadi</h1>
      <p class="text-gray-500 text-sm">Lengkapi profil Anda untuk pengalaman yang lebih baik.</p>
    </div>

    <!-- Full Name Field -->
    <div class="space-y-1">
      <label for="full_name" class="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Nama Lengkap</label>
      <div class="relative group">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon name="heroicons:user-circle" class="h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
        </div>
        <input type="text" v-model="namaLengkap" id="full_name" class="auth-input !pl-10" placeholder="Masukkan nama lengkap">
      </div>
    </div>

    <!-- NIM Field -->
    <div class="space-y-1">
      <label for="nim" class="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">NIM / ID Identitas</label>
      <div class="relative group">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon name="heroicons:identification" class="h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
        </div>
        <input v-model="nim" type="text" id="nim" class="auth-input !pl-10" placeholder="Contoh: 12345678">
      </div>
    </div>

    <!-- Fakultas Field -->
    <div class="space-y-1">
      <label for="fakultas" class="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Fakultas</label>
      <div class="relative group">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon name="heroicons:academic-cap" class="h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
        </div>
        <select id="fakultas" v-model="fakultas" class="auth-input !pl-10 appearance-none">
          <option value="" disabled selected>Pilih Fakultas...</option>
          <option :value="item.id" v-for="item in DataFakultas" :key="item.id">{{ item.name }}</option>
        </select>
        <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <Icon name="heroicons:chevron-down" class="h-4 w-4 text-gray-400" />
        </div>
      </div>
    </div>

    <!-- Prodi Field -->
    <div class="space-y-1">
      <label for="prodi" class="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Program Studi</label>
      <div class="relative group">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon name="heroicons:book-open" class="h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
        </div>
        <select id="prodi" v-model="prodi" class="auth-input !pl-10 appearance-none" :disabled="!fakultas">
          <option value="" disabled selected>{{ fakultas ? 'Pilih Prodi...' : 'Pilih Fakultas Terlebih Dahulu' }}</option>
          <option :value="item.id" v-for="item in dataProdi" :key="item.id">{{ item.name }}</option>
        </select>
        <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <Icon name="heroicons:chevron-down" class="h-4 w-4 text-gray-400" />
        </div>
      </div>
    </div>

    <!-- Submit Button -->
    <button @click="handleSubmit()" :disabled="!isFormValid" class="submit-btn group mt-4">
      <span class="relative z-10 flex items-center justify-center">
        Simpan Profil
        <Icon name="heroicons:check-badge" class="w-5 h-5 ml-2 group-hover:scale-110 transition-transform" />
      </span>
    </button>
    <NotificationPopup />
  </div>
</template>

<script lang="ts" setup>
import { useUserDetailsPost } from '@/composables/UserDetails/post';
import { DataFakultas } from '@/data/Fakultas';

const { startLoading, stopLoading } = useLoading();
const { setTitle, setDescription, NavLogin, NavRegister } = useLayoutStore();

definePageMeta({ layout: 'auth' });
setTitle('Pembuatan Akun');
setDescription('Lengkapi data diri Anda untuk melanjutkan ke platform ToaflArabi.');
NavLogin(false);
NavRegister(false);

const fakultas = ref('');
const namaLengkap = ref('');
const nim = ref('');
const prodi = ref('');

const dataProdi = computed(() => {
    const selectedFakultas = DataFakultas.find(fs => fs.id === fakultas.value);
    return selectedFakultas ? selectedFakultas.prodi : [];
});

const isFormValid = computed(() => {
    return namaLengkap.value.length >= 3 && nim.value.length >= 5 && fakultas.value && prodi.value;
});

watch(fakultas, () => {
    prodi.value = '';
});

const handleSubmit = async () => {
    if (!isFormValid.value) return;
    startLoading();

    const userData = {
        namaLengkap: namaLengkap.value,
        nim: nim.value,
        fakultas: fakultas.value,
        prodi: prodi.value,
    };

    const { data } = await useUserDetailsPost(userData);

    if (data) {
      stopLoading();
      navigateTo('/');
    }
};
</script>

<style scoped>
.personality-content {
  animation: fade-in-up 0.6s ease-out;
}

@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.auth-input {
  @apply block w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-emerald-500 focus:border-emerald-500 p-3 transition-all duration-300 outline-none;
}

.auth-input:focus {
  @apply bg-white shadow-lg shadow-emerald-500/5 ring-1 ring-emerald-500/20;
}

.submit-btn {
  @apply relative w-full bg-emerald-600 text-white font-bold py-4 px-4 rounded-xl hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-500/30 transition-all duration-300 shadow-lg shadow-emerald-600/20 overflow-hidden;
}

.submit-btn:disabled {
  @apply opacity-50 cursor-not-allowed grayscale;
}
</style>