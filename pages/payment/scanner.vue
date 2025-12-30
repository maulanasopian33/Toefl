<template>
  <div class="space-y-6">
    <!-- Header -->
    <header class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-semibold tracking-tight text-slate-900">
          Scanner Pembayaran
        </h1>
        <p class="mt-1 text-sm text-slate-500">
          Scan QR Code pada bukti tagihan untuk verifikasi dan update status pembayaran.
        </p>
      </div>
    </header>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <!-- Scanner Area -->
      <div class="lg:col-span-7 xl:col-span-8">
        <div class="card overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div class="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <h3 class="font-semibold text-slate-900 flex items-center gap-2">
              <Icon name="lucide:camera" class="h-4 w-4" />
              Kamera Scanner
            </h3>
            <span v-if="isScanning" class="flex h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
          </div>
          
          <div class="p-4 min-h-[300px] bg-slate-900 flex flex-col items-center justify-center relative">
             <div id="reader" class="w-full max-w-md overflow-hidden rounded-lg"></div>
             <p v-if="!isScanning && !paymentData" class="text-slate-400 mt-4 text-sm">Kamera tidak aktif</p>
          </div>
          
          <div class="p-4 bg-slate-50 border-t border-slate-100 text-center">
            <p class="text-xs text-slate-500">Pastikan QR Code terlihat jelas dan memiliki pencahayaan yang cukup.</p>
            
            <!-- Manual Input for Testing/Fallback -->
            <div class="mt-4 pt-3 border-t border-slate-200/60">
              <p class="text-xs font-medium text-slate-500 mb-2">Input Manual (Jika Scan Gagal / Testing)</p>
              <div class="flex gap-2 justify-center max-w-xs mx-auto">
                <input type="text" v-model="manualInputId" placeholder="Masukkan ID Tagihan" class="text-xs border border-slate-300 rounded px-3 py-1.5 w-full focus:outline-none focus:border-indigo-500" @keyup.enter="handleManualSubmit" />
                <button @click="handleManualSubmit" class="bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-medium px-3 py-1.5 rounded transition-colors">Cek</button>
              </div>
            </div>

          </div>
        </div>
      </div>

      <!-- Result / Detail Area -->
      <div 
        class="fixed inset-x-0 bottom-0 z-50 transition-transform duration-300 ease-in-out lg:static lg:col-span-5 lg:xl:col-span-4 lg:z-auto lg:transform-none"
        :class="{
          'translate-y-0': paymentData || error || isLoading,
          'translate-y-[110%] lg:translate-y-0': !paymentData && !error && !isLoading
        }"
      >
        <!-- Wrapper for Bottom Sheet Style on Mobile -->
        <div class="bg-white rounded-t-2xl shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.3)] p-4 sm:p-6 lg:p-0 lg:shadow-none lg:bg-transparent lg:rounded-none max-h-[85vh] overflow-y-auto lg:max-h-none lg:overflow-visible">
          
        <!-- State: Empty -->
        <div v-if="!paymentData && !isLoading && !error" class="hidden lg:flex card rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm h-full flex-col items-center justify-center min-h-[300px]">
          <div class="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
            <Icon name="lucide:qr-code" class="h-8 w-8 text-slate-400" />
          </div>
          <h3 class="text-lg font-semibold text-slate-900">Menunggu Scan</h3>
          <p class="text-sm text-slate-500 mt-2 max-w-xs mx-auto">
            Arahkan kamera ke QR Code tagihan peserta untuk menampilkan detail pembayaran.
          </p>
        </div>

        <!-- State: Loading -->
        <div v-else-if="isLoading" class="card rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm h-full flex flex-col items-center justify-center min-h-[200px] lg:min-h-[300px]">
          <Icon name="lucide:loader-2" class="h-12 w-12 animate-spin text-indigo-600 mb-4" />
          <h3 class="text-lg font-semibold text-slate-900">Memproses...</h3>
          <p class="text-sm text-slate-500 mt-2">Sedang mengambil data tagihan.</p>
        </div>

        <!-- State: Error -->
        <div v-else-if="error" class="card rounded-2xl border border-rose-100 bg-white p-8 text-center shadow-sm h-full flex flex-col items-center justify-center min-h-[200px] lg:min-h-[300px]">
          <div class="h-16 w-16 rounded-full bg-rose-50 flex items-center justify-center mb-4">
            <Icon name="lucide:x-circle" class="h-8 w-8 text-rose-500" />
          </div>
          <h3 class="text-lg font-semibold text-slate-900">Gagal Scan</h3>
          <p class="text-sm text-slate-500 mt-2">{{ error }}</p>
          <button @click="resetState" class="mt-6 w-full inline-flex justify-center items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-all">Tutup / Scan Ulang</button>
        </div>

        <!-- State: Result -->
        <div v-else-if="paymentData" class="card rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <!-- Drag Handle for Mobile -->
          <div class="lg:hidden flex justify-center pt-2 pb-1 mb-2" @click="resetState">
             <div class="h-1.5 w-12 rounded-full bg-slate-200"></div>
          </div>

          <div class="bg-indigo-600 px-6 py-4 text-white">
            <p class="text-xs font-medium opacity-80 uppercase tracking-wider">Detail Tagihan</p>
            <div class="flex items-center justify-between mt-1">
              <h2 class="text-xl font-bold">{{ formatCurrency(paymentData.amount || paymentData.price) }}</h2>
              <span class="px-2 py-1 rounded bg-white/20 text-xs font-bold uppercase backdrop-blur-sm">
                {{ paymentData.status }}
              </span>
            </div>
          </div>
          
          <div class="p-6 space-y-5">
            <!-- Info Peserta -->
            <div>
              <label class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Peserta</label>
              <div class="flex items-center gap-3 mt-2">
                <div class="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-sm">
                  {{ getInitials(paymentData.participant?.user?.name || 'User') }}
                </div>
                <div>
                  <p class="font-medium text-slate-900 text-sm">{{ paymentData.participant?.user?.name || 'Nama Tidak Tersedia' }}</p>
                  <p class="text-xs text-slate-500">{{ paymentData.participant?.user?.email || '-' }}</p>
                </div>
              </div>
            </div>

            <!-- Info Batch -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="text-xs font-semibold text-slate-500 uppercase tracking-wider">ID Invoice</label>
                <p class="text-sm font-mono font-medium text-slate-900 mt-1 truncate" :title="paymentData.externalId || paymentData.id">
                  {{ paymentData.externalId || paymentData.id }}
                </p>
              </div>
              <div>
                <label class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Batch</label>
                <p class="text-sm font-medium text-slate-900 mt-1 truncate">
                  {{ paymentData.participant?.batch?.namaBatch || '-' }}
                </p>
              </div>
            </div>

            <!-- Actions -->
            <div class="pt-4 border-t border-slate-100 flex flex-col gap-3">
              <!-- Swipe to Confirm Button -->
              <div 
                v-if="paymentData.status !== 'paid' && paymentData.status !== 'PAID'"
                ref="sliderContainer"
                class="relative h-12 w-full overflow-hidden rounded-full bg-slate-100 border border-slate-200 select-none cursor-pointer"
                :class="{ 'opacity-70': processing }"
              >
                <!-- Background Text -->
                <div class="absolute inset-0 flex items-center justify-center text-sm font-semibold text-slate-400 z-0">
                  Geser untuk Verifikasi
                </div>
                
                <!-- Progress Track -->
                <div 
                  class="absolute inset-y-0 left-0 bg-emerald-100 z-0 transition-all duration-75 ease-linear"
                  :style="{ width: (dragPosition + 44) + 'px' }"
                ></div>

                <!-- Handle -->
                <div
                  class="absolute top-1 bottom-1 left-1 w-10 flex items-center justify-center rounded-full bg-emerald-600 text-white shadow-md z-10 cursor-grab active:cursor-grabbing"
                  :style="{ transform: `translateX(${dragPosition}px)` }"
                  @mousedown="startDrag"
                  @touchstart="startDrag"
                >
                  <Icon v-if="processing" name="lucide:loader-2" class="h-4 w-4 animate-spin" />
                  <Icon v-else name="lucide:chevrons-right" class="h-5 w-5" />
                </div>
              </div>
              
              <div v-else class="w-full bg-emerald-50 border border-emerald-100 rounded-lg p-3 flex items-center justify-center gap-2 text-emerald-700 text-sm font-medium">
                <Icon name="lucide:check-check" class="h-4 w-4" />
                Tagihan Sudah Lunas
              </div>

              <button 
                @click="resetState"
                class="w-full inline-flex justify-center items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-all"
              >
                <Icon name="lucide:scan" class="h-4 w-4" />
                Scan Tagihan Lain
              </button>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useNotification } from '@/composables/useNotification';

definePageMeta({
  title: 'QR Scanner - Admin Panel',
  layout: 'admin',
//   middleware: ['auth', 'role-check'],
//   roles: ['admin'],
});

const config = useRuntimeConfig();
const { $auth } = useNuxtApp();
const { showNotification } = useNotification();

const isScanning = ref(false);
const isLoading = ref(false);
const processing = ref(false);
const error = ref(null);
const paymentData = ref(null);
const manualInputId = ref('');

// Swipe Logic Refs
const sliderContainer = ref(null);
const isDragging = ref(false);
const dragPosition = ref(0);
const startX = ref(0);

let html5QrcodeScanner = null;

const onScanSuccess = async (decodedText, decodedResult) => {
  if (html5QrcodeScanner) {
    try {
      await html5QrcodeScanner.clear();
      isScanning.value = false;
    } catch (e) {
      console.error('Failed to clear scanner', e);
    }
  }
  
  fetchPaymentDetails(decodedText);
};

const handleManualSubmit = () => {
  if (manualInputId.value) {
    onScanSuccess(manualInputId.value);
  }
};

const onScanFailure = (errorMessage) => {
  // Ignore errors during scanning to avoid console spam
};

const fetchPaymentDetails = async (id) => {
  isLoading.value = true;
  error.value = null;
  
  try {
    const user = $auth.currentUser;
    const token = await user?.getIdToken();
    
    const response = await $fetch(`${config.public.API_URL}/payments/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (response) {
      paymentData.value = response.data || response;
    } else {
      throw new Error('Data tidak ditemukan');
    }
  } catch (err) {
    console.error(err);
    error.value = 'Data tagihan tidak ditemukan. Pastikan QR Code valid.';
  } finally {
    isLoading.value = false;
  }
};

const markAsPaid = async () => {
  if (!paymentData.value) return;
  
  processing.value = true;
  try {
    const user = $auth.currentUser;
    const token = await user?.getIdToken();
    
    await $fetch(`${config.public.API_URL}/payments/${paymentData.value.id}/status`, {
      method: 'PATCH',
      body: { status: 'paid' },
      headers: { Authorization: `Bearer ${token}` }
    });

    showNotification('Pembayaran berhasil diverifikasi Lunas.', 'success');
    paymentData.value.status = 'paid';
    dragPosition.value = 0;
  } catch (err) {
    console.error(err);
    showNotification('Gagal memverifikasi pembayaran.', 'error');
    dragPosition.value = 0; // Reset slider jika gagal
  } finally {
    processing.value = false;
  }
};

const resetState = () => {
  paymentData.value = null;
  error.value = null;
  dragPosition.value = 0;
  initScanner();
};

const initScanner = async () => {
  // Cek Secure Context (HTTPS atau Localhost)
  if (window.isSecureContext === false) {
     error.value = 'Akses kamera memerlukan koneksi aman (HTTPS) atau Localhost. Jika testing di HP via IP, gunakan tunneling (ngrok).';
     return;
  }

  // Dynamic import to avoid SSR issues
  const { Html5QrcodeScanner } = await import('html5-qrcode');
  
  // Wait for DOM
  setTimeout(() => {
    const readerElement = document.getElementById('reader');
    if (readerElement) {
      isScanning.value = true;
      try {
        html5QrcodeScanner = new Html5QrcodeScanner(
          "reader",
          { fps: 10, qrbox: { width: 250, height: 250 } },
          false
        );
        html5QrcodeScanner.render(onScanSuccess, onScanFailure);
      } catch (err) {
        console.error(err);
        error.value = 'Gagal menginisialisasi kamera. Pastikan izin diberikan atau gunakan input manual.';
      }
    }
  }, 100);
};

const formatCurrency = (val) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val || 0);
};

const getInitials = (name) => {
  return name ? name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : '??';
};

// Swipe Logic Functions
const startDrag = (e) => {
  if (processing.value) return;
  isDragging.value = true;
  const clientX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX;
  startX.value = clientX - dragPosition.value;
  
  document.addEventListener('mousemove', onDrag);
  document.addEventListener('touchmove', onDrag);
  document.addEventListener('mouseup', stopDrag);
  document.addEventListener('touchend', stopDrag);
};

const onDrag = (e) => {
  if (!isDragging.value || !sliderContainer.value) return;
  
  const clientX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX;
  const containerWidth = sliderContainer.value.clientWidth;
  
  // Max drag = container width - handle width (40px) - padding left (4px) - padding right (4px)
  const maxDrag = containerWidth - 48; 
  
  let newPos = clientX - startX.value;
  
  if (newPos < 0) newPos = 0;
  if (newPos > maxDrag) newPos = maxDrag;
  
  dragPosition.value = newPos;
};

const stopDrag = () => {
  isDragging.value = false;
  document.removeEventListener('mousemove', onDrag);
  document.removeEventListener('touchmove', onDrag);
  document.removeEventListener('mouseup', stopDrag);
  document.removeEventListener('touchend', stopDrag);
  
  if (!sliderContainer.value) return;
  
  const containerWidth = sliderContainer.value.clientWidth;
  const maxDrag = containerWidth - 48;
  
  // Threshold 70% untuk trigger aksi
  if (dragPosition.value > maxDrag * 0.7) {
    dragPosition.value = maxDrag; // Snap ke ujung
    markAsPaid();
  } else {
    // Animasi kembali ke awal jika belum sampai threshold
    const animateBack = () => {
      if (dragPosition.value > 0) {
        dragPosition.value = Math.max(0, dragPosition.value - 15);
        requestAnimationFrame(animateBack);
      }
    };
    animateBack();
  }
};

onMounted(() => {
  initScanner();
});

onBeforeUnmount(() => {
  if (html5QrcodeScanner) {
    html5QrcodeScanner.clear().catch(e => console.error(e));
  }
});
</script>

<style>
#reader__scan_region {
  background: white;
}
</style>