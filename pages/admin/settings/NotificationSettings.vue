<template>
  <div class="space-y-8">
    <!-- HEADER -->
    <header
      class="flex flex-col gap-3 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-5 py-4 text-white sm:flex-row sm:items-center sm:justify-between"
    >
      <div>
        <h1 class="text-2xl font-semibold tracking-tight">
          Pengaturan Notifikasi
        </h1>
        <p class="mt-1 text-sm text-slate-200/90">
          Kelola saluran notifikasi seperti Email, WhatsApp, dan Telegram untuk pengiriman pesan sistem.
        </p>
      </div>

      <div class="flex items-center gap-2">
        <span
          class="inline-flex items-center gap-1 rounded-full bg-amber-400/10 px-3 py-1 text-[11px] font-medium text-amber-200 border border-amber-300/40"
        >
          <span class="h-2 w-2 rounded-full bg-amber-300"></span>
          Next Update • Integrasi backend menyusul
        </span>

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
      <!-- LEFT: CHANNEL SETTINGS -->
      <div class="space-y-6">
        <!-- EMAIL -->
        <section class="card rounded-2xl border border-slate-200 bg-white/95 p-5 shadow-sm">
          <div class="mb-4 flex items-start justify-between gap-3">
            <div>
              <div class="flex items-center gap-2">
                <div
                  class="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600"
                >
                  <Icon name="lucide:mail" class="h-4 w-4" />
                </div>
                <div>
                  <h2 class="text-sm font-semibold text-slate-900">
                    Notifikasi Email
                  </h2>
                  <p class="mt-1 text-xs text-slate-500">
                    Digunakan untuk konfirmasi akun, reset password, dan notifikasi pembayaran.
                  </p>
                </div>
              </div>
            </div>

            <!-- Toggle -->
            <button
              type="button"
              class="inline-flex items-center gap-2 text-xs"
              @click="email.enabled = !email.enabled"
            >
              <span class="text-slate-200">
                {{ email.enabled ? 'Aktif' : 'Nonaktif' }}
              </span>
              <span
                class="flex h-5 w-9 items-center rounded-full transition"
                :class="email.enabled ? 'bg-emerald-500/80' : 'bg-slate-500/70'"
              >
                <span
                  class="h-4 w-4 rounded-full bg-white shadow transition-transform"
                  :class="email.enabled ? 'translate-x-4' : 'translate-x-0.5'"
                />
              </span>
            </button>
          </div>

          <div
            class="grid grid-cols-1 gap-4 text-xs md:grid-cols-3"
            :class="!email.enabled && 'opacity-60 pointer-events-none'"
          >
            <div class="md:col-span-1">
              <label class="mb-1 block font-medium text-slate-700">
                Nama Pengirim
              </label>
              <input
                v-model="email.fromName"
                type="text"
                class="input w-full rounded-lg border-slate-200 text-sm"
                placeholder="Contoh: Admin QiraApp"
              />
            </div>

            <div class="md:col-span-1">
              <label class="mb-1 block font-medium text-slate-700">
                Email Pengirim
              </label>
              <input
                v-model="email.fromAddress"
                type="email"
                class="input w-full rounded-lg border-slate-200 text-sm"
                placeholder="no-reply@domain.com"
              />
            </div>

            <div class="md:col-span-1">
              <label class="mb-1 block font-medium text-slate-700">
                Email Uji Coba
              </label>
              <div class="flex gap-2">
                <input
                  v-model="email.testRecipient"
                  type="email"
                  class="input w-full rounded-lg border-slate-200 text-sm"
                  placeholder="email@contoh.com"
                />
                <button
                  type="button"
                  class="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3 text-[11px] font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                  @click="sendTestEmail"
                  :disabled="!email.testRecipient"
                >
                  Tes
                </button>
              </div>
            </div>

            <div>
              <label class="mb-1 block font-medium text-slate-700">
                SMTP Host
              </label>
              <input
                v-model="email.smtpHost"
                type="text"
                class="input w-full rounded-lg border-slate-200 text-sm"
                placeholder="smtp.domain.com"
              />
            </div>

            <div>
              <label class="mb-1 block font-medium text-slate-700">
                SMTP Port
              </label>
              <input
                v-model.number="email.smtpPort"
                type="number"
                class="input w-full rounded-lg border-slate-200 text-sm"
                placeholder="587"
              />
            </div>

            <div>
              <label class="mb-1 block font-medium text-slate-700">
                Keamanan
              </label>
              <select
                v-model="email.encryption"
                class="input w-full rounded-lg border-slate-200 text-sm"
              >
                <option value="none">Tanpa Enkripsi</option>
                <option value="tls">TLS</option>
                <option value="ssl">SSL</option>
              </select>
            </div>

            <div>
              <label class="mb-1 block font-medium text-slate-700">
                Username SMTP
              </label>
              <input
                v-model="email.username"
                type="text"
                class="input w-full rounded-lg border-slate-200 text-sm"
                placeholder="username"
              />
            </div>

            <div>
              <label class="mb-1 block font-medium text-slate-700">
                Password SMTP
              </label>
              <input
                v-model="email.password"
                type="password"
                class="input w-full rounded-lg border-slate-200 text-sm"
                placeholder="••••••••"
              />
            </div>

            <div class="md:col-span-3">
              <p class="mt-1 text-[11px] text-slate-500">
                Untuk produksi, gunakan kredensial SMTP yang aman (contoh: layanan transaksional seperti SendGrid, Mailgun, dsb.)
              </p>
            </div>
          </div>
        </section>

        <!-- WHATSAPP -->
        <section class="card rounded-2xl border border-slate-200 bg-white/95 p-5 shadow-sm">
          <div class="mb-4 flex items-start justify-between gap-3">
            <div>
              <div class="flex items-center gap-2">
                <div
                  class="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600"
                >
                  <Icon name="lucide:message-circle" class="h-4 w-4" />
                </div>
                <div>
                  <h2 class="text-sm font-semibold text-slate-900">
                    Notifikasi WhatsApp
                  </h2>
                  <p class="mt-1 text-xs text-slate-500">
                    Cocok untuk pengingat pembayaran, jadwal ujian, dan notifikasi cepat ke peserta.
                  </p>
                </div>
              </div>
            </div>

            <!-- Toggle -->
            <button
              type="button"
              class="inline-flex items-center gap-2 text-xs"
              @click="whatsapp.enabled = !whatsapp.enabled"
            >
              <span class="text-slate-500">
                {{ whatsapp.enabled ? 'Aktif' : 'Nonaktif' }}
              </span>
              <span
                class="flex h-5 w-9 items-center rounded-full transition"
                :class="whatsapp.enabled ? 'bg-emerald-500/80' : 'bg-slate-300'"
              >
                <span
                  class="h-4 w-4 rounded-full bg-white shadow transition-transform"
                  :class="whatsapp.enabled ? 'translate-x-4' : 'translate-x-0.5'"
                />
              </span>
            </button>
          </div>

          <div
            class="grid grid-cols-1 gap-4 text-xs md:grid-cols-3"
            :class="!whatsapp.enabled && 'opacity-60 pointer-events-none'"
          >
            <div>
              <label class="mb-1 block font-medium text-slate-700">
                Provider / Gateway
              </label>
              <select
                v-model="whatsapp.provider"
                class="input w-full rounded-lg border-slate-200 text-sm"
              >
                <option value="none">Pilih provider</option>
                <option value="whacenter">WhaCenter (contoh)</option>
                <option value="twilio">Twilio</option>
                <option value="other">Lainnya</option>
              </select>
            </div>

            <div>
              <label class="mb-1 block font-medium text-slate-700">
                API Key / Token
              </label>
              <input
                v-model="whatsapp.apiKey"
                type="password"
                class="input w-full rounded-lg border-slate-200 text-sm"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label class="mb-1 block font-medium text-slate-700">
                Nomor Pengirim
              </label>
              <input
                v-model="whatsapp.senderNumber"
                type="text"
                class="input w-full rounded-lg border-slate-200 text-sm"
                placeholder="+62 812 3456 7890"
              />
            </div>

            <div class="md:col-span-2">
              <label class="mb-1 block font-medium text-slate-700">
                Nomor Uji Coba
              </label>
              <div class="flex gap-2">
                <input
                  v-model="whatsapp.testNumber"
                  type="text"
                  class="input w-full rounded-lg border-slate-200 text-sm"
                  placeholder="+62 8xx xxxx xxxx"
                />
                <button
                  type="button"
                  class="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3 text-[11px] font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                  :disabled="!whatsapp.testNumber"
                  @click="sendTestWhatsApp"
                >
                  Tes
                </button>
              </div>
              <p class="mt-1 text-[11px] text-slate-500">
                Saat ini masih dummy. Implementasi gateway bisa ditambahkan di update berikutnya.
              </p>
            </div>
          </div>
        </section>

        <!-- TELEGRAM -->
        <section class="card rounded-2xl border border-slate-200 bg-white/95 p-5 shadow-sm">
          <div class="mb-4 flex items-start justify-between gap-3">
            <div>
              <div class="flex items-center gap-2">
                <div
                  class="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-50 text-sky-500"
                >
                  <Icon name="lucide:send" class="h-4 w-4" />
                </div>
                <div>
                  <h2 class="text-sm font-semibold text-slate-900">
                    Notifikasi Telegram
                  </h2>
                  <p class="mt-1 text-xs text-slate-500">
                    Kirim laporan harian atau alert penting ke grup / channel admin.
                  </p>
                </div>
              </div>
            </div>

            <!-- Toggle -->
            <button
              type="button"
              class="inline-flex items-center gap-2 text-xs"
              @click="telegram.enabled = !telegram.enabled"
            >
              <span class="text-slate-500">
                {{ telegram.enabled ? 'Aktif' : 'Nonaktif' }}
              </span>
              <span
                class="flex h-5 w-9 items-center rounded-full transition"
                :class="telegram.enabled ? 'bg-emerald-500/80' : 'bg-slate-300'"
              >
                <span
                  class="h-4 w-4 rounded-full bg-white shadow transition-transform"
                  :class="telegram.enabled ? 'translate-x-4' : 'translate-x-0.5'"
                />
              </span>
            </button>
          </div>

          <div
            class="grid grid-cols-1 gap-4 text-xs md:grid-cols-3"
            :class="!telegram.enabled && 'opacity-60 pointer-events-none'"
          >
            <div>
              <label class="mb-1 block font-medium text-slate-700">
                Bot Token
              </label>
              <input
                v-model="telegram.botToken"
                type="password"
                class="input w-full rounded-lg border-slate-200 text-sm"
                placeholder="123456789:ABCDEF..."
              />
              <p class="mt-1 text-[11px] text-slate-500">
                Diperoleh dari @BotFather di Telegram.
              </p>
            </div>

            <div>
              <label class="mb-1 block font-medium text-slate-700">
                Chat ID / Channel ID
              </label>
              <input
                v-model="telegram.chatId"
                type="text"
                class="input w-full rounded-lg border-slate-200 text-sm"
                placeholder="@nama_channel atau ID numerik"
              />
            </div>

            <div>
              <label class="mb-1 block font-medium text-slate-700">
                Chat ID Uji Coba
              </label>
              <div class="flex gap-2">
                <input
                  v-model="telegram.testChatId"
                  type="text"
                  class="input w-full rounded-lg border-slate-200 text-sm"
                  placeholder="@username / ID"
                />
                <button
                  type="button"
                  class="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3 text-[11px] font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                  :disabled="!telegram.testChatId"
                  @click="sendTestTelegram"
                >
                  Tes
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      <!-- RIGHT: PREVIEW & INFO -->
      <aside class="space-y-4">
        <section class="card rounded-2xl border border-slate-200 bg-slate-50/80 p-5 shadow-sm">
          <h3 class="text-sm font-semibold text-slate-900">
            Pratinjau Saluran Aktif
          </h3>
          <p class="mt-1 text-xs text-slate-500">
            Gambaran singkat saluran notifikasi yang saat ini diaktifkan.
          </p>

          <div class="mt-4 space-y-3 text-xs text-slate-700">
            <div class="flex items-center justify-between gap-3">
              <div class="flex items-center gap-2">
                <div
                  class="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600"
                >
                  <Icon name="lucide:mail" class="h-3.5 w-3.5" />
                </div>
                <div>
                  <p class="font-medium">
                    Email
                  </p>
                  <p class="text-[11px] text-slate-500">
                    {{ emailSummary }}
                  </p>
                </div>
              </div>
              <span
                class="rounded-full px-2 py-0.5 text-[11px] font-medium"
                :class="email.enabled ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'"
              >
                {{ email.enabled ? 'Aktif' : 'Nonaktif' }}
              </span>
            </div>

            <div class="flex items-center justify-between gap-3">
              <div class="flex items-center gap-2">
                <div
                  class="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600"
                >
                  <Icon name="lucide:message-circle" class="h-3.5 w-3.5" />
                </div>
                <div>
                  <p class="font-medium">
                    WhatsApp
                  </p>
                  <p class="text-[11px] text-slate-500">
                    {{ whatsappSummary }}
                  </p>
                </div>
              </div>
              <span
                class="rounded-full px-2 py-0.5 text-[11px] font-medium"
                :class="whatsapp.enabled ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'"
              >
                {{ whatsapp.enabled ? 'Aktif' : 'Nonaktif' }}
              </span>
            </div>

            <div class="flex items-center justify-between gap-3">
              <div class="flex items-center gap-2">
                <div
                  class="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-50 text-sky-500"
                >
                  <Icon name="lucide:send" class="h-3.5 w-3.5" />
                </div>
                <div>
                  <p class="font-medium">
                    Telegram
                  </p>
                  <p class="text-[11px] text-slate-500">
                    {{ telegramSummary }}
                  </p>
                </div>
              </div>
              <span
                class="rounded-full px-2 py-0.5 text-[11px] font-medium"
                :class="telegram.enabled ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'"
              >
                {{ telegram.enabled ? 'Aktif' : 'Nonaktif' }}
              </span>
            </div>
          </div>
        </section>

        <section class="card rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 class="text-sm font-semibold text-slate-900">
            Catatan Integrasi
          </h3>
          <p class="mt-1 text-xs text-slate-500">
            Untuk tahap awal, pengaturan ini hanya menyimpan konfigurasi di sisi UI.
            Integrasi ke layanan email / WhatsApp / Telegram bisa ditambahkan pada update backend berikutnya.
          </p>

          <ul class="mt-3 space-y-2 text-xs text-slate-600">
            <li class="flex items-center gap-2">
              <span class="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
              Rekomendasi: mulai dulu dengan Email (SMTP) untuk notifikasi penting.
            </li>
            <li class="flex items-center gap-2">
              <span class="h-1.5 w-1.5 rounded-full bg-slate-400"></span>
              WhatsApp & Telegram sangat cocok untuk laporan harian / pengingat singkat.
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
  title: 'Notification Settings - Admin Panel',
  layout: 'admin',
});

const { showNotification } = useNotification?.() || { showNotification: () => {} };

const saving = ref(false);

const email = reactive({
  enabled: true,
  fromName: 'Admin QiraApp',
  fromAddress: 'no-reply@domain.com',
  testRecipient: '',
  smtpHost: '',
  smtpPort: 587,
  encryption: 'tls',
  username: '',
  password: '',
});

const whatsapp = reactive({
  enabled: false,
  provider: 'none',
  apiKey: '',
  senderNumber: '',
  testNumber: '',
});

const telegram = reactive({
  enabled: false,
  botToken: '',
  chatId: '',
  testChatId: '',
});

const emailSummary = computed(() => {
  if (!email.enabled) return 'Nonaktif, tidak ada email yang dikirim.';
  return email.fromAddress
    ? `Mengirim dari ${email.fromAddress}`
    : 'Aktif, tetapi email pengirim belum diisi.';
});

const whatsappSummary = computed(() => {
  if (!whatsapp.enabled) return 'Nonaktif, belum ada gateway yang digunakan.';
  if (whatsapp.provider === 'none') return 'Aktif, provider belum dipilih.';
  return `Provider ${whatsapp.provider}, pengirim ${whatsapp.senderNumber || 'belum diisi'}.`;
});

const telegramSummary = computed(() => {
  if (!telegram.enabled) return 'Nonaktif, tidak ada bot yang dikonfigurasi.';
  return telegram.chatId
    ? `Mengirim ke ${telegram.chatId}`
    : 'Aktif, tetapi chat ID belum diisi.';
});

const handleSave = async () => {
  if (saving.value) return;
  saving.value = true;
  try {
    // TODO: kirim ke API di update berikutnya
    console.log('Saving notification settings', {
      email,
      whatsapp,
      telegram,
    });
    await new Promise((resolve) => setTimeout(resolve, 600));
    showNotification?.('Pengaturan notifikasi disimpan (dummy).', 'success');
  } catch (e) {
    showNotification?.('Gagal menyimpan pengaturan notifikasi.', 'error');
  } finally {
    saving.value = false;
  }
};

const sendTestEmail = () => {
  if (!email.testRecipient) return;
  showNotification?.(`Tes email akan dikirim ke ${email.testRecipient} (dummy).`, 'info');
};

const sendTestWhatsApp = () => {
  if (!whatsapp.testNumber) return;
  showNotification?.(`Tes WhatsApp ke ${whatsapp.testNumber} (dummy).`, 'info');
};

const sendTestTelegram = () => {
  if (!telegram.testChatId) return;
  showNotification?.(`Tes Telegram ke ${telegram.testChatId} (dummy).`, 'info');
};
</script>
