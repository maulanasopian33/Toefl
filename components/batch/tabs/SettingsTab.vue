<template>
  <div class="card">
    <h3 class="card-title">Pengaturan Batch</h3>
    <p class="text-gray-500 mb-6">
      Konfigurasi lanjutan untuk batch ini.
    </p>

    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700">
          Izinkan Peserta Mengunduh Sertifikat
        </label>
        <input type="checkbox" class="ml-2 rounded text-teal-500 shadow-sm" />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">
          Aktifkan Notifikasi Email
        </label>
        <input type="checkbox" class="ml-2 rounded text-teal-500 shadow-sm" />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">
          Sembunyikan Nama Peserta di Leaderboard
        </label>
        <input type="checkbox" class="ml-2 rounded text-teal-500 shadow-sm" />
      </div>
    </div>
  </div>
</template>

<script setup></script>