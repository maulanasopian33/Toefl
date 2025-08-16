<template>
  <div>
    <h2 class="text-3xl font-bold text-gray-800 mb-6 rounded-md">Informasi Pribadi</h2>
    <div class="mb-4">
        <label for="full_name" class="block text-gray-700 text-sm font-bold mb-2 rounded-md">Nama Lengkap</label>
        <input type="text" v-model="namaLengkap" id="full_name" class="shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" placeholder="Masukkan nama lengkap Anda">
    </div>
    <div class="mb-4">
        <label for="nim" class="block text-gray-700 text-sm font-bold mb-2 rounded-md">NIM</label>
        <input v-model="nim" type="text" id="nim" class="shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" placeholder="Masukkan nim Anda">
    </div>
    <div class="mb-4">
      <label for="fakultas" class="block text-gray-700 text-sm font-bold mb-2 rounded-md">Fakultas</label>
      <select id="fakultas" placeholder="pilih fakultas anda" v-model="fakultas" class="shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent">
        <option value="" disabled selected>Pilih salah satu...</option>
        <option :value="item.id" v-for="(item, index) in DataFakultas" :key="item.id">{{ item.name }}</option>
      </select>
    </div>
    <div class="mb-4">
      <label for="fakultas" class="block text-gray-700 text-sm font-bold mb-2 rounded-md">Prodi</label>
      <select id="fakultas" v-model="prodi"  placeholder="pilih prodi anda" class="shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent">
        <option value="" disabled selected>Pilih salah satu...</option>
        <option :value="item.id" v-for="(item, index) in dataProdi" :key="item.id">{{ item.name }}</option>
      </select>
    </div>
    {{ fakultas }}
    <!-- Registration Button -->
    <button @click="handleSubmit()" class="bg-green-600 text-white font-bold py-3 px-4 rounded-lg w-full hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-300">
        Registrasi
    </button>
    <NotificationPopup />
  </div>
</template>

<script lang="ts" setup>
import { useUserDetailsPost } from '@/composables/UserDetails/post';
import { DataFakultas } from '@/data/Fakultas';
import { watch } from 'vue';

const { setTitle, setDescription, NavLogin, NavRegister } = useLayoutStore();
definePageMeta({
    layout: 'auth'
});
setTitle('Pembuatan Akun');
setDescription('Bergabunglah dengan komunitas ToaflArabi dan mulailah perjalanan belajar bahasa Arab Anda.');
NavLogin(false);
NavRegister(false);

const fakultas = ref(''); // Default value
const namaLengkap = ref('');
const nim = ref('');
const prodi = ref(''); // Default value

const dataProdi = computed(() => {
    const selectedFakultas = DataFakultas.find(fs => fs.id === fakultas.value);
    return selectedFakultas ? selectedFakultas.prodi : [];
});

// Watcher untuk mereset prodi saat fakultas berubah
watch(fakultas, (newFakultas) => {
    // Reset prodi hanya jika fakultas berubah dan nilai prodi saat ini ada di daftar prodi lama
    prodi.value = '';
});

const handleSubmit = async () => {
    // Pastikan semua field terisi sebelum mengirim
    if (!namaLengkap.value || !nim.value || !fakultas.value || !prodi.value) {
        console.error('Harap lengkapi semua data.');
        return;
    }

    const userData = {
        namaLengkap: namaLengkap.value,
        nim: nim.value,
        fakultas: fakultas.value,
        prodi: prodi.value, // Pastikan prodi.value adalah string id
    };

    const { data, pending, error } = await useUserDetailsPost(userData);
};
</script>

<style>

</style>