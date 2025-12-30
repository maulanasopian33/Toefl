<template>
  <div class="space-y-6">
    <!-- Payment Method Details -->
    <div class="rounded-2xl bg-white shadow-sm border border-slate-200 overflow-hidden">
      <div class="bg-slate-50/50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
        <h3 class="font-semibold text-slate-900 flex items-center gap-2">
          <Icon :name="iconName" class="h-5 w-5 text-slate-500" />
          {{ title }}
        </h3>
        <span class="text-xs font-medium text-slate-500 bg-white border border-slate-200 px-2 py-1 rounded">
          {{ typeLabel }}
        </span>
      </div>
      
      <div class="p-6">
        <!-- Tampilan Transfer Bank -->
        <div v-if="methodType === 'bank_transfer'" class="flex flex-col sm:flex-row gap-6">
          <!-- Bank Logo/Name -->
          <div class="flex-shrink-0">
            <div class="h-16 w-24 rounded-lg border border-slate-200 bg-white flex items-center justify-center p-2 shadow-sm">
              <span class="font-bold text-xl italic" :class="bankColorClass">{{ bankName }}</span>
            </div>
          </div>
          
          <!-- VA Details -->
          <div class="flex-1 space-y-4">
            <div>
              <label class="text-xs font-medium text-slate-500 uppercase tracking-wider">Nomor Virtual Account</label>
              <div class="mt-1 flex items-center gap-3">
                <span class="text-2xl font-mono font-bold text-slate-900 tracking-wider">
                  {{ accountNumber }}
                </span>
                <button 
                  @click="copyToClipboard(accountNumber)"
                  class="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                  title="Salin Nomor"
                >
                  <Icon name="lucide:copy" class="h-5 w-5" />
                </button>
              </div>
            </div>

            <div class="bg-amber-50 rounded-lg p-3 border border-amber-100 flex gap-3 items-start">
              <Icon name="lucide:info" class="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <p class="text-xs text-amber-800 leading-relaxed">
                Lakukan transfer ke nomor Virtual Account di atas. Pembayaran akan terverifikasi secara otomatis dalam 5-10 menit.
              </p>
            </div>
          </div>
        </div>

        <!-- Tampilan Bayar di Kampus (Manual/Offline) -->
        <div v-else-if="methodType === 'offline'" class="flex flex-col gap-6">
          <div class="flex items-start gap-4">
            <div class="flex-shrink-0 h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <Icon name="lucide:map-pin" class="h-6 w-6" />
            </div>
            <div>
              <h4 class="font-medium text-slate-900">Lokasi Pembayaran</h4>
              <p class="text-slate-600 mt-1">{{ offlineDetails.location || 'Bagian Keuangan Kampus' }}</p>
              <p class="text-sm text-slate-500 mt-2">
                <Icon name="lucide:clock" class="h-3 w-3 inline mr-1" />
                {{ offlineDetails.hours || 'Senin - Jumat, 08:00 - 16:00' }}
              </p>
            </div>
          </div>
          
          <!-- QR Code & ID Section -->
          <div class="flex flex-col sm:flex-row items-center gap-6 rounded-xl bg-slate-50 p-4 border border-slate-200">
            <!-- QR Code -->
            <div class="flex-shrink-0 bg-white p-2 rounded-lg shadow-sm border border-slate-100">
              <img :src="qrCodeUrl" alt="QR Code Tagihan" class="h-32 w-32 object-contain" />
            </div>
            
            <!-- ID Details -->
            <div class="text-center sm:text-left flex-1">
              <p class="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">ID Pembayaran / Invoice</p>
              <div class="flex items-center justify-center sm:justify-start gap-2 mb-2">
                <span class="text-2xl font-mono font-bold text-slate-900 tracking-wider">{{ paymentId }}</span>
                <button 
                  @click="copyToClipboard(paymentId)"
                  class="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all"
                  title="Salin ID"
                >
                  <Icon name="lucide:copy" class="h-4 w-4" />
                </button>
              </div>
              <p class="text-xs text-slate-600">
                Tunjukkan QR Code atau ID ini kepada petugas loket untuk dipindai.
              </p>
            </div>
          </div>

          <div class="bg-blue-50 rounded-lg p-4 border border-blue-100 text-sm text-blue-800">
            <p class="font-medium mb-1">Catatan:</p>
            <p>{{ offlineDetails.notes || 'Harap membawa bukti tagihan ini saat melakukan pembayaran.' }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Instructions Accordion -->
    <div v-if="instructions && instructions.length > 0" class="rounded-2xl bg-white shadow-sm border border-slate-200 overflow-hidden">
      <div class="px-6 py-4 border-b border-slate-100">
        <h3 class="font-semibold text-slate-900">Panduan Pembayaran</h3>
      </div>
      <div class="divide-y divide-slate-100">
        <div v-for="(item, index) in instructions" :key="index">
          <button 
            @click="toggleAccordion(index)"
            class="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-slate-50 transition-colors focus:outline-none"
          >
            <span class="text-sm font-medium text-slate-700">{{ item.title }}</span>
            <Icon 
              name="lucide:chevron-down" 
              class="h-5 w-5 text-slate-400 transition-transform duration-200"
              :class="{ 'rotate-180': openIndex === index }"
            />
          </button>
          <div 
            v-show="openIndex === index"
            class="px-6 pb-5 text-sm text-slate-600 bg-slate-50/30"
          >
            <ol class="list-decimal ml-5 space-y-2 marker:text-slate-400 marker:font-medium">
              <li v-for="(step, stepIdx) in item.steps" :key="stepIdx" class="pl-1">{{ step }}</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useNotification } from '@/composables/useNotification';

const props = defineProps({
  methodType: { type: String, default: 'bank_transfer' }, // 'bank_transfer' | 'offline'
  title: { type: String, default: 'Metode Pembayaran' },
  bankName: { type: String, default: 'Bank' },
  accountNumber: { type: String, default: '' },
  instructions: { type: Array as () => Array<{title: string, steps: string[]}>, default: () => [] },
  offlineDetails: { type: Object, default: () => ({}) },
  paymentId: { type: String, default: '' },
  qrCodeData: { type: String, default: '' }
});

const { showNotification } = useNotification?.() || { showNotification: (msg: string) => alert(msg) };
const openIndex = ref<number | null>(0);

const typeLabel = computed(() => props.methodType === 'bank_transfer' ? 'Transfer Virtual Account' : 'Pembayaran Manual');
const iconName = computed(() => props.methodType === 'bank_transfer' ? 'lucide:credit-card' : 'lucide:wallet');

const bankColorClass = computed(() => {
  const name = props.bankName.toLowerCase();
  if (name.includes('bca')) return 'text-blue-700';
  if (name.includes('bni')) return 'text-orange-600';
  if (name.includes('bri')) return 'text-blue-800';
  if (name.includes('mandiri')) return 'text-yellow-600';
  if (name.includes('bsi')) return 'text-emerald-600';
  return 'text-slate-700';
});

const qrCodeUrl = computed(() => {
  const data = props.qrCodeData || props.paymentId || 'N/A';
  return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(data)}`;
});

const copyToClipboard = (text: string) => {
  if (!text) return;
  navigator.clipboard.writeText(text);
  showNotification('Nomor berhasil disalin!', 'success');
};

const toggleAccordion = (idx: number) => {
  openIndex.value = openIndex.value === idx ? null : idx;
};
</script>