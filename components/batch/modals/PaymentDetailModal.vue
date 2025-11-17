<template>
  <Transition name="modal-fade">
    <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-60" @click.self="closeModal">
      <Transition name="modal-scale">
        <div v-if="modelValue && payment" class="relative transform overflow-hidden rounded-2xl bg-gray-50 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
          <!-- Tampilan Detail Transaksi -->
          <template v-if="!isConfirming">
            <div class="bg-white px-6 pt-5 pb-6">
              <div class="sm:flex sm:items-start">
                <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-teal-100 sm:mx-0 sm:h-10 sm:w-10">
                  <Icon name="lucide:receipt" class="h-6 w-6 text-teal-600" aria-hidden="true" />
                </div>
                <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                  <h3 class="text-lg font-semibold leading-6 text-gray-900">Detail Transaksi</h3>
                  <p class="text-sm text-gray-500">ID Transaksi: #{{ payment.id.toString().padStart(5, '0') }}</p>
                  
                  <div class="mt-5 space-y-4 border-t pt-4">
                    <!-- Detail Peserta -->
                    <div>
                      <p class="text-xs font-medium text-gray-500 uppercase">Peserta</p>
                      <p class="font-semibold text-gray-800">{{ payment.name }}</p>
                      <p class="text-sm text-gray-600">{{ payment.email || 'email-peserta@example.com' }}</p>
                    </div>

                    <!-- Detail Pembayaran -->
                    <div class="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p class="text-xs font-medium text-gray-500 uppercase">Jumlah</p>
                        <p class="font-semibold text-gray-800">{{ formatCurrency(payment.amount) }}</p>
                      </div>
                      <div>
                        <p class="text-xs font-medium text-gray-500 uppercase">Tanggal</p>
                        <p class="font-semibold text-gray-800">{{ payment.date }}</p>
                      </div>
                      <div>
                        <p class="text-xs font-medium text-gray-500 uppercase">Metode</p>
                        <p class="font-semibold text-gray-800">Bank Transfer</p>
                      </div>
                      <div>
                        <p class="text-xs font-medium text-gray-500 uppercase">Status</p>
                        <span :class="paymentStatusClass(payment.status)" class="px-3 py-1 text-xs rounded-full font-semibold">
                          {{ payment.status }}
                        </span>
                      </div>
                    </div>

                    <!-- Bukti Pembayaran (Dummy) -->
                    <div v-if="payment.status !== 'Unpaid'">
                      <p class="text-xs font-medium text-gray-500 uppercase mb-2">Bukti Pembayaran</p>
                      <div class="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center border border-dashed">
                        <p class="text-gray-500 text-sm">Gambar Bukti Transfer.jpg</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="bg-gray-100 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 rounded-b-2xl">
              <button
                v-if="payment && payment.status === 'Pending'"
                type="button"
                class="inline-flex w-full justify-center rounded-md bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-700 sm:ml-3 sm:w-auto"
                @click="isConfirming = true"
              >
                Tandai sebagai Lunas
              </button>
              <button
                type="button"
                class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                @click="closeModal"
              >
                Tutup
              </button>
            </div>
          </template>

          <!-- Tampilan Form Konfirmasi Pembayaran -->
          <template v-else>
            <form @submit.prevent="handleConfirmPayment">
              <div class="bg-white px-6 pt-5 pb-6">
                <div class="sm:flex sm:items-start">
                  <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                    <Icon name="lucide:check-circle" class="h-6 w-6 text-blue-600" aria-hidden="true" />
                  </div>
                  <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 class="text-lg font-semibold leading-6 text-gray-900">Konfirmasi Pembayaran</h3>
                    <p class="text-sm text-gray-500">Lengkapi detail konfirmasi untuk <span class="font-medium">{{ payment.name }}</span>.</p>
                    
                    <div class="mt-4 space-y-4">
                      <div>
                        <label for="confirmationDate" class="block text-sm font-medium text-gray-700">Tanggal Konfirmasi</label>
                        <input type="date" v-model="confirmationData.confirmationDate" id="confirmationDate" class="input mt-1" required />
                      </div>
                      <div>
                        <label for="paymentMethod" class="block text-sm font-medium text-gray-700">Metode Pembayaran</label>
                        <select v-model="confirmationData.paymentMethod" id="paymentMethod" class="input mt-1 bg-white" required>
                          <option>Bank Transfer</option>
                          <option>Digital Wallet</option>
                          <option>Cash</option>
                          <option>Other</option>
                        </select>
                      </div>
                      <div>
                        <label for="notes" class="block text-sm font-medium text-gray-700">Catatan (Opsional)</label>
                        <textarea v-model="confirmationData.notes" id="notes" rows="3" class="input mt-1" placeholder="Contoh: Pembayaran lunas via transfer BCA..."></textarea>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="bg-gray-100 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 rounded-b-2xl">
                <button
                  type="submit"
                  class="inline-flex w-full justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 sm:ml-3 sm:w-auto"
                >
                  Konfirmasi & Simpan
                </button>
                <button
                  type="button"
                  class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                  @click="isConfirming = false"
                >
                  Batal
                </button>
              </div>
            </form>
          </template>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  modelValue: Boolean,
  payment: { type: Object, default: null },
});

const emit = defineEmits(['update:modelValue', 'confirmPayment']);

const isConfirming = ref(false);
const confirmationData = ref({
  confirmationDate: new Date().toISOString().slice(0, 10), // Default to today
  paymentMethod: 'Bank Transfer',
  notes: '',
});

const closeModal = () => {
  emit('update:modelValue', false);
  // Reset state saat modal ditutup
  setTimeout(() => {
    isConfirming.value = false;
    confirmationData.value = {
      confirmationDate: new Date().toISOString().slice(0, 10),
      paymentMethod: 'Bank Transfer',
      notes: '',
    };
  }, 300); // Tunggu animasi selesai
};

const handleConfirmPayment = () => {
  emit('confirmPayment', {
    ...props.payment,
    confirmationLog: { ...confirmationData.value }
  });
  closeModal();
};

const formatCurrency = (value) => {
  if (!value) return 'Rp 0';
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(value);
};

const paymentStatusClass = (status) => {
  if (!status) return '';
  const s = status.toLowerCase();
  if (s === 'paid') return 'bg-emerald-100 text-emerald-800';
  if (s === 'pending') return 'bg-amber-100 text-amber-800';
  return 'bg-red-100 text-red-800';
};

const handleKeydown = (e) => {
  if (e.key === 'Escape') closeModal();
};

watch(() => props.modelValue, (isOpen) => {
  if (isOpen) {
    document.addEventListener('keydown', handleKeydown);
  } else {
    document.removeEventListener('keydown', handleKeydown);
  }
});
</script>

<style scoped>
/* Animasi sama seperti modal sebelumnya */
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.3s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
.modal-scale-enter-active { transition: all 0.3s ease-out; }
.modal-scale-leave-active { transition: all 0.2s ease-in; }
.modal-scale-enter-from, .modal-scale-leave-to { opacity: 0; transform: translateY(1rem) scale(0.95); }

.input {
  @apply w-full border border-gray-300 p-2 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500;
}
</style>