<template>
  <div class="space-y-8">
    <!-- HEADER -->
    <header
      class="flex flex-col gap-3 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-5 py-4 text-white sm:flex-row sm:items-center sm:justify-between"
    >
      <div>
        <h1 class="text-2xl font-semibold tracking-tight">
          Pengaturan Upload & File Handling
        </h1>
        <p class="mt-1 text-sm text-slate-200/90">
          Atur batasan upload, tipe file yang diizinkan, dan penyimpanan file aplikasi.
        </p>
      </div>

      <div class="flex items-center gap-2">
        <button
          type="button"
          class="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-100 hover:bg-white/10"
          @click="resetToDefault"
        >
          <Icon name="lucide:rotate-ccw" class="h-4 w-4" />
          Reset ke Default
        </button>
        <button
          type="button"
          class="inline-flex items-center gap-2 rounded-lg border border-emerald-400/50 bg-emerald-400 px-3 py-1.5 text-xs font-medium text-emerald-950 shadow-sm hover:bg-emerald-300 disabled:opacity-60"
          :disabled="saving"
          @click="handleSave"
        >
          <Icon
            v-if="!saving"
            name="lucide:save"
            class="h-4 w-4"
          />
          <Icon
            v-else
            name="lucide:loader-2"
            class="h-4 w-4 animate-spin"
          />
          {{ saving ? 'Menyimpan...' : 'Simpan Pengaturan' }}
        </button>
      </div>
    </header>

    <!-- MAIN GRID -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
      <!-- LEFT: FORM SECTIONS -->
      <div class="space-y-6">
        <!-- Storage Driver -->
        <section class="card rounded-2xl border border-slate-200 bg-white/95 p-5 shadow-sm">
          <div class="mb-4 flex items-start justify-between gap-3">
            <div>
              <h2 class="text-sm font-semibold text-slate-900">
                Lokasi Penyimpanan File
              </h2>
              <p class="mt-1 text-xs text-slate-500">
                Pilih media penyimpanan utama untuk file yang diupload (logo, soal, bukti pembayaran, dll).
              </p>
            </div>
          </div>

          <div class="grid grid-cols-1 gap-4 md:grid-cols-3 text-xs">
            <div class="md:col-span-3 flex flex-wrap gap-3">
              <button
                type="button"
                class="inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-[11px] font-medium"
                :class="form.storageDriver === 'local'
                  ? 'border-slate-900 bg-slate-900 text-slate-50'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'"
                @click="form.storageDriver = 'local'"
              >
                <Icon name="lucide:hdd" class="h-4 w-4" />
                Local (Server)
              </button>
              <button
                type="button"
                class="inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-[11px] font-medium"
                :class="form.storageDriver === 's3'
                  ? 'border-slate-900 bg-slate-900 text-slate-50'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'"
                @click="form.storageDriver = 's3'"
              >
                <Icon name="lucide:cloud" class="h-4 w-4" />
                Object Storage (S3 Compatible)
              </button>
              <button
                type="button"
                class="inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-[11px] font-medium"
                :class="form.storageDriver === 'custom'
                  ? 'border-slate-900 bg-slate-900 text-slate-50'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'"
                @click="form.storageDriver = 'custom'"
              >
                <Icon name="lucide:settings-2" class="h-4 w-4" />
                Custom / Lainnya
              </button>
            </div>

            <!-- Local settings -->
            <div
              v-if="form.storageDriver === 'local'"
              class="md:col-span-3 grid grid-cols-1 gap-4 md:grid-cols-2"
            >
              <div>
                <label class="mb-1 block font-medium text-slate-700">
                  Root Folder Upload
                </label>
                <input
                  v-model="form.localRoot"
                  type="text"
                  class="input w-full rounded-lg border-slate-200 text-sm font-mono"
                  placeholder="/var/www/app/uploads"
                />
                <p class="mt-1 text-[11px] text-slate-500">
                  Lokasi folder di server untuk menyimpan semua file upload.
                </p>
              </div>
              <div>
                <label class="mb-1 block font-medium text-slate-700">
                  URL Base File
                </label>
                <input
                  v-model="form.localBaseUrl"
                  type="text"
                  class="input w-full rounded-lg border-slate-200 text-sm"
                  placeholder="https://app-domain.com/uploads"
                />
                <p class="mt-1 text-[11px] text-slate-500">
                  URL publik untuk mengakses file (misal untuk tampilan logo / bukti pembayaran).
                </p>
              </div>
            </div>

            <!-- S3 settings -->
            <div
              v-else-if="form.storageDriver === 's3'"
              class="md:col-span-3 grid grid-cols-1 gap-4 md:grid-cols-2"
            >
              <div>
                <label class="mb-1 block font-medium text-slate-700">
                  S3 Bucket
                </label>
                <input
                  v-model="form.s3Bucket"
                  type="text"
                  class="input w-full rounded-lg border-slate-200 text-sm"
                  placeholder="contoh-bucket"
                />
              </div>
              <div>
                <label class="mb-1 block font-medium text-slate-700">
                  Region
                </label>
                <input
                  v-model="form.s3Region"
                  type="text"
                  class="input w-full rounded-lg border-slate-200 text-sm"
                  placeholder="ap-southeast-1"
                />
              </div>
              <div>
                <label class="mb-1 block font-medium text-slate-700">
                  Access Key
                </label>
                <input
                  v-model="form.s3AccessKey"
                  type="text"
                  class="input w-full rounded-lg border-slate-200 text-sm"
                  placeholder="AKIA..."
                />
              </div>
              <div>
                <label class="mb-1 block font-medium text-slate-700">
                  Secret Key
                </label>
                <input
                  v-model="form.s3SecretKey"
                  type="password"
                  class="input w-full rounded-lg border-slate-200 text-sm"
                  placeholder="••••••••"
                />
              </div>
              <div class="md:col-span-2">
                <label class="mb-1 block font-medium text-slate-700">
                  Base URL CDN (Opsional)
                </label>
                <input
                  v-model="form.s3BaseUrl"
                  type="text"
                  class="input w-full rounded-lg border-slate-200 text-sm"
                  placeholder="https://cdn.domain.com"
                />
                <p class="mt-1 text-[11px] text-slate-500">
                  Jika menggunakan CDN, URL ini akan digunakan untuk mengakses file di aplikasi.
                </p>
              </div>
            </div>

            <!-- Custom placeholder -->
            <div
              v-else
              class="md:col-span-3"
            >
              <p class="text-xs text-slate-500">
                Mode <span class="font-mono">Custom</span> dapat digunakan untuk integrasi dengan storage lain
                (misalnya Google Drive, MinIO, dsb.). Implementasi detail bisa ditambahkan di backend.
              </p>
            </div>
          </div>
        </section>

        <!-- Upload Rules -->
        <section class="card rounded-2xl border border-slate-200 bg-white/95 p-5 shadow-sm">
          <div class="mb-4 flex items-start justify-between gap-3">
            <div>
              <h2 class="text-sm font-semibold text-slate-900">
                Batasan Upload & Validasi
              </h2>
              <p class="mt-1 text-xs text-slate-500">
                Kontrol jenis file apa saja yang boleh diupload dan batas ukuran file.
              </p>
            </div>
          </div>

          <div class="grid grid-cols-1 gap-4 md:grid-cols-3 text-xs">
            <div>
              <label class="mb-1 block font-medium text-slate-700">
                Maksimal Ukuran File
              </label>
              <div class="flex items-center gap-2">
                <input
                  v-model.number="form.maxUploadMb"
                  type="number"
                  min="1"
                  class="input w-full rounded-lg border-slate-200 text-sm"
                  placeholder="5"
                />
                <span class="text-[11px] text-slate-500">
                  MB
                </span>
              </div>
              <p class="mt-1 text-[11px] text-slate-500">
                Pastikan nilainya tidak melebihi batas <code>php.ini</code> / server.
              </p>
            </div>

            <div class="md:col-span-2">
              <label class="mb-1 block font-medium text-slate-700">
                Tipe Gambar yang Diizinkan
              </label>
              <input
                v-model="form.allowedImageTypes"
                type="text"
                class="input w-full rounded-lg border-slate-200 text-sm font-mono"
                placeholder="jpg, jpeg, png, webp"
              />
              <p class="mt-1 text-[11px] text-slate-500">
                Pisahkan dengan koma. Contoh: <code>jpg, jpeg, png, webp</code>.
              </p>
            </div>

            <div class="md:col-span-3">
              <label class="mb-1 block font-medium text-slate-700">
                Tipe Dokumen yang Diizinkan
              </label>
              <input
                v-model="form.allowedDocTypes"
                type="text"
                class="input w-full rounded-lg border-slate-200 text-sm font-mono"
                placeholder="pdf, doc, docx"
              />
              <p class="mt-1 text-[11px] text-slate-500">
                Contoh: <code>pdf, doc, docx, xls, xlsx</code>.
              </p>
            </div>

            <div class="md:col-span-3">
              <label class="mb-1 block font-medium text-slate-700">
                Penamaan File
              </label>
              <div class="flex flex-wrap gap-3 text-[11px]">
                <label class="inline-flex items-center gap-2">
                  <input
                    type="radio"
                    class="h-3.5 w-3.5 rounded border-slate-300 text-slate-900"
                    value="slug"
                    v-model="form.filenameStrategy"
                  />
                  <span>Gunakan slug + ID unik (direkomendasikan)</span>
                </label>
                <label class="inline-flex items-center gap-2">
                  <input
                    type="radio"
                    class="h-3.5 w-3.5 rounded border-slate-300 text-slate-900"
                    value="original"
                    v-model="form.filenameStrategy"
                  />
                  <span>Pertahankan nama file asli (bisa konflik)</span>
                </label>
              </div>
            </div>
          </div>
        </section>

        <!-- Image Processing & Temp -->
        <section class="card rounded-2xl border border-slate-200 bg-white/95 p-5 shadow-sm">
          <div class="mb-4 flex items-start justify-between gap-3">
            <div>
              <h2 class="text-sm font-semibold text-slate-900">
                Pengolahan Gambar & File Sementara
              </h2>
              <p class="mt-1 text-xs text-slate-500">
                Atur pembuatan thumbnail, optimasi gambar, dan pembersihan file sementara.
              </p>
            </div>
          </div>

          <div class="grid grid-cols-1 gap-4 md:grid-cols-3 text-xs">
            <div class="md:col-span-2 space-y-3">
              <div class="flex items-start justify-between gap-3">
                <div>
                  <p class="text-xs font-medium text-slate-800">
                    Generate Thumbnail Otomatis
                  </p>
                  <p class="mt-1 text-[11px] text-slate-500">
                    Membuat versi kecil dari gambar (misal untuk list peserta / bukti pembayaran).
                  </p>
                </div>
                <button
                  type="button"
                  class="inline-flex items-center gap-2 text-xs"
                  @click="form.generateThumbnails = !form.generateThumbnails"
                >
                  <span class="text-slate-500">
                    {{ form.generateThumbnails ? 'Aktif' : 'Nonaktif' }}
                  </span>
                  <span
                    class="flex h-5 w-9 items-center rounded-full transition"
                    :class="form.generateThumbnails ? 'bg-emerald-500/80' : 'bg-slate-300'"
                  >
                    <span
                      class="h-4 w-4 rounded-full bg-white shadow transition-transform"
                      :class="form.generateThumbnails ? 'translate-x-4' : 'translate-x-0.5'"
                    />
                  </span>
                </button>
              </div>

              <div
                class="grid grid-cols-1 gap-3 md:grid-cols-2"
                :class="!form.generateThumbnails && 'opacity-60 pointer-events-none'"
              >
                <div>
                  <label class="mb-1 block font-medium text-slate-700">
                    Ukuran Thumbnail
                  </label>
                  <input
                    v-model="form.thumbnailSizes"
                    type="text"
                    class="input w-full rounded-lg border-slate-200 text-sm font-mono"
                    placeholder="200x200, 400x400"
                  />
                  <p class="mt-1 text-[11px] text-slate-500">
                    Contoh: <code>200x200, 400x400</code> (lebar x tinggi dalam piksel).
                  </p>
                </div>

                <div>
                  <label class="mb-1 block font-medium text-slate-700">
                    Format Output
                  </label>
                  <select
                    v-model="form.thumbnailFormat"
                    class="input w-full rounded-lg border-slate-200 text-sm"
                  >
                    <option value="auto">Ikuti format asli</option>
                    <option value="webp">WebP (lebih hemat)</option>
                    <option value="jpeg">JPEG</option>
                  </select>
                </div>
              </div>

              <div class="flex items-start justify-between gap-3">
                <div>
                  <p class="text-xs font-medium text-slate-800">
                    Optimasi Gambar
                  </p>
                  <p class="mt-1 text-[11px] text-slate-500">
                    Mengurangi ukuran file gambar tanpa mengorbankan kualitas secara signifikan.
                  </p>
                </div>
                <button
                  type="button"
                  class="inline-flex items-center gap-2 text-xs"
                  @click="form.optimizeImages = !form.optimizeImages"
                >
                  <span class="text-slate-500">
                    {{ form.optimizeImages ? 'Aktif' : 'Nonaktif' }}
                  </span>
                  <span
                    class="flex h-5 w-9 items-center rounded-full transition"
                    :class="form.optimizeImages ? 'bg-emerald-500/80' : 'bg-slate-300'"
                  >
                    <span
                      class="h-4 w-4 rounded-full bg-white shadow transition-transform"
                      :class="form.optimizeImages ? 'translate-x-4' : 'translate-x-0.5'"
                    />
                  </span>
                </button>
              </div>
            </div>

            <div class="space-y-3">
              <div>
                <label class="mb-1 block font-medium text-slate-700">
                  Auto Hapus File Sementara
                </label>
                <div class="flex items-center gap-2">
                  <input
                    v-model="form.autoDeleteTemp"
                    type="checkbox"
                    class="h-3.5 w-3.5 rounded border-slate-300 text-slate-900"
                  />
                  <span class="text-[11px] text-slate-600">
                    Bersihkan folder temporary secara otomatis
                  </span>
                </div>
              </div>

              <div
                :class="!form.autoDeleteTemp && 'opacity-60 pointer-events-none'"
              >
                <label class="mb-1 block font-medium text-slate-700">
                  Retensi File Temp
                </label>
                <div class="flex items-center gap-2">
                  <input
                    v-model.number="form.tempRetentionDays"
                    type="number"
                    min="1"
                    class="input w-full rounded-lg border-slate-200 text-sm"
                    placeholder="7"
                  />
                  <span class="text-[11px] text-slate-500">
                    hari
                  </span>
                </div>
                <p class="mt-1 text-[11px] text-slate-500">
                  File di folder temporary yang lebih lama dari ini akan dihapus.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <!-- RIGHT: PREVIEW & SUMMARY -->
      <aside class="space-y-4">
        <section class="card rounded-2xl border border-slate-200 bg-slate-50/80 p-5 shadow-sm">
          <h3 class="text-sm font-semibold text-slate-900">
            Ringkasan Konfigurasi
          </h3>
          <p class="mt-1 text-xs text-slate-500">
            Gambaran singkat perilaku upload berdasarkan pengaturan di sebelah kiri.
          </p>

          <div class="mt-4 space-y-3 text-xs text-slate-700">
            <div class="flex items-start justify-between gap-3">
              <div>
                <p class="font-medium">Storage</p>
                <p class="text-[11px] text-slate-500">
                  {{ storageSummary }}
                </p>
              </div>
              <span class="rounded-full bg-slate-900/90 px-2 py-0.5 text-[11px] font-medium text-slate-50">
                {{ form.storageDriver.toUpperCase() }}
              </span>
            </div>

            <div class="flex items-start justify-between gap-3">
              <div>
                <p class="font-medium">Batas & Tipe File</p>
                <p class="text-[11px] text-slate-500">
                  Max {{ form.maxUploadMb }} MB • Gambar: {{ form.allowedImageTypes }} • Dokumen: {{ form.allowedDocTypes }}
                </p>
              </div>
            </div>

            <div class="flex items-start justify-between gap-3">
              <div>
                <p class="font-medium">Pengolahan Gambar</p>
                <p class="text-[11px] text-slate-500">
                  {{ imageSummary }}
                </p>
              </div>
            </div>

            <div class="flex items-start justify-between gap-3">
              <div>
                <p class="font-medium">File Sementara</p>
                <p class="text-[11px] text-slate-500">
                  {{ tempSummary }}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section class="card rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 class="text-sm font-semibold text-slate-900">
            Rekomendasi Praktik Baik
          </h3>
          <p class="mt-1 text-xs text-slate-500">
            Catatan singkat untuk membantu menjaga storage tetap aman dan efisien (dummy, bisa dihubungkan ke dokumentasi nantinya).
          </p>

          <ul class="mt-3 space-y-2 text-xs text-slate-600">
            <li class="flex items-start gap-2">
              <span class="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
              <span>
                Gunakan <span class="font-mono">slug + ID</span> untuk penamaan file agar menghindari konflik nama.
              </span>
            </li>
            <li class="flex items-start gap-2">
              <span class="mt-1 h-1.5 w-1.5 rounded-full bg-slate-400"></span>
              <span>
                Pantau ukuran folder upload dan atur retensi file temporary untuk menghemat storage.
              </span>
            </li>
            <li class="flex items-start gap-2">
              <span class="mt-1 h-1.5 w-1.5 rounded-full bg-amber-400"></span>
              <span>
                Bila nanti ada integrasi virus scanning atau content moderation, pengaturan ini bisa diperluas di bagian ini.
              </span>
            </li>
          </ul>
        </section>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue';
import { useNotification } from '@/composables/useNotification';

definePageMeta({
  title: 'Upload Settings - Admin Panel',
  layout: 'admin',
});

const { showNotification } = useNotification?.() || { showNotification: () => {} };

const saving = ref(false);

const defaultForm = () => ({
  storageDriver: 'local', // local | s3 | custom
  localRoot: '/var/www/app/uploads',
  localBaseUrl: 'https://app-domain.com/uploads',

  s3Bucket: '',
  s3Region: 'ap-southeast-1',
  s3AccessKey: '',
  s3SecretKey: '',
  s3BaseUrl: '',

  maxUploadMb: 5,
  allowedImageTypes: 'jpg, jpeg, png, webp',
  allowedDocTypes: 'pdf, doc, docx',

  filenameStrategy: 'slug', // slug | original

  generateThumbnails: true,
  thumbnailSizes: '200x200, 400x400',
  thumbnailFormat: 'auto',
  optimizeImages: true,

  autoDeleteTemp: true,
  tempRetentionDays: 7,
});

const form = reactive(defaultForm());

const storageSummary = computed(() => {
  if (form.storageDriver === 'local') {
    return `Local folder: ${form.localRoot || '-'}, URL base: ${form.localBaseUrl || '-'}`;
  }
  if (form.storageDriver === 's3') {
    return `Bucket: ${form.s3Bucket || '-'} • Region: ${form.s3Region || '-'}`;
  }
  return 'Mode custom: integrasi storage bisa diatur di backend.';
});

const imageSummary = computed(() => {
  const thumb = form.generateThumbnails
    ? `Thumbnail: ${form.thumbnailSizes || 'default'}, format ${form.thumbnailFormat}`
    : 'Thumbnail: tidak dibuat';
  const opt = form.optimizeImages ? 'Optimasi gambar aktif.' : 'Optimasi gambar nonaktif.';
  return `${thumb} • ${opt}`;
});

const tempSummary = computed(() => {
  if (!form.autoDeleteTemp) {
    return 'Pembersihan otomatis nonaktif. File temporary akan menumpuk jika tidak dibersihkan manual.';
  }
  return `File temporary akan dihapus otomatis setelah ${form.tempRetentionDays} hari.`;
});

const handleSave = async () => {
  if (saving.value) return;
  saving.value = true;
  try {
    // TODO: kirim ke API (next update)
    console.log('Saving upload settings', { ...form });
    await new Promise((resolve) => setTimeout(resolve, 700));
    showNotification?.('Pengaturan upload & file handling disimpan (dummy).', 'success');
  } catch (e) {
    showNotification?.('Gagal menyimpan pengaturan upload.', 'error');
  } finally {
    saving.value = false;
  }
};

const resetToDefault = () => {
  Object.assign(form, defaultForm());
  showNotification?.('Pengaturan upload dikembalikan ke default (hanya di UI).', 'info');
};
</script>
