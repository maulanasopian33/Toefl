<template>
  <!-- Root element with v-if to wait for settings data -->
  
  <div v-if="form" class="space-y-8">
    <!-- HEADER -->
    <header
      class="flex flex-col gap-3 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-5 py-4 text-white sm:flex-row sm:items-center sm:justify-between"
    >
      <div>
        <h1 class="text-2xl font-semibold tracking-tight">
          Pengaturan Aplikasi
        </h1>
        <p class="mt-1 text-sm text-slate-200/90">
          Atur nama aplikasi, logo, identitas brand, dan preferensi sistem.
        </p>
      </div>

      <div class="flex items-center gap-2">
        <button
          :disabled="isSaving"
          type="button"
          class="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-100 hover:bg-white/10"
          @click="() => fetchSettings()"
        >
          <Icon name="lucide:refresh-cw" class="h-4 w-4" />
          Muat Ulang
        </button>
        <button
          type="button"
          class="inline-flex items-center gap-2 rounded-lg border border-emerald-400/50 bg-emerald-400 px-3 py-1.5 text-xs font-medium text-emerald-950 shadow-sm hover:bg-emerald-300 disabled:opacity-60"
          :disabled="isSaving"
          @click="handleSave"
        >
          <Icon
            v-if="!isSaving"
            name="lucide:save"
            class="h-4 w-4"
          />
          <Icon
            v-else
            name="lucide:loader-2"
            class="h-4 w-4 animate-spin"
          />
          {{ isSaving ? 'Menyimpan...' : 'Simpan Perubahan' }}
        </button>
      </div>
    </header>

    <!-- MAIN GRID -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
      <!-- LEFT: FORM SECTIONS -->
      <div class="space-y-6">
        <!-- General Info -->
        <section class="card rounded-2xl border border-slate-200 bg-white/95 p-5 shadow-sm">
          <div class="mb-4 flex items-start justify-between gap-3">
            <div>
              <h2 class="text-sm font-semibold text-slate-900">Informasi Umum</h2>
              <p class="mt-1 text-xs text-slate-500">
                Nama aplikasi dan informasi dasar yang akan tampil di seluruh sistem.
              </p>
            </div>
          </div>

          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div class="md:col-span-2">
              <label class="mb-1 block text-xs font-medium text-slate-700">
                Nama Aplikasi
              </label>
              <input
                v-model="form.appName"
                type="text"
                class="input w-full rounded-lg border-slate-200"
                placeholder="Contoh: Pusat Pembelajaran Bahasa Arab"
              />
            </div>

            <div>
              <label class="mb-1 block text-xs font-medium text-slate-700">
                Nama Pendek / Brand
              </label>
              <input
                v-model="form.appShortName"
                type="text"
                class="input w-full rounded-lg border-slate-200"
                placeholder="Contoh: QiraApp"
              />
            </div>

            <div>
              <label class="mb-1 block text-xs font-medium text-slate-700">
                Slug / ID Aplikasi
              </label>
              <input
                v-model="form.appSlug"
                type="text"
                class="input w-full rounded-lg border-slate-200 font-mono text-xs"
                placeholder="contoh: qira-app"
              />
            </div>

            <div class="md:col-span-2">
              <label class="mb-1 block text-xs font-medium text-slate-700">
                Tagline
              </label>
              <input
                v-model="form.tagline"
                type="text"
                class="input w-full rounded-lg border-slate-200"
                placeholder="Contoh: Platform ujian bahasa Arab yang simpel dan terukur."
              />
            </div>

            <div class="md:col-span-2">
              <label class="mb-1 block text-xs font-medium text-slate-700">
                Deskripsi Singkat
              </label>
              <textarea
                v-model="form.description"
                rows="3"
                class="input w-full rounded-lg border-slate-200"
                placeholder="Deskripsi ini dapat digunakan untuk meta description, dokumentasi internal, dan lain-lain."
              ></textarea>
            </div>
          </div>
        </section>

        <!-- Branding & Logo -->
        <section class="card rounded-2xl border border-slate-200 bg-white/95 p-5 shadow-sm">
          <div class="mb-4 flex items-start justify-between gap-3">
            <div>
              <h2 class="text-sm font-semibold text-slate-900">Branding & Logo</h2>
              <p class="mt-1 text-xs text-slate-500">
                Atur logo utama, favicon, dan warna utama yang digunakan di dashboard.
              </p>
            </div>
          </div>

          <div class="grid grid-cols-1 gap-6 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
            <!-- Upload -->
            <div class="space-y-4">
              <div>
                <label class="mb-1 block text-xs font-medium text-slate-700">
                  Logo Utama
                </label>
                <div
                  class="flex items-center justify-between gap-4 rounded-lg border border-dashed border-slate-300 bg-slate-50/60 px-4 py-3"
                >
                  <div class="flex items-center gap-3 cursor-pointer" @click="openMediaModal('logo')">
                    <div
                      class="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 text-slate-100 overflow-hidden"
                    >
                      <img v-if="logoPreviewUrl" :src="`${config.public.MEDIA_URL}${logoPreviewUrl}`" alt="Logo Preview" class="h-full w-full object-contain p-1" />
                      <Icon v-else name="lucide:image" class="h-5 w-5" />
                    </div>
                    <div>
                      <p class="text-xs font-medium text-slate-800">
                        Upload logo (.png, .svg)
                      </p>
                      <p class="text-[11px] text-slate-500">
                        Disarankan minimum 200x200px, background transparan.
                      </p>
                    </div>
                  </div>
                  <div class="flex flex-col items-end gap-1">
                    <button
                      type="button"
                      class="inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-[11px] font-medium text-slate-700 hover:bg-slate-50"
                      @click="openMediaModal('logo')"
                    >
                      <Icon name="lucide:upload" class="h-3.5 w-3.5" />
                      Pilih File
                    </button>
                    <!-- <p class="text-[11px] text-slate-400 max-w-[160px] text-right truncate">{{ logoFile?.name || 'Belum ada file' }}</p> -->
                  </div>
                </div>
              </div>

              <div>
                <label class="mb-1 block text-xs font-medium text-slate-700">
                  Favicon
                </label>
                <div
                  class="flex items-center justify-between gap-4 rounded-lg border border-dashed border-slate-300 bg-slate-50/60 px-4 py-3"
                >
                  <div class="flex items-center gap-3 cursor-pointer" @click="openMediaModal('favicon')">
                    <div
                      class="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-slate-100 overflow-hidden"
                    >
                      <img v-if="faviconPreviewUrl" :src="`${config.public.MEDIA_URL}${faviconPreviewUrl}`" alt="Favicon Preview" class="h-full w-full object-contain p-1" />
                      <Icon v-else name="lucide:square-dot" class="h-4 w-4" />
                    </div>
                    <div>
                      <p class="text-xs font-medium text-slate-800">
                        Upload favicon (.ico atau .png 32x32)
                      </p>
                      <p class="text-[11px] text-slate-500">
                        Digunakan di tab browser.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button" @click="openMediaModal('favicon')"
                    class="inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-[11px] font-medium text-slate-700 hover:bg-slate-50" 
                  >
                    <Icon name="lucide:upload" class="h-3.5 w-3.5" />
                    Pilih File
                  </button>
                </div>
              </div>
            </div>

            <!-- Brand Colors -->
            <div class="space-y-4">
              <div>
                <label class="mb-1 block text-xs font-medium text-slate-700">
                  Warna Utama
                </label>
                <div class="flex items-center gap-3">
                  <input
                    v-model="form.primaryColor"
                    type="color"
                    class="h-9 w-10 rounded-md border border-slate-300 bg-white p-0"
                  />
                  <input
                    v-model="form.primaryColor"
                    type="text"
                    class="input w-full rounded-lg border-slate-200 font-mono text-xs"
                    placeholder="#4f46e5"
                  />
                </div>
                <p class="mt-1 text-[11px] text-slate-500">
                  Warna ini dapat digunakan untuk tombol utama, link, dan highlight.
                </p>
              </div>

              <div>
                <label class="mb-1 block text-xs font-medium text-slate-700">
                  Mode Tampilan
                </label>
                <select
                  v-model="form.theme"
                  class="input w-full rounded-lg border-slate-200 text-sm"
                >
                  <option value="system">Ikuti Sistem</option>
                  <option value="light">Selalu Terang</option>
                  <option value="dark">Selalu Gelap</option>
                </select>
                <p class="mt-1 text-[11px] text-slate-500">
                  Mengatur preferensi tema default untuk seluruh pengguna.
                </p>
              </div>
            </div>
          </div>
        </section>

        <!-- Contact / Organization -->
        <section class="card rounded-2xl border border-slate-200 bg-white/95 p-5 shadow-sm">
          <div class="mb-4 flex items-start justify-between gap-3">
            <div>
              <h2 class="text-sm font-semibold text-slate-900">Informasi Organisasi & Kontak</h2>
              <p class="mt-1 text-xs text-slate-500">
                Informasi ini dapat digunakan di footer, email notifikasi, dan halaman publik.
              </p>
            </div>
          </div>

          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label class="mb-1 block text-xs font-medium text-slate-700">
                Nama Organisasi
              </label>
              <input
                v-model="form.organization"
                type="text"
                class="input w-full rounded-lg border-slate-200"
                placeholder="Contoh: Lembaga Bahasa dan Sains Islam"
              />
            </div>

            <div>
              <label class="mb-1 block text-xs font-medium text-slate-700">
                Website
              </label>
              <input
                v-model="form.website"
                type="url"
                class="input w-full rounded-lg border-slate-200"
                placeholder="https://contoh-domain.com"
              />
            </div>

            <div>
              <label class="mb-1 block text-xs font-medium text-slate-700">
                Email Support
              </label>
              <input
                v-model="form.supportEmail"
                type="email"
                class="input w-full rounded-lg border-slate-200"
                placeholder="support@contoh.com"
              />
            </div>

            <div>
              <label class="mb-1 block text-xs font-medium text-slate-700">
                No. Kontak / WhatsApp
              </label>
              <input
                v-model="form.supportPhone"
                type="text"
                class="input w-full rounded-lg border-slate-200"
                placeholder="+62 812 3456 7890"
              />
            </div>
          </div>
        </section>

        <!-- System Preferences -->
        <section class="card rounded-2xl border border-slate-200 bg-white/95 p-5 shadow-sm">
          <div class="mb-4 flex items-start justify-between gap-3">
            <div>
              <h2 class="text-sm font-semibold text-slate-900">Preferensi Sistem</h2>
              <p class="mt-1 text-xs text-slate-500">
                Pengaturan umum seperti bahasa, zona waktu, dan mata uang default.
              </p>
            </div>
          </div>

          <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label class="mb-1 block text-xs font-medium text-slate-700">
                Bahasa Default
              </label>
              <select
                v-model="form.defaultLanguage"
                class="input w-full rounded-lg border-slate-200 text-sm"
              >
                <option value="id">Indonesia</option>
                <option value="en">English</option>
                <option value="ar">العربية (Arab)</option>
              </select>
            </div>

            <div>
              <label class="mb-1 block text-xs font-medium text-slate-700">
                Zona Waktu
              </label>
              <select
                v-model="form.timezone"
                class="input w-full rounded-lg border-slate-200 text-sm"
              >
                <option value="Asia/Jakarta">Asia/Jakarta</option>
                <option value="Asia/Makassar">Asia/Makassar</option>
                <option value="Asia/Jayapura">Asia/Jayapura</option>
              </select>
            </div>

            <div>
              <label class="mb-1 block text-xs font-medium text-slate-700">
                Mata Uang
              </label>
              <select
                v-model="form.currency"
                class="input w-full rounded-lg border-slate-200 text-sm"
              >
                <option value="IDR">IDR - Rupiah</option>
                <option value="USD">USD - Dollar</option>
              </select>
            </div>
          </div>
        </section>
      </div>

      <!-- RIGHT: LIVE PREVIEW -->
      <aside class="space-y-6">
        <section class="card rounded-2xl border border-slate-200 bg-slate-50/80 p-5 shadow-sm sticky top-24">
          <h3 class="text-sm font-semibold text-slate-900">
            Pratinjau Live
          </h3>
          <p class="mt-1 text-xs text-slate-500">
            Beginilah tampilan aplikasi Anda dengan pengaturan saat ini.
          </p>

          <!-- Simulated App Window -->
          <div class="mt-4 rounded-xl border border-slate-300/70 bg-slate-200 shadow-inner overflow-hidden">
            <!-- Window Header -->
            <div class="h-7 bg-slate-100/80 px-3 flex items-center gap-1.5">
              <div class="h-2.5 w-2.5 rounded-full bg-red-400/80"></div>
              <div class="h-2.5 w-2.5 rounded-full bg-amber-400/80"></div>
              <div class="h-2.5 w-2.5 rounded-full bg-emerald-400/80"></div>
            </div>

            <!-- Simulated Browser Tab -->
            <div class="bg-white/70 border-b border-slate-300/70 px-3 py-1.5 flex items-center gap-2">
              <div class="h-5 w-5 flex items-center justify-center">
                <img v-if="faviconPreviewUrl" :src="`${config.public.MEDIA_URL}${faviconPreviewUrl}`" alt="Favicon" class="h-4 w-4 object-contain" />
                <Icon v-else name="lucide:image" class="h-3.5 w-3.5 text-slate-400" />
              </div>
              <p class="text-[11px] font-medium text-slate-700 truncate">
                {{ form.appShortName || form.appName || 'App Name' }}
              </p>
            </div>

            <!-- App Content -->
            <div class="p-4 transition-colors" :class="form.theme === 'dark' ? 'bg-slate-800 text-white' : 'bg-white text-slate-900'">
              <!-- Header -->
              <div class="flex items-center gap-3">
                <div
                  class="flex h-12 w-12 items-center justify-center rounded-xl text-white flex-shrink-0"
                  :style="{ backgroundColor: form.primaryColor || '#0f172a' }"
                >
                  <img v-if="logoPreviewUrl" :src="`${config.public.MEDIA_URL}${logoPreviewUrl}`" alt="Logo preview" class="h-full w-full object-contain p-1.5" />
                  <span v-else class="text-lg font-bold tracking-tighter">
                    {{ appInitials }}
                  </span>
                </div>
                <div class="min-w-0">
                  <p class="truncate text-base font-bold" :class="form.theme === 'dark' ? 'text-white' : 'text-slate-900'">
                    {{ form.appName || 'Nama Aplikasi Anda' }}
                  </p>
                  <p class="truncate text-xs" :class="form.theme === 'dark' ? 'text-slate-400' : 'text-slate-500'">
                    {{ form.tagline || 'Tagline singkat aplikasi.' }}
                  </p>
                </div>
              </div>

              <!-- Body -->
              <div class="mt-5 space-y-2">
                <div class="h-3 w-full rounded-full" :class="form.theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'"></div>
                <div class="h-3 w-4/5 rounded-full" :class="form.theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'"></div>
              </div>

              <!-- Action Button -->
              <button
                type="button"
                class="mt-5 w-full rounded-lg py-2 text-sm font-semibold text-white shadow-md transition-all"
                :style="{ backgroundColor: form.primaryColor || '#4f46e5' }"
              >
                Aksi Utama
              </button>

              <!-- Footer Info -->
              <div class="mt-4 flex items-center justify-between text-[10px]" :class="form.theme === 'dark' ? 'text-slate-500' : 'text-slate-400'">
                <div class="flex items-center gap-1">
                  <Icon v-if="form.theme === 'dark'" name="lucide:moon" class="h-3 w-3" />
                  <Icon v-else-if="form.theme === 'light'" name="lucide:sun" class="h-3 w-3" />
                  <Icon v-else name="lucide:laptop" class="h-3 w-3" />
                  <span>{{ form.theme }}</span>
                </div>
                <span>{{ languageLabel }}</span>
              </div>
            </div>
          </div>
        </section>

        <section class="card rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sticky top-[34rem]">
          <h3 class="text-sm font-semibold text-slate-900">Status Sinkronisasi</h3>
          <div v-if="error" class="mt-3 flex items-start gap-2.5 text-xs text-rose-700 bg-rose-50 p-3 rounded-lg">
            <Icon name="lucide:alert-triangle" class="h-4 w-4 flex-shrink-0 mt-0.5 text-rose-500" />
            <div>
              <p class="font-bold">Gagal Memuat</p>
              <p class="text-rose-600">{{ error.message || 'Terjadi kesalahan pada server.' }}</p>
            </div>
          </div>
          <div v-else class="mt-3 flex items-start gap-2.5 text-xs text-slate-600 bg-slate-100/80 p-3 rounded-lg">
            <Icon name="lucide:info" class="h-4 w-4 flex-shrink-0 mt-0.5 text-slate-500" />
            <p>
              Semua perubahan akan disimpan ke server secara terpusat. Klik 'Simpan Perubahan' untuk menerapkan.
            </p>
          </div>
        </section>
      </aside>
    </div>
  </div>
  <!-- Loading Skeleton -->
  <div v-else class="space-y-8 animate-pulse">
    <div class="h-24 rounded-2xl bg-slate-200"></div>
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
      <div class="space-y-6">
        <div class="h-64 rounded-2xl bg-slate-200"></div>
        <div class="h-64 rounded-2xl bg-slate-200"></div>
        <div class="h-48 rounded-2xl bg-slate-200"></div>
      </div>
      <div class="space-y-4">
        <div class="h-48 rounded-2xl bg-slate-200"></div>
      </div>
    </div>
  </div>
  <ClientOnly>
    <template #default>
      <ExamEditorMediaLibraryModal
        v-model="showMediaModal"
        :media-type="'image'"
        @select="handleMediaSelect"
      />
    </template>
  </ClientOnly>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import type { AppSettings } from '@/composables/useAppSettings';

// Lazy load the component only on the client side
const ExamEditorMediaLibraryModal = defineAsyncComponent(() =>
  import('@/components/ExamEditor/MediaLibraryModal.vue')
)

definePageMeta({
  title: 'App Settings - Admin Panel',
  layout: 'admin',
  middleware: ['auth', 'role-check'],
  permission:"system.app"
})

const { settings, isLoading, isSaving, error, fetchSettings, updateSettings } = useAppSettings()

// Local state for form and file handling
const form = ref<AppSettings | null>(null)
const logoFile = ref<File | null>(null)
const config = useRuntimeConfig()
const logoPreviewUrl = ref<string | null>(null)
const faviconPreviewUrl = ref<string | null>(null) // New ref for favicon preview
const selectedMediaType = ref<'logo' | 'favicon'>('logo')
const showMediaModal = ref(false)

const appInitials = computed(() => {
  if (!form.value) return 'APP'
  const source = form.value.appShortName || form.value.appName || 'APP'
  return source
    .split(' ')
    .map((w: string) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
})

const languageLabel = computed(() => {
  if (!form.value) return ''
  switch (form.value.defaultLanguage) {
    case 'en':
      return 'English'
    case 'ar':
      return 'Bahasa Arab'
    default:
      return 'Bahasa Indonesia'
  }
})

// Watch for fetched settings to populate the form
watch(settings, (newSettings) => {
  if (newSettings) {
    // Deep copy to avoid direct mutation of the composable's state
    form.value = JSON.parse(JSON.stringify(newSettings));

    if (form.value) {
      faviconPreviewUrl.value = form.value.faviconUrl || null; // Initialize favicon preview
      logoPreviewUrl.value = form.value.logoUrl || null;
    }
  }
}, { immediate: true })

onMounted(() => {
  fetchSettings()
})

const openMediaModal = (type: 'logo' | 'favicon') => {
  selectedMediaType.value = type
  showMediaModal.value = true
}

const handleMediaSelect = (url: string) => {
  if (!form.value) return;

  if (selectedMediaType.value === 'logo') {
    form.value.logoUrl = url;
    logoPreviewUrl.value = url; // Update preview for logo
  } else if (selectedMediaType.value === 'favicon') {
    form.value.faviconUrl = url; // Update form data
    faviconPreviewUrl.value = url; // Update preview for favicon
  }
  showMediaModal.value = false; // Close the modal after selection
}
const handleSave = async () => {
  if (!form.value || isSaving.value) return // Check isSaving at the very beginning

  isSaving.value = true // Set isSaving for the entire operation

  const settingsToSave = JSON.parse(JSON.stringify(form.value))

  // console.log("Initial settingsToSave before logo upload check:", JSON.parse(JSON.stringify(settingsToSave)));

  try {
    // console.log("settingsToSave after logo upload (if any):", JSON.parse(JSON.stringify(settingsToSave)));

    await updateSettings(settingsToSave)
  } catch (uploadError) {
    // Error is already handled inside the composable
    console.error("Upload or save failed:", uploadError)
  } finally {
    isSaving.value = false // Ensure isSaving is reset regardless of success or failure
  }
}
</script>
