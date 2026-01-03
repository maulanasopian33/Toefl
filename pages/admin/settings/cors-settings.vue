<template>
  <div class="space-y-8">
    <!-- HEADER -->
    <header
      class="flex flex-col gap-3 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-5 py-4 text-white sm:flex-row sm:items-center sm:justify-between"
    >
      <div>
        <h1 class="text-2xl font-semibold tracking-tight">
          Pengaturan CORS Whitelist
        </h1>
        <p class="mt-1 text-sm text-slate-200/90">
          Atur daftar origin yang diizinkan mengakses API aplikasi ini melalui browser.
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
      <!-- LEFT: FORM -->
      <div class="space-y-6">
        <!-- Global CORS toggle + environment -->
        <section class="card rounded-2xl border border-slate-200 bg-white/95 p-5 shadow-sm">
          <div class="mb-4 flex items-start justify-between gap-3">
            <div>
              <h2 class="text-sm font-semibold text-slate-900">
                Mode & Lingkungan CORS
              </h2>
              <p class="mt-1 text-xs text-slate-500">
                Aktifkan CORS dan pilih environment yang ingin Anda atur (dummy untuk dokumentasi & future update).
              </p>
            </div>

            <button
              type="button"
              class="inline-flex items-center gap-2 text-xs"
              @click="form.enabled = !form.enabled"
            >
              <span class="text-slate-500">
                {{ form.enabled ? 'Aktif' : 'Nonaktif' }}
              </span>
              <span
                class="flex h-5 w-9 items-center rounded-full transition"
                :class="form.enabled ? 'bg-emerald-500/80' : 'bg-slate-500/70'"
              >
                <span
                  class="h-4 w-4 rounded-full bg-white shadow transition-transform"
                  :class="form.enabled ? 'translate-x-4' : 'translate-x-0.5'"
                />
              </span>
            </button>
          </div>

          <div class="grid grid-cols-1 gap-4 text-xs md:grid-cols-3">
            <div>
              <p class="mb-1 block font-medium text-slate-700">
                Environment
              </p>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="env in envOptions"
                  :key="env.value"
                  type="button"
                  class="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium"
                  :class="form.environment === env.value
                    ? 'border-slate-900 bg-slate-900 text-slate-50'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'"
                  @click="form.environment = env.value"
                >
                  <span class="h-1.5 w-1.5 rounded-full" :class="env.dotClass" />
                  {{ env.label }}
                </button>
              </div>
              <p class="mt-1 text-[11px] text-slate-500">
                Pengaturan ini dapat digunakan sebagai referensi mapping ke konfigurasi backend per-environment.
              </p>
            </div>

            <div>
              <label class="mb-1 block font-medium text-slate-700">
                Izinkan Kredensial
              </label>
              <div class="flex items-center gap-2">
                <input
                  v-model="form.allowCredentials"
                  type="checkbox"
                  class="h-3.5 w-3.5 rounded border-slate-300 text-slate-900"
                />
                <span class="text-[11px] text-slate-600">
                  Izinkan cookie / Authorization header dikirim.
                </span>
              </div>
            </div>

            <div>
              <label class="mb-1 block font-medium text-slate-700">
                Max Age (preflight)
              </label>
              <div class="flex items-center gap-2">
                <input
                  v-model.number="form.maxAge"
                  type="number"
                  min="0"
                  class="input w-full rounded-lg border-slate-200 text-sm"
                  placeholder="600"
                />
                <span class="text-[11px] text-slate-500">
                  detik
                </span>
              </div>
              <p class="mt-1 text-[11px] text-slate-500">
                Lama (dalam detik) browser menyimpan hasil preflight OPTIONS.
              </p>
            </div>
          </div>
        </section>

        <!-- Origins -->
        <section class="card rounded-2xl border border-slate-200 bg-white/95 p-5 shadow-sm">
          <div class="mb-4 flex items-start justify-between gap-3">
            <div>
              <h2 class="text-sm font-semibold text-slate-900">
                Daftar Origin yang Diizinkan
              </h2>
              <p class="mt-1 text-xs text-slate-500">
                Origin adalah kombinasi <code>protocol + domain + port</code>, misalnya
                <span class="font-mono text-[11px]">https://app.domain.com</span>.
              </p>
            </div>
          </div>

          <div
            class="space-y-4"
            :class="!form.enabled && 'opacity-60 pointer-events-none'"
          >
            <!-- Add origin form -->
            <div class="flex flex-col gap-2 md:flex-row md:items-center">
              <div class="flex-1">
                <label class="mb-1 block text-xs font-medium text-slate-700">
                  Tambah Origin Baru
                </label>
                <input
                  v-model="newOrigin"
                  type="text"
                  class="input w-full rounded-lg border-slate-200 text-sm font-mono"
                  placeholder="https://frontend-domain.com"
                  @keyup.enter="addOrigin"
                />
              </div>
              <div class="flex items-end gap-2 pt-1 md:pt-6">
                <button
                  type="button"
                  class="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                  @click="addOrigin"
                  :disabled="!newOrigin.trim()"
                >
                  <Icon name="lucide:plus" class="h-3.5 w-3.5" />
                  Tambah
                </button>
                <button
                  type="button"
                  class="inline-flex items-center gap-1.5 rounded-lg border border-slate-100 bg-slate-50 px-3 py-1.5 text-[11px] font-medium text-slate-500 hover:bg-slate-100"
                  @click="addDevExample"
                >
                  Contoh Dev
                </button>
              </div>
            </div>
            <p v-if="originError" class="text-[11px] text-rose-600">
              {{ originError }}
            </p>

            <!-- List origins -->
            <div
              v-if="origins.length"
              class="overflow-hidden rounded-xl border border-slate-200 bg-slate-50/60"
            >
              <div class="border-b border-slate-200 bg-slate-100/80 px-4 py-2.5 text-[11px] font-medium uppercase tracking-wide text-slate-500">
                Origin Terdaftar ({{ origins.length }})
              </div>
              <ul class="divide-y divide-slate-200 bg-white text-xs">
                <li
                  v-for="(origin, index) in origins"
                  :key="origin"
                  class="flex items-center justify-between gap-3 px-4 py-2.5"
                >
                  <div class="flex items-center gap-2">
                    <span class="font-mono text-[11px] text-slate-800">
                      {{ origin }}
                    </span>
                    <span
                      v-if="index === 0"
                      class="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700"
                    >
                      Utama
                    </span>
                  </div>
                  <button
                    type="button"
                    class="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-1 text-[10px] font-medium text-slate-600 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-700"
                    @click="removeOrigin(origin)"
                  >
                    <Icon name="lucide:trash-2" class="h-3 w-3" />
                    Hapus
                  </button>
                </li>
              </ul>
            </div>

            <div v-else class="rounded-xl border border-dashed border-slate-200 bg-slate-50/70 px-4 py-6 text-center text-xs text-slate-500">
              Belum ada origin terdaftar. Tambahkan minimal satu origin (misalnya domain frontend utama).
            </div>
          </div>
        </section>

        <!-- Methods & Headers -->
        <section class="card rounded-2xl border border-slate-200 bg-white/95 p-5 shadow-sm">
          <div class="mb-4 flex items-start justify-between gap-3">
            <div>
              <h2 class="text-sm font-semibold text-slate-900">
                Metode & Header yang Diizinkan
              </h2>
              <p class="mt-1 text-xs text-slate-500">
                Tentukan HTTP method dan header mana yang boleh digunakan oleh origin yang di-whitelist.
              </p>
            </div>
          </div>

          <div
            class="grid grid-cols-1 gap-4 text-xs md:grid-cols-3"
            :class="!form.enabled && 'opacity-60 pointer-events-none'"
          >
            <div class="md:col-span-2">
              <p class="mb-1 text-xs font-medium text-slate-700">
                HTTP Methods
              </p>
              <div class="flex flex-wrap gap-3">
                <label
                  v-for="method in methodOptions"
                  :key="method"
                  class="inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-[11px]"
                  :class="form.allowedMethods.includes(method)
                    ? 'border-slate-900 bg-slate-900 text-slate-50'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'"
                >
                  <input
                    type="checkbox"
                    class="hidden"
                    :value="method"
                    v-model="form.allowedMethods"
                  />
                  <span>{{ method }}</span>
                </label>
              </div>
              <p class="mt-1 text-[11px] text-slate-500">
                Biasanya cukup <code>GET, POST, PUT, DELETE, OPTIONS</code>. Sesuaikan dengan kebutuhan API.
              </p>
            </div>

            <div class="md:col-span-3">
              <label class="mb-1 block font-medium text-slate-700">
                Allowed Headers
              </label>
              <input
                v-model="form.allowedHeaders"
                type="text"
                class="input w-full rounded-lg border-slate-200 text-sm font-mono"
                placeholder="Content-Type, Authorization, X-Requested-With"
              />
              <p class="mt-1 text-[11px] text-slate-500">
                Header yang boleh dikirim dari client. Untuk API modern biasanya butuh <code>Content-Type</code> dan
                <code>Authorization</code>.
              </p>
            </div>
          </div>
        </section>
      </div>

      <!-- RIGHT: SUMMARY & INFO -->
      <aside class="space-y-4">
        <section class="card rounded-2xl border border-slate-200 bg-slate-50/80 p-5 shadow-sm">
          <h3 class="text-sm font-semibold text-slate-900">
            Ringkasan CORS
          </h3>
          <p class="mt-1 text-xs text-slate-500">
            Gambaran singkat bagaimana browser akan melihat aturan CORS dari pengaturan ini.
          </p>

          <div class="mt-4 space-y-3 text-xs text-slate-700">
            <div class="flex items-start justify-between gap-3">
              <div>
                <p class="font-medium">Status</p>
                <p class="text-[11px] text-slate-500">
                  {{ form.enabled ? 'CORS diaktifkan untuk origin yang di-whitelist.' : 'CORS dinonaktifkan (mengikuti konfigurasi default server).' }}
                </p>
              </div>
              <span
                class="rounded-full px-2 py-0.5 text-[11px] font-medium"
                :class="form.enabled ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'"
              >
                {{ form.enabled ? 'Aktif' : 'Nonaktif' }}
              </span>
            </div>

            <div class="flex items-start justify-between gap-3">
              <div>
                <p class="font-medium">Origin</p>
                <p class="text-[11px] text-slate-500">
                  {{ originsSummary }}
                </p>
              </div>
            </div>

            <div class="flex items-start justify-between gap-3">
              <div>
                <p class="font-medium">Methods & Headers</p>
                <p class="text-[11px] text-slate-500">
                  Method: {{ form.allowedMethods.join(', ') || '-' }}<br>
                  Headers: {{ form.allowedHeaders || '-' }}
                </p>
              </div>
            </div>

            <div class="flex items-start justify-between gap-3">
              <div>
                <p class="font-medium">Kredensial & Max Age</p>
                <p class="text-[11px] text-slate-500">
                  Kredensial: {{ form.allowCredentials ? 'diizinkan' : 'tidak diizinkan' }}<br>
                  Max Age: {{ form.maxAge }} detik
                </p>
              </div>
            </div>
          </div>
        </section>

        <section class="card rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 class="text-sm font-semibold text-slate-900">
            Catatan Keamanan
          </h3>
          <p class="mt-1 text-xs text-slate-500">
            Beberapa hal yang perlu diperhatikan saat mengatur CORS:
          </p>

          <ul class="mt-3 space-y-2 text-xs text-slate-600">
            <li class="flex items-start gap-2">
              <span class="mt-1 h-1.5 w-1.5 rounded-full bg-rose-400"></span>
              <span>
                Hindari menggunakan <code>*</code> sebagai origin jika Anda mengizinkan kredensial (cookie / Authorization header).
              </span>
            </li>
            <li class="flex items-start gap-2">
              <span class="mt-1 h-1.5 w-1.5 rounded-full bg-amber-400"></span>
              <span>
                Hanya whitelist origin yang benar-benar perlu mengakses API (misalnya domain frontend resmi).
              </span>
            </li>
            <li class="flex items-start gap-2">
              <span class="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
              <span>
                Untuk aplikasi multi-tenant di masa depan, daftar origin bisa dipecah per organisasi atau per client.
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
  title: 'CORS Whitelist Settings - Admin Panel',
  layout: 'admin',
  middleware: ['auth', 'role-check'],
  permission: "system.cors"
});

const { showNotification } = useNotification?.() || { showNotification: () => {} };

const saving = ref(false);

const envOptions = [
  { value: 'development', label: 'Development', dotClass: 'bg-emerald-400' },
  { value: 'staging', label: 'Staging', dotClass: 'bg-amber-400' },
  { value: 'production', label: 'Production', dotClass: 'bg-sky-400' },
];

const methodOptions = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'];

const defaultForm = () => ({
  enabled: true,
  environment: 'production',
  allowCredentials: true,
  maxAge: 600,
  allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: 'Content-Type, Authorization, X-Requested-With',
});

const form = reactive(defaultForm());

// origins disimpan terpisah biar gampang diubah
const origins = ref([
  'https://app.domain.com',
  'https://admin.domain.com',
]);
const newOrigin = ref('');
const originError = ref('');

const originsSummary = computed(() => {
  if (!origins.value.length) return 'Belum ada origin yang di-whitelist.';
  if (origins.value.length === 1) return `Hanya ${origins.value[0]}`;
  return `${origins.value.length} origin di-whitelist. Utama: ${origins.value[0]}`;
});

const addOrigin = () => {
  originError.value = '';
  const value = newOrigin.value.trim();
  if (!value) return;

  // validasi simpel
  if (!/^https?:\/\/.+/i.test(value)) {
    originError.value = 'Origin harus diawali dengan http:// atau https://';
    return;
  }
  if (origins.value.includes(value)) {
    originError.value = 'Origin sudah terdaftar.';
    return;
  }

  origins.value.push(value);
  newOrigin.value = '';
};

const addDevExample = () => {
  const dev = 'http://localhost:3000';
  if (!origins.value.includes(dev)) {
    origins.value.push(dev);
  }
};

const removeOrigin = (origin) => {
  origins.value = origins.value.filter((o) => o !== origin);
};

const handleSave = async () => {
  if (saving.value) return;
  saving.value = true;
  try {
    // TODO: kirim ke API (next update)
    console.log('Saving CORS settings', {
      ...form,
      origins: origins.value,
    });
    await new Promise((resolve) => setTimeout(resolve, 700));
    showNotification?.('Pengaturan CORS whitelist disimpan (dummy).', 'success');
  } catch (e) {
    showNotification?.('Gagal menyimpan pengaturan CORS.', 'error');
  } finally {
    saving.value = false;
  }
};

const resetToDefault = () => {
  Object.assign(form, defaultForm());
  origins.value = ['https://app.domain.com', 'https://admin.domain.com'];
  newOrigin.value = '';
  originError.value = '';
  showNotification?.('Pengaturan CORS dikembalikan ke default (hanya di UI).', 'info');
};
</script>
