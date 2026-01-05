<template>
  <div class="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 font-sans">
    <div class="mx-auto max-w-2xl">
      
      <!-- Loading State -->
      <div v-if="isLoading" class="flex flex-col items-center justify-center py-20">
        <Icon name="lucide:loader-2" class="h-10 w-10 animate-spin text-amber-600" />
        <p class="mt-4 text-slate-600 font-medium">Memuat detail tagihan...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="rounded-2xl bg-white p-8 text-center shadow-sm border border-rose-100">
        <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-50 text-rose-600 mb-4">
          <Icon name="lucide:alert-circle" class="h-8 w-8" />
        </div>
        <h3 class="text-lg font-bold text-slate-900">Data Tidak Ditemukan</h3>
        <p class="mt-2 text-slate-500 max-w-xs mx-auto">{{ error }}</p>
        <button @click="router.push('/')" class="mt-6 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 transition-colors">
          <Icon name="lucide:arrow-left" class="h-4 w-4" />
          Kembali ke Dashboard
        </button>
      </div>

      <!-- Content -->
      <div v-else-if="payment" class="space-y-6">
        
        <!-- Header Status -->
        <div class="rounded-2xl bg-white p-6 shadow-sm border border-slate-200 relative overflow-hidden">
          <div class="absolute top-0 right-0 p-4 opacity-10">
            <Icon name="lucide:receipt" class="h-32 w-32 text-slate-900" />
          </div>
          
          <div class="relative z-10">
            <div class="flex items-center gap-3 mb-4">
              <span v-if="isPaid" class="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-emerald-700">
                <Icon name="lucide:check-circle-2" class="h-3.5 w-3.5" /> Lunas
              </span>
              <span v-else-if="isVerificationPending" class="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1 text-[9px] font-bold uppercase tracking-wide text-blue-700">
                <Icon name="lucide:hourglass" class="h-3.5 w-3.5" /> Menunggu Konfirmasi
              </span>
              <span v-else class="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-[9px] font-bold uppercase tracking-wide text-amber-700">
                <Icon name="lucide:clock" class="h-3.5 w-3.5" /> Menunggu Pembayaran
              </span>
              <span class="text-xs text-slate-400 font-mono">#{{ payment.invoiceNumber }}</span>
            </div>

            <p class="text-sm text-slate-500 font-medium">Total Tagihan</p>
            <div class="flex items-baseline gap-1 mt-1">
              <h1 class="text-4xl font-bold text-slate-900 tracking-tight">{{ formatCurrency(payment.amount || payment.price) }}</h1>
            </div>
            <p class="mt-2 text-sm text-slate-600">
              Pembayaran untuk <span class="font-semibold text-slate-900">{{ payment.participant?.batch?.namaBatch || 'Tes Bahasa' }}</span>
            </p>
          </div>
        </div>

        <!-- Verification Pending State -->
        <div v-if="isVerificationPending && !isReuploading" class="rounded-2xl bg-white p-8 text-center shadow-sm border border-blue-100">
          <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600 mb-4 animate-pulse">
            <Icon name="lucide:hourglass" class="h-8 w-8" />
          </div>
          <h3 class="text-xl font-bold text-slate-900">Pembayaran Sedang Diverifikasi</h3>
          <p class="mt-2 text-slate-600 max-w-md mx-auto">
            Bukti pembayaran Anda telah kami terima dan sedang dalam proses pengecekan oleh admin. Mohon tunggu 1x24 jam.
          </p>
          
          <div v-if="payment.payment_proof" class="mt-6 mb-2">
            <img :src="payment.payment_proof" alt="Bukti Transfer" class="mx-auto max-h-64 rounded-lg border border-slate-200 shadow-sm object-contain bg-slate-50" />
          </div>

          <div class="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-200 inline-block text-left">
             <div class="flex items-center gap-3">
                <Icon name="lucide:file-check" class="h-5 w-5 text-slate-400" />
                <div class="text-sm">
                   <p class="font-medium text-slate-900">Bukti Transfer Terkirim</p>
                   <a v-if="payment.payment_proof" :href="payment.payment_proof" target="_blank" class="text-blue-600 hover:underline text-xs">Lihat Bukti</a>
                </div>
             </div>
          </div>

          <div class="mt-6">
            <button @click="isReuploading = true" class="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors">
              <Icon name="lucide:refresh-cw" class="h-4 w-4" />
              Upload Ulang / Ganti Bukti
            </button>
          </div>
        </div>

        <!-- Dynamic Payment Method Component -->
        <PaymentMethodInfo
          v-if="(!isPaid && !isVerificationPending) || isReuploading"
          :method-type="paymentMethodType"
          :title="paymentTitle"
          :bank-name="paymentBankName"
          :account-number="paymentAccountNumber"
          :instructions="paymentInstructions"
          :offline-details="offlineDetails"
          :payment-id="payment.externalId || payment.id"
          :qr-code-data="payment.externalId || payment.id"
        />
        <!-- Manual Transfer Confirmation -->
        <div v-if="(!isPaid && !isVerificationPending) || isReuploading" class="rounded-2xl bg-white shadow-sm border border-slate-200 overflow-hidden">
          <div class="px-6 py-4 border-b border-slate-100">
            <h3 class="font-semibold text-slate-900">Konfirmasi Pembayaran Manual</h3>
          </div>
          <div class="p-6">
            <p class="text-sm text-slate-600 mb-4">
              Jika Anda melakukan pembayaran melalui teller bank atau metode manual lainnya, silakan unggah bukti transfer di sini untuk verifikasi admin.
            </p>
            
            <div class="space-y-4">
              <!-- File Input -->
              <div class="flex items-center justify-center w-full">
                <label for="dropzone-file" class="flex flex-col items-center justify-center w-full h-40 border-2 border-slate-300 border-dashed rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors relative overflow-hidden">
                  <div v-if="!previewUrl" class="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center">
                    <Icon name="lucide:upload-cloud" class="w-8 h-8 mb-2 text-slate-400" />
                    <p class="text-sm text-slate-500"><span class="font-semibold">Klik untuk upload</span> atau drag and drop</p>
                    <p class="text-xs text-slate-500 mt-1">PNG, JPG atau PDF (Maks. 2MB)</p>
                  </div>
                  <div v-else class="relative w-full h-full flex items-center justify-center bg-slate-100">
                     <img v-if="isImage" :src="previewUrl" class="h-full w-full object-contain p-2" />
                     <div v-else class="flex flex-col items-center text-slate-600">
                        <Icon name="lucide:file-text" class="w-10 h-10 mb-2" />
                        <span class="text-xs font-medium px-2 text-center">{{ selectedFile?.name }}</span>
                     </div>
                     <button @click.prevent="removeFile" class="absolute top-2 right-2 bg-white/90 rounded-full p-1.5 shadow-sm hover:bg-rose-50 text-slate-500 hover:text-rose-600 transition-colors">
                        <Icon name="lucide:x" class="w-4 h-4" />
                     </button>
                  </div>
                  <input id="dropzone-file" type="file" class="hidden" accept="image/png, image/jpeg, image/jpg, application/pdf" @change="handleFileChange" />
                </label>
              </div>

              <div class="flex gap-3">
                <button 
                  v-if="isReuploading"
                  @click="isReuploading = false"
                  class="w-full inline-flex justify-center items-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-all"
                >
                  Batal
                </button>
                <button 
                  @click="submitProof" 
                  :disabled="!selectedFile || uploading"
                  class="w-full inline-flex justify-center items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Icon v-if="uploading" name="lucide:loader-2" class="h-4 w-4 animate-spin" />
                  <Icon v-else name="lucide:send" class="h-4 w-4" />
                  {{ uploading ? 'Mengirim...' : 'Kirim Bukti Transfer' }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <button 
            @click="fetchPaymentDetail" 
            class="inline-flex justify-center items-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-all"
          >
            <Icon name="lucide:refresh-cw" class="h-4 w-4" />
            Cek Status Pembayaran
          </button>
          <button 
            @click="router.push('/')" 
            class="inline-flex justify-center items-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 transition-all"
          >
            Kembali ke Dashboard
          </button>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import PaymentMethodInfo from '@/components/payments/PaymentMethodInfo.vue';
import { ref, computed, onMounted } from 'vue';

const route = useRoute();
const router = useRouter();
const config = useRuntimeConfig();
const { $auth } = useNuxtApp();
const { showNotification } = useNotification(); // Asumsi ada composable ini

definePageMeta({
  middleware: ['auth', 'role-check'],
  permission: "payment.view_self",
  title: 'Detail Pembayaran'
});

const payment = ref<any>(null);
const isLoading = ref(true);
const error = ref('');
const openIndex = ref<number | null>(0);

// State untuk upload manual
const selectedFile = ref<File | null>(null);
const previewUrl = ref<string | null>(null);
const uploading = ref(false);
const isReuploading = ref(false);

const isImage = computed(() => selectedFile.value?.type.startsWith('image/'));

const isPaid = computed(() => {
  return payment.value?.status === 'PAID' || payment.value?.status === 'paid';
});

const isVerificationPending = computed(() => {
  return !isPaid.value && !!payment.value?.proofs;
});

const fetchPaymentDetail = async () => {
  const user = $auth?.currentUser;
  if (!user) {
    error.value = 'Sesi Anda telah berakhir. Silakan login kembali.';
    isLoading.value = false;
    return;
  }

  isLoading.value = true;
  try {
    const token = await user.getIdToken();
    // Mengambil semua pembayaran user dan filter di client-side (fallback jika endpoint detail belum ada)
    const response: any = await $fetch(`${config.public.API_URL}/payments/user/${user.uid}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const payments = Array.isArray(response) ? response : (response.data || []);
    const targetId = route.params.id;
    
    // Cari berdasarkan ID database atau External ID (Invoice ID)
    const found = payments.find((p: any) => 
      String(p.id) === String(targetId) || 
      String(p.externalId) === String(targetId) ||
      String(p.invoiceId) === String(targetId)
    );

    if (found) {
      payment.value = found;
    } else {
      error.value = 'Detail pembayaran tidak ditemukan atau Anda tidak memiliki akses.';
    }
  } catch (err: any) {
    console.error(err);
    error.value = 'Terjadi kesalahan saat menghubungi server.';
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchPaymentDetail();
});

// Computed Properties untuk PaymentMethodInfo
const paymentMethodType = computed(() => {
  // Logika penentuan tipe pembayaran
  // Jika ada VA Number, anggap bank_transfer. Jika method 'manual' atau 'offline', set offline.
  if (payment.value?.method === 'manual' || payment.value?.method === 'offline') return 'offline';
  if (payment.value?.vaNumber) return 'bank_transfer';
  return 'bank_transfer'; // Default fallback
});

const paymentTitle = computed(() => {
  return paymentMethodType.value === 'offline' ? 'Bayar di Kampus' : 'Transfer Bank';
});

const paymentBankName = computed(() => {
  // Bisa diambil dari payment.bankCode jika ada
  return payment.value?.bankCode || 'BCA';
});

const paymentAccountNumber = computed(() => {
  return payment.value?.vaNumber || '8800' + (payment.value?.externalId || '123456');
});

const offlineDetails = ref({
  location: 'Gedung Rektorat Lt. 1, Loket Keuangan',
  hours: 'Senin - Jumat, 08:00 - 15:00 WIB',
  notes: 'Tunjukkan ID Tagihan ini kepada petugas loket untuk melakukan pembayaran tunai.'
});

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val || 0);
};

const bankInstructions = [
  {
    title: 'ATM BCA',
    steps: [
      'Masukkan Kartu ATM BCA & PIN.',
      'Pilih menu Transaksi Lainnya > Transfer > ke Rekening BCA Virtual Account.',
      'Masukkan nomor Virtual Account yang tertera di atas.',
      'Periksa detail pembayaran (Nama & Nominal), lalu tekan Ya.',
      'Simpan struk sebagai bukti pembayaran yang sah.'
    ]
  },
  {
    title: 'm-BCA (BCA Mobile)',
    steps: [
      'Buka aplikasi BCA Mobile dan login.',
      'Pilih menu m-Transfer > BCA Virtual Account.',
      'Masukkan nomor Virtual Account yang tertera.',
      'Pastikan nama dan nominal tagihan sesuai, masukkan PIN m-BCA.',
      'Pembayaran selesai. Status akan otomatis terupdate.'
    ]
  },
  {
    title: 'Internet Banking BCA (KlikBCA)',
    steps: [
      'Login ke KlikBCA Individual.',
      'Pilih menu Transfer Dana > Transfer ke BCA Virtual Account.',
      'Masukkan nomor Virtual Account.',
      'Validasi detail pembayaran dan lanjutkan proses dengan KeyBCA.',
      'Transaksi selesai.'
    ]
  }
];

const offlineInstructions = [
  {
    title: 'Cara Pembayaran di Loket',
    steps: [
      'Datang ke lokasi pembayaran pada jam operasional.',
      'Ambil nomor antrian untuk layanan keuangan.',
      'Tunjukkan ID Tagihan atau halaman ini kepada petugas.',
      'Lakukan pembayaran tunai sesuai nominal.',
      'Simpan bukti pembayaran fisik yang diberikan petugas.'
    ]
  }
];

const paymentInstructions = computed(() => {
  return paymentMethodType.value === 'offline' ? offlineInstructions : bankInstructions;
});

// Logic Upload Manual
const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const file = input.files[0];
    
    // Validasi ukuran (2MB)
    if (file.size > 2 * 1024 * 1024) {
      if (typeof showNotification === 'function') showNotification('Ukuran file maksimal 2MB', 'error');
      else alert('Ukuran file maksimal 2MB');
      return;
    }

    selectedFile.value = file;
    previewUrl.value = URL.createObjectURL(file);
  }
};

const removeFile = () => {
  selectedFile.value = null;
  previewUrl.value = null;
};

const submitProof = async () => {
  if (!selectedFile.value || !payment.value) return;
  
  // Validasi Ukuran File (Max 2MB)
  if (selectedFile.value.size > 2 * 1024 * 1024) {
    showNotification('Ukuran file terlalu besar. Maksimal 2MB.', 'error');
    return;
  }

  // Validasi Tipe File
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
  if (!allowedTypes.includes(selectedFile.value.type)) {
    showNotification('Format file tidak valid. Harap unggah gambar (JPG/PNG) atau PDF.', 'error');
    return;
  }

  uploading.value = true;
  try {
    const user = $auth?.currentUser;
    const token = await user?.getIdToken();
    
    const formData = new FormData();
    formData.append('image', selectedFile.value);
    
    await $fetch(`${config.public.API_URL}/payments/${payment.value.id}/proof`, {
      method: 'POST',
      body: formData,
      headers: { Authorization: `Bearer ${token}` }
    });

    showNotification('Bukti transfer berhasil dikirim. Mohon tunggu verifikasi admin.', 'success');
    removeFile();
    fetchPaymentDetail();
    isReuploading.value = false;
  } catch (err) {
    console.error(err);
    showNotification('Gagal mengirim bukti transfer.', 'error');
  } finally {
    uploading.value = false;
  }
};
</script>