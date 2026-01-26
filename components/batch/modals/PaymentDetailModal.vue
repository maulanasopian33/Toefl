<template>
  <TransitionRoot appear :show="modelValue" as="template">
    <Dialog as="div" @close="closeModal" class="relative z-50">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/25 backdrop-blur-sm" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all border border-gray-100">
              
              <!-- Tampilan Detail Transaksi -->
              <template v-if="!isConfirming && payment">
                <DialogTitle as="h3" class="text-lg font-bold leading-6 text-gray-900 mb-6 flex items-center gap-2">
                   <div class="p-1.5 bg-teal-100 rounded-lg">
                      <Icon name="lucide:receipt" class="w-5 h-5 text-teal-600" />
                   </div>
                   Detail Transaksi
                </DialogTitle>
                
                <div class="space-y-6">
                   <div class="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                      <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 leading-none">ID Transaksi</p>
                      <p class="font-extrabold text-gray-900 text-lg tabular-nums">#{{ payment.id.toString().padStart(5, '0') }}</p>
                   </div>

                   <div class="space-y-4">
                      <div class="flex flex-col">
                         <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">Informasi Peserta</p>
                         <div class="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                            <p class="font-bold text-gray-800">{{ payment.name }}</p>
                            <p class="text-sm text-gray-500 font-medium">{{ payment.email || 'email-peserta@example.com' }}</p>
                         </div>
                      </div>

                      <div class="grid grid-cols-2 gap-4">
                         <div class="bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                            <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Jumlah</p>
                            <p class="font-black text-gray-900 text-sm tabular-nums">{{ formatCurrency(payment.amount) }}</p>
                         </div>
                         <div class="bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                            <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Status</p>
                            <span :class="paymentStatusClass(payment.status)" class="inline-flex px-2 py-0.5 text-[10px] rounded-lg font-bold border">
                              {{ payment.status }}
                            </span>
                         </div>
                         <div class="bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                            <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Tanggal</p>
                            <p class="font-bold text-gray-700 text-xs">{{ payment.date }}</p>
                         </div>
                         <div class="bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                            <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Metode</p>
                            <p class="font-bold text-gray-700 text-xs text-emerald-600">Bank Transfer</p>
                         </div>
                      </div>
                   </div>

                   <!-- Bukti Pembayaran -->
                   <div v-if="payment.status !== 'Unpaid'">
                      <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">Bukti Pembayaran</p>
                      <div class="w-full aspect-video bg-gray-50 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-gray-200 group hover:border-blue-200 transition-colors cursor-zoom-in">
                        <Icon name="lucide:image" class="w-10 h-10 text-gray-300 group-hover:text-blue-300 transition-colors" />
                        <p class="text-gray-400 text-[10px] font-bold mt-2">Gambar Bukti Transfer.jpg</p>
                      </div>
                   </div>

                   <div class="mt-8 flex justify-end gap-3">
                      <button 
                        type="button" 
                        @click="closeModal"
                        class="px-4 py-2.5 rounded-xl text-gray-700 hover:bg-gray-100 font-medium transition-colors text-sm"
                      >
                         Tutup
                      </button>
                      <button 
                        v-if="payment && payment.status === 'Pending'"
                        @click="isConfirming = true"
                        class="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-lg shadow-emerald-600/20 transition-all transform active:scale-95 flex items-center gap-2 text-sm"
                      >
                         <Icon name="lucide:check-circle" class="w-4 h-4" />
                         Tandai Lunas
                      </button>
                   </div>
                </div>
              </template>

              <!-- Tampilan Form Konfirmasi Pembayaran -->
              <template v-else-if="payment">
                <DialogTitle as="h3" class="text-lg font-bold leading-6 text-gray-900 mb-6 flex items-center gap-2">
                   <div class="p-1.5 bg-blue-100 rounded-lg">
                      <Icon name="lucide:check-circle" class="w-5 h-5 text-blue-600" />
                   </div>
                   Konfirmasi Pembayaran
                </DialogTitle>
                
                <form @submit.prevent="handleConfirmPayment" class="space-y-5">
                   <div class="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                      <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Konfirmasi Untuk</p>
                      <p class="font-bold text-gray-800 text-sm">{{ payment.name }}</p>
                   </div>
                   
                   <div class="space-y-2">
                      <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none px-1">Tanggal Konfirmasi</label>
                      <input 
                        type="date" 
                        v-model="confirmationData.confirmationDate" 
                        class="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-gray-700 text-sm"
                        required 
                      />
                   </div>

                   <div class="space-y-2">
                      <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none px-1">Metode Pembayaran</label>
                      <select 
                        v-model="confirmationData.paymentMethod" 
                        class="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-gray-700 text-sm cursor-pointer"
                        required
                      >
                        <option>Bank Transfer</option>
                        <option>Digital Wallet</option>
                        <option>Cash</option>
                        <option>Other</option>
                      </select>
                   </div>

                   <div class="space-y-2">
                      <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none px-1">Catatan (Opsional)</label>
                      <textarea 
                        v-model="confirmationData.notes" 
                        rows="3" 
                        class="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium text-gray-700 text-sm"
                        placeholder="Contoh: Pembayaran lunas via transfer BCA..."
                      ></textarea>
                   </div>

                   <div class="mt-8 flex justify-end gap-3">
                      <button 
                        type="button" 
                        @click="isConfirming = false"
                        class="px-4 py-2.5 rounded-xl text-gray-700 hover:bg-gray-100 font-medium transition-colors text-sm"
                      >
                         Kembali
                      </button>
                      <button 
                        type="submit" 
                        class="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-200 transition-all transform active:scale-95 flex items-center gap-2 text-sm"
                      >
                         Konfirmasi & Simpan
                      </button>
                   </div>
                </form>
              </template>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { ref, watch } from 'vue';
import { Dialog, DialogPanel, DialogTitle, TransitionRoot, TransitionChild } from '@headlessui/vue'

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
  if (s === 'paid') return 'bg-emerald-50 text-emerald-700 border-emerald-100';
  if (s === 'pending') return 'bg-amber-50 text-amber-700 border-amber-100';
  return 'bg-rose-50 text-rose-700 border-rose-100';
};
</script>