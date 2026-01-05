<template>
  <div class="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 select-none"
       @contextmenu.prevent="handleActionDetected">
    <h1 class="text-3xl font-bold text-gray-800 mb-6 text-center">Aplikasi Ujian</h1>
    <p class="text-lg text-gray-600 text-center max-w-xl">
      Selamat datang di aplikasi ujian. Untuk menjaga integritas ujian, beberapa fungsi telah dinonaktifkan.
      Mohon fokus pada ujian Anda.
    </p>
    <!-- Tombol untuk masuk mode layar penuh -->
    <button @click="requestFullscreen"
            class="mt-8 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75 transition-colors duration-200">
      Mulai Ujian (Masuk Layar Penuh)
    </button>

    <!-- Tombol untuk keluar mode layar penuh (hanya terlihat saat fullscreen) -->
    <button v-if="isFullscreen" @click="exitFullscreen"
            class="fixed bottom-4 right-4 px-4 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75 transition-colors duration-200 z-40">
      Keluar Layar Penuh
    </button>

    <!-- Popup Peringatan -->
    <div v-if="showPopup" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
      <div class="bg-white p-8 rounded-lg shadow-2xl text-center max-w-sm w-full transform transition-all duration-300 scale-105">
        <svg class="mx-auto mb-4 h-16 w-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
        </svg>
        <h2 class="text-2xl font-bold text-gray-800 mb-3">Tindakan Tidak Diizinkan!</h2>
        <p class="text-gray-700 mb-6">
          Fungsi ini telah dinonaktifkan untuk mencegah kecurangan. Harap kembali fokus pada ujian.
        </p>
        <p> Anda telah Meninggalkan Tab atau Aplikasi selama {{ lastHiddenDurationMinutes }} menit {{ lastHiddenDurationSeconds }} detik</p>
        <button @click="closePopup"
                class="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition-colors duration-200">
          Oke, Saya Mengerti
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
const config = useRuntimeConfig();

console.log(config.test);
// State untuk mengontrol visibilitas popup
const showPopup = ref(false);
// Timestamp saat dokumen terakhir kali tidak terlihat (hidden)
const lastHiddenTime = ref(0);
// Total durasi dokumen tidak terlihat (dalam milidetik)
const totalHiddenDuration = ref(0);
// Durasi terakhir kali tersembunyi dalam menit dan detik
const lastHiddenDurationMinutes = ref(0);
const lastHiddenDurationSeconds = ref(0);
// State untuk melacak apakah aplikasi dalam mode layar penuh
const isFullscreen = ref(false);

// Fungsi untuk menampilkan popup
const handleActionDetected = () => {
  showPopup.value = true;
  // Anda bisa menambahkan logika lain di sini, seperti mengirim log ke server
  console.warn("Tindakan tidak diizinkan terdeteksi!");
};

// Fungsi untuk menutup popup
const closePopup = () => {
  showPopup.value = false;
};

// Fungsi untuk menonaktifkan pintasan keyboard developer tools
const disableDeveloperTools = (event) => {
  // F12
  console.log(event.keyCode  + " - mode layar penuh: " + isFullscreen.value);
  if (event.keyCode === 123) {
    handleActionDetected();
    event.preventDefault();
  }
  // disable CTRL+P
  if (event.ctrlKey && event.keyCode === 80) {
    handleActionDetected();
    event.preventDefault();
  }
  // Ctrl+Shift+I (Cmd+Option+I di Mac)
  if (event.ctrlKey && event.shiftKey && event.keyCode === 73) {
    handleActionDetected();
    event.preventDefault();
  }
  // Ctrl+Shift+J (Cmd+Option+J di Mac)
  if (event.ctrlKey && event.shiftKey && event.keyCode === 74) {
    handleActionDetected();
    event.preventDefault();
  }
  // Ctrl+U (View Source)
  if (event.ctrlKey && event.keyCode === 85) {
    handleActionDetected();
    event.preventDefault();
  }
  // Untuk Windows: Ctrl+Shift+C (untuk membuka console)
  if (event.ctrlKey && event.shiftKey && event.keyCode === 67) {
    handleActionDetected();
    event.preventDefault();
  }
  // Untuk macOS: Cmd+Option+C (untuk membuka console)
  if (event.metaKey && event.altKey && event.keyCode === 67) {
    handleActionDetected();
    event.preventDefault();
  }
  // Untuk macOS: Cmd+Shift+C (untuk inspect element)
  if (event.metaKey && event.shiftKey && event.keyCode === 67) {
    handleActionDetected();
    event.preventDefault();
  }
  // Tombol Esc (keyCode 27) saat dalam mode layar penuh
  if (event.keyCode === 27 && isFullscreen.value) {
    showPopup.value = true;
    console.warn("Attempted to exit fullscreen with Esc key!");
  }
};

// Fungsi untuk meminta mode layar penuh
const requestFullscreen = async () => {
  try {
    const element = document.documentElement; // Elemen yang akan masuk layar penuh

    if (element.requestFullscreen) {
      await element.requestFullscreen();
    } else if (element.mozRequestFullScreen) { /* Firefox */
      await element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
      await element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) { /* IE/Edge */
      await element.msRequestFullscreen();
    } else {
      console.warn("Browser tidak mendukung Fullscreen API.");
      handleActionDetected(); // Beri tahu pengguna jika tidak didukung
      return; // Keluar dari fungsi jika tidak didukung
    }
    console.log("Aplikasi masuk mode layar penuh.");
    // isFullscreen.value akan diperbarui oleh event listener 'fullscreenchange'
  } catch (error) {
    console.error("Gagal masuk mode layar penuh:", error);
    handleActionDetected(); // Tampilkan popup jika gagal
  }
};

// Fungsi untuk keluar dari mode layar penuh
const exitFullscreen = async () => {
  try {
    if (document.exitFullscreen) {
      await document.exitFullscreen();
    } else if (document.mozCancelFullScreen) { /* Firefox */
      await document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
      await document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { /* IE/Edge */
      await document.msExitFullscreen();
    } else {
      console.warn("Browser tidak mendukung Fullscreen API untuk keluar.");
      handleActionDetected(); // Beri tahu pengguna jika tidak didukung
      return;
    }
    console.log("Aplikasi keluar mode layar penuh.");
    // isFullscreen.value akan diperbarui oleh event listener 'fullscreenchange'
  } catch (error) {
    console.error("Gagal keluar mode layar penuh:", error);
    handleActionDetected(); // Tampilkan popup jika gagal
  }
};

// Fungsi untuk melacak perubahan status layar penuh
const handleFullscreenChange = () => {
  // document.fullscreenElement akan bernilai null jika tidak dalam mode layar penuh
  // atau elemen yang sedang dalam mode layar penuh
  isFullscreen.value = !!document.fullscreenElement;

  if (!isFullscreen.value) {
    // Jika keluar dari layar penuh tanpa melalui tombol 'Keluar Layar Penuh'
    // Ini bisa berarti pengguna menekan Esc (jika tidak berhasil dicegah)
    // atau menggunakan cara lain dari browser.
    console.warn("Aplikasi keluar dari mode layar penuh secara tidak terduga!");
    // Anda bisa menambahkan logika penalti di sini, seperti mengakhiri ujian
    // atau menampilkan peringatan keras.
  }
};

// const handleVisibilityChange = () => {
//       if (document.hidden) {
//         // Tab atau aplikasi tidak aktif
//         showPopup.value = true;
//         // Anda juga bisa menambahkan logika untuk menjeda timer ujian, atau mengirim notifikasi ke server
//         console.warn("User switched tab/app!");
//       } else {
//         // Tab atau aplikasi kembali aktif
//         // this.showPopup = false; // Anda bisa memutuskan untuk menutup popup secara otomatis atau tidak
//       }
//     }

// Fungsi untuk mendeteksi perubahan visibilitas tab/aplikasi
const handleVisibilityChange = () => {
  if (document.hidden) {
    // Tab atau aplikasi tidak aktif
    lastHiddenTime.value = Date.now(); // Catat waktu saat tab tersembunyi
    handleActionDetected(); // Tampilkan popup peringatan
    console.warn("User switched tab/app!");
  } else {
    // Tab atau aplikasi kembali aktif
    if (lastHiddenTime.value !== 0) {
      const durationMs = Date.now() - lastHiddenTime.value; // Hitung durasi tersembunyi dalam milidetik
      totalHiddenDuration.value += durationMs; // Tambahkan ke total durasi

      // Konversi durasi ke menit dan detik
      const seconds = Math.floor(durationMs / 1000);
      lastHiddenDurationMinutes.value = Math.floor(seconds / 60);
      lastHiddenDurationSeconds.value = seconds % 60;

      console.log(`Tab was hidden for: ${lastHiddenDurationMinutes.value} minutes and ${lastHiddenDurationSeconds.value} seconds.`);
      console.log(`Total hidden duration: ${totalHiddenDuration.value / 1000} seconds.`);
      lastHiddenTime.value = 0; // Reset last hidden time
    }
  }
};
// Lifecycle hook: Saat komponen di-mount ke DOM
onMounted(() => {
  // Menambahkan event listener untuk keyboard
  document.addEventListener('keydown', disableDeveloperTools);
  document.addEventListener('visibilitychange', handleVisibilityChange); // Tambahkan ini
    // Menambahkan event listener untuk perubahan status layar penuh
  document.addEventListener('fullscreenchange', handleFullscreenChange);
  document.addEventListener('mozfullscreenchange', handleFullscreenChange); // Firefox
  document.addEventListener('webkitfullscreenchange', handleFullscreenChange); // Chrome, Safari
  document.addEventListener('msfullscreenchange', handleFullscreenChange); // IE/Edge
});

// Lifecycle hook: Saat komponen akan dihancurkan dari DOM
onBeforeUnmount(() => {
  // Menghapus event listener untuk mencegah memory leaks
  document.removeEventListener('keydown', disableDeveloperTools);
  document.removeEventListener('visibilitychange', handleVisibilityChange); // Hapus ini
    document.removeEventListener('fullscreenchange', handleFullscreenChange);
  document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
  document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
  document.removeEventListener('msfullscreenchange', handleFullscreenChange);
});
</script>

<style scoped>
/* Dalam file CSS atau di bagian style komponen Anda */
@media print {
  body * {
    visibility: hidden; /* Sembunyikan semua elemen saat dicetak */
  }
  body:after {
    content: "Pencetakan tidak diizinkan untuk ujian ini.";
    visibility: visible;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 2em;
    color: red;
    text-align: center;
  }
}
</style>
