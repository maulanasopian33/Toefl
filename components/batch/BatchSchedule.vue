<template>
  <div class="overflow-hidden rounded-2xl border border-gray-200/80 bg-white p-6 shadow-sm">
    <h3 class="text-lg font-semibold text-gray-800">Alur Pelaksanaan Ujian</h3>
    <div class="mt-5">
      <ol class="relative border-l border-gray-200">
        <li class="mb-8 ml-8">
          <span class="absolute -left-4 flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 ring-8 ring-white">
            <Icon name="lucide:edit-3" class="h-4 w-4" />
          </span>
          <h4 class="mb-1 text-base font-semibold text-gray-900">Pendaftaran & Persiapan</h4>
          <p class="text-sm text-gray-500">
            Pastikan Anda telah terdaftar di batch ini dan melengkapi semua persyaratan. Akses materi belajar yang tersedia untuk persiapan.
          </p>
        </li>
        <li class="mb-8 ml-8">
          <span class="absolute -left-4 flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 ring-8 ring-white">
            <Icon name="lucide:laptop" class="h-4 w-4" />
          </span>
          <h4 class="mb-1 text-base font-semibold text-gray-900">Pelaksanaan Ujian</h4>
          <p class="text-sm text-gray-500">
            Ujian akan tersedia pada tanggal yang ditentukan. Login ke platform dan mulai ujian sesuai jadwal. Pastikan koneksi internet stabil.
          </p>
        </li>
        <li class="ml-8">
          <span class="absolute -left-4 flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 ring-8 ring-white">
            <Icon name="lucide:award" class="h-4 w-4" />
          </span>
          <h4 class="mb-1 text-base font-semibold text-gray-900">Penilaian & Hasil</h4>
          <p class="text-sm text-gray-500">
            Setelah ujian selesai, sistem akan memproses skor Anda. Hasil dan sertifikat akan tersedia di halaman Riwayat Skor Anda.
          </p>
        </li>
      </ol>
    </div>
  </div>
</template>

<style scoped>
/* Tidak ada gaya kustom yang diperlukan. Semua ditangani oleh Tailwind CSS. */
</style>