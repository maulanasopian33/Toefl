<template>
  <!-- Root element with v-if to wait for settings data -->
  
  <div v-if="form" class="space-y-8">
    <!-- HEADER -->
    <header
      class="flex flex-col gap-4 rounded-3xl bg-white px-8 py-6 border border-gray-100 shadow-xl ring-1 ring-gray-900/5 sm:flex-row sm:items-center sm:justify-between"
    >
      <div>
        <h1 class="text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
          <div class="p-2 bg-emerald-100 rounded-xl">
            <Icon name="heroicons:cog-6-tooth" class="w-6 h-6 text-emerald-600" />
          </div>
          Pengaturan Aplikasi
        </h1>
        <p class="mt-2 text-gray-500">
          Atur nama aplikasi, logo, identitas brand, dan preferensi sistem.
        </p>
      </div>

      <div class="flex items-center gap-3">
        <button
          :disabled="isSaving"
          type="button"
          class="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all shadow-sm"
          @click="() => fetchSettings()"
        >
          <Icon name="lucide:refresh-cw" class="h-4 w-4" />
          Muat Ulang
        </button>
        <button
          type="button"
          class="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all transform active:scale-95 disabled:opacity-60"
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
          {{ isSaving ? 'Menyimpan...' : 'Simpan' }}
        </button>
      </div>
    </header>

    <!-- MAIN GRID -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
      <!-- LEFT: FORM SECTIONS -->
      <div class="space-y-6">
        <!-- General Info -->
        <section class="bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden ring-1 ring-gray-900/5">
          <div class="px-8 py-5 border-b border-gray-50 bg-gray-50/50">
            <h2 class="text-base font-extrabold text-gray-900 tracking-tight">Informasi Umum</h2>
            <p class="mt-1 text-sm text-gray-400 font-medium">
              Nama aplikasi dan informasi dasar yang akan tampil di seluruh sistem.
            </p>
          </div>

          <div class="p-8 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div class="md:col-span-2 space-y-2">
              <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">
                Nama Aplikasi
              </label>
              <input
                v-model="form.appName"
                type="text"
                class="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-bold text-gray-700 text-sm"
                placeholder="Contoh: Pusat Pembelajaran Bahasa Arab"
              />
            </div>

            <div class="space-y-2">
              <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">
                Nama Pendek / Brand
              </label>
              <input
                v-model="form.appShortName"
                type="text"
                class="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-bold text-gray-700 text-sm"
                placeholder="Contoh: QiraApp"
              />
            </div>

            <div class="space-y-2">
              <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">
                Slug / ID Aplikasi
              </label>
              <input
                v-model="form.appSlug"
                type="text"
                class="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-mono font-bold text-gray-700 text-sm"
                placeholder="contoh: qira-app"
              />
            </div>

            <div class="md:col-span-2 space-y-2">
              <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">
                Tagline
              </label>
              <input
                v-model="form.tagline"
                type="text"
                class="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-bold text-gray-700 text-sm"
                placeholder="Contoh: Platform ujian bahasa Arab yang simpel dan terukur."
              />
            </div>

            <div class="md:col-span-2 space-y-2">
              <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">
                Deskripsi Singkat
              </label>
              <textarea
                v-model="form.description"
                rows="3"
                class="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-medium text-gray-700 text-sm"
                placeholder="Deskripsi ini dapat digunakan untuk meta description, dokumentasi internal, dan lain-lain."
              ></textarea>
            </div>
          </div>
        </section>
        
        <!-- Dashboard Hero -->
        <section class="bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden ring-1 ring-gray-900/5">
          <div class="px-8 py-5 border-b border-gray-50 bg-gray-50/50">
            <h2 class="text-base font-extrabold text-gray-900 tracking-tight">Konten Hero Dashboard</h2>
            <p class="mt-1 text-sm text-gray-400 font-medium">
              Atur teks sambutan yang muncul di dashboard peserta.
            </p>
          </div>

          <div class="p-8 grid grid-cols-1 gap-6">
            <div class="space-y-2">
              <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">
                Hero Title (Judul)
              </label>
              <input
                v-model="form.heroTitle"
                type="text"
                class="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-bold text-gray-700 text-sm"
                placeholder="Contoh: Siap untuk Tes TOEFL Anda?"
              />
            </div>

            <div class="space-y-2">
              <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">
                Hero Subtitle (Sub-Judul)
              </label>
              <textarea
                v-model="form.heroSubtitle"
                rows="2"
                class="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-medium text-gray-700 text-sm"
                placeholder="Contoh: Uji kemampuan Bahasa Inggris Anda di bagian Reading, Listening, Speaking, dan Writing."
              ></textarea>
            </div>
          </div>
        </section>

        <!-- Branding & Logo -->
        <section class="bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden ring-1 ring-gray-900/5">
          <div class="px-8 py-5 border-b border-gray-50 bg-gray-50/50">
            <h2 class="text-base font-extrabold text-gray-900 tracking-tight">Branding & Logo</h2>
            <p class="mt-1 text-sm text-gray-400 font-medium">
              Atur logo utama, favicon, dan warna utama yang digunakan di dashboard.
            </p>
          </div>

          <div class="p-8 grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
            <!-- Upload -->
            <div class="space-y-6">
              <div class="space-y-2">
                <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">
                  Logo Utama
                </label>
                <div
                  class="flex items-center justify-between gap-4 rounded-2xl border border-dashed border-gray-200 bg-gray-50/50 px-5 py-4 hover:bg-gray-50 hover:border-emerald-300 transition-all cursor-pointer group/upload"
                  @click="openMediaModal('logo')"
                >
                  <div class="flex items-center gap-4">
                    <div
                      class="flex h-12 w-12 items-center justify-center rounded-xl bg-white border border-gray-100 shadow-sm overflow-hidden"
                    >
                      <img v-if="logoPreviewUrl" :src="`${config.public.MEDIA_URL}${logoPreviewUrl}`" alt="Logo Preview" class="h-full w-full object-contain p-1.5" />
                      <Icon v-else name="lucide:image" class="h-6 w-6 text-gray-300" />
                    </div>
                    <div>
                      <p class="text-sm font-bold text-gray-700 group-hover/upload:text-emerald-600 transition-colors">
                        Logo Aplikasi
                      </p>
                      <p class="text-[10px] font-medium text-gray-400 uppercase tracking-tight">
                        PNG, SVG (Min 200x200px)
                      </p>
                    </div>
                  </div>
                  <Icon name="heroicons:arrow-up-tray" class="w-5 h-5 text-gray-300 group-hover/upload:text-emerald-500 transition-all" />
                </div>
              </div>

              <div class="space-y-2">
                <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">
                  Favicon
                </label>
                <div
                  class="flex items-center justify-between gap-4 rounded-2xl border border-dashed border-gray-200 bg-gray-50/50 px-5 py-4 hover:bg-gray-50 hover:border-emerald-300 transition-all cursor-pointer group/upload"
                  @click="openMediaModal('favicon')"
                >
                  <div class="flex items-center gap-4">
                    <div
                      class="flex h-10 w-10 items-center justify-center rounded-lg bg-white border border-gray-100 shadow-sm overflow-hidden"
                    >
                      <img v-if="faviconPreviewUrl" :src="`${config.public.MEDIA_URL}${faviconPreviewUrl}`" alt="Favicon Preview" class="h-full w-full object-contain p-1.5" />
                      <Icon v-else name="lucide:square-dot" class="h-5 w-5 text-gray-300" />
                    </div>
                    <div>
                      <p class="text-sm font-bold text-gray-700 group-hover/upload:text-emerald-600 transition-colors">
                        Favicon
                      </p>
                      <p class="text-[10px] font-medium text-gray-400 uppercase tracking-tight">
                        ICO, PNG (32x32px)
                      </p>
                    </div>
                  </div>
                  <Icon name="heroicons:arrow-up-tray" class="w-5 h-5 text-gray-300 group-hover/upload:text-emerald-500 transition-all" />
                </div>
              </div>
            </div>

            <!-- Brand Colors -->
            <div class="space-y-6">
              <div class="space-y-2">
                <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">
                  Warna Utama
                </label>
                <div class="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-2xl px-4 py-2">
                  <input
                    v-model="form.primaryColor"
                    type="color"
                    class="h-10 w-10 rounded-xl border-none bg-transparent p-0 cursor-pointer"
                  />
                  <input
                    v-model="form.primaryColor"
                    type="text"
                    class="bg-transparent border-none focus:ring-0 w-full font-mono font-bold text-gray-700 text-sm"
                    placeholder="#4f46e5"
                  />
                </div>
                <p class="mt-1 text-[10px] text-gray-400 font-medium italic">
                  * Warna ini digunakan untuk branding tombol & aksen dashboard.
                </p>
              </div>

              <div class="space-y-2">
                <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">
                  Mode Tampilan
                </label>
                <select
                  v-model="form.theme"
                  class="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-bold text-gray-700 cursor-pointer text-sm"
                >
                  <option value="system">Ikuti Sistem</option>
                  <option value="light">Selalu Terang</option>
                  <option value="dark">Selalu Gelap</option>
                </select>
                <p class="mt-1 text-[10px] text-gray-400 font-medium italic">
                  * Preferensi tema default untuk pengguna baru.
                </p>
              </div>
            </div>
          </div>
        </section>

        <!-- Contact / Organization -->
        <section class="bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden ring-1 ring-gray-900/5">
          <div class="px-8 py-5 border-b border-gray-50 bg-gray-50/50">
            <h2 class="text-base font-extrabold text-gray-900 tracking-tight">Informasi Organisasi & Kontak</h2>
            <p class="mt-1 text-sm text-gray-400 font-medium">
              Informasi ini dapat digunakan di footer, email notifikasi, dan halaman publik.
            </p>
          </div>

          <div class="p-8 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div class="space-y-2">
              <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">
                Nama Organisasi
              </label>
              <input
                v-model="form.organization"
                type="text"
                class="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-bold text-gray-700 text-sm"
                placeholder="Contoh: Lembaga Bahasa dan Sains Islam"
              />
            </div>

            <div class="space-y-2">
              <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">
                Website
              </label>
              <input
                v-model="form.website"
                type="url"
                class="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-bold text-gray-700 text-sm"
                placeholder="https://contoh-domain.com"
              />
            </div>

            <div class="space-y-2">
              <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">
                Email Support
              </label>
              <input
                v-model="form.supportEmail"
                type="email"
                class="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-bold text-gray-700 text-sm"
                placeholder="support@contoh.com"
              />
            </div>

            <div class="space-y-2">
              <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">
                No. Kontak / WhatsApp
              </label>
              <input
                v-model="form.supportPhone"
                type="text"
                class="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-bold text-gray-700 text-sm"
                placeholder="+62 812 3456 7890"
              />
            </div>
          </div>
        </section>

        <!-- System Preferences -->
        <section class="bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden ring-1 ring-gray-900/5">
          <div class="px-8 py-5 border-b border-gray-50 bg-gray-50/50">
            <h2 class="text-base font-extrabold text-gray-900 tracking-tight">Preferensi Sistem</h2>
            <p class="mt-1 text-sm text-gray-400 font-medium">
              Pengaturan umum seperti bahasa, zona waktu, dan mata uang default.
            </p>
          </div>

          <div class="p-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            <div class="space-y-2">
              <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">
                Bahasa Default
              </label>
              <select
                v-model="form.defaultLanguage"
                class="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-bold text-gray-700 cursor-pointer text-sm"
              >
                <option value="id">Indonesia</option>
                <option value="en">English</option>
                <option value="ar">العربية (Arab)</option>
              </select>
            </div>

            <div class="space-y-2">
              <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">
                Zona Waktu
              </label>
              <select
                v-model="form.timezone"
                class="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-bold text-gray-700 cursor-pointer text-sm"
              >
                <option value="Asia/Jakarta">Asia/Jakarta</option>
                <option value="Asia/Makassar">Asia/Makassar</option>
                <option value="Asia/Jayapura">Asia/Jayapura</option>
              </select>
            </div>

            <div class="space-y-2">
              <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">
                Mata Uang
              </label>
              <select
                v-model="form.currency"
                class="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-bold text-gray-700 cursor-pointer text-sm"
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
        <section class="bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden ring-1 ring-gray-900/5 sticky top-24">
          <div class="px-6 py-4 border-b border-gray-50 bg-gray-50/50">
            <h3 class="text-sm font-extrabold text-gray-900 tracking-tight">
              Pratinjau Live
            </h3>
            <p class="mt-0.5 text-[11px] text-gray-400 font-medium italic">
              * Tampilan aplikasi dengan pengaturan saat ini.
            </p>
          </div>

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
            <div class="p-6 transition-colors" :class="form.theme === 'dark' ? 'bg-slate-900 text-white' : 'bg-white text-gray-900'">
              <!-- Header -->
              <div class="flex items-center gap-4">
                <div
                  class="flex h-14 w-14 items-center justify-center rounded-2xl text-white flex-shrink-0 shadow-lg"
                  :style="{ backgroundColor: form.primaryColor || '#10b981' }"
                >
                  <img v-if="logoPreviewUrl" :src="`${config.public.MEDIA_URL}${logoPreviewUrl}`" alt="Logo preview" class="h-full w-full object-contain p-2" />
                  <span v-else class="text-xl font-black tracking-tighter">
                    {{ appInitials }}
                  </span>
                </div>
                <div class="min-w-0">
                  <p class="truncate text-base font-extrabold tracking-tight" :class="form.theme === 'dark' ? 'text-white' : 'text-gray-900'">
                    {{ form.appName || 'Nama Aplikasi' }}
                  </p>
                  <p class="truncate text-[11px] font-bold uppercase tracking-widest text-gray-400">
                    {{ form.tagline || 'Tagline aplikasi.' }}
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

        <section class="bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden ring-1 ring-gray-900/5 sticky top-[36rem]">
          <div class="px-6 py-4 border-b border-gray-50 bg-gray-50/50">
             <h3 class="text-sm font-extrabold text-gray-900 tracking-tight">Status Sinkronisasi</h3>
          </div>
          <div class="p-6">
            <div v-if="error" class="flex items-start gap-3 text-xs text-rose-700 bg-rose-50 p-4 rounded-2xl border border-rose-100">
              <Icon name="lucide:alert-triangle" class="h-5 w-5 flex-shrink-0 text-rose-500" />
              <div>
                <p class="font-bold">Gagal Memuat</p>
                <p class="text-rose-600 mt-0.5">{{ error.message || 'Terjadi kesalahan pada server.' }}</p>
              </div>
            </div>
            <div v-else class="flex items-start gap-3 text-xs text-gray-500 bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <Icon name="lucide:info" class="h-5 w-5 flex-shrink-0 text-gray-400" />
              <p class="font-medium leading-relaxed">
                Semua perubahan akan disimpan secara terpusat. Klik <span class="text-emerald-600 font-bold">'Simpan'</span> untuk menerapkan perubahan.
              </p>
            </div>
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
