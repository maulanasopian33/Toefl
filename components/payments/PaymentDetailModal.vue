<template>
  <TransitionRoot appear :show="!!modelValue" as="template">
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
            <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-[2rem] bg-white p-6 text-left align-middle shadow-xl transition-all border border-gray-100">
              <DialogTitle as="h3" class="text-lg font-extrabold leading-6 text-gray-900 mb-6 flex items-center gap-2">
                 <div class="p-1.5 bg-amber-100 rounded-lg">
                    <Icon name="lucide:receipt" class="w-5 h-5 text-amber-600" />
                 </div>
                 Detail Pembayaran
              </DialogTitle>
              
              <div v-if="editablePayment" class="space-y-6">
                <!-- Mode Lihat -->
                <div v-if="!isEditing" class="space-y-4">
                  <div class="bg-gray-50 p-5 rounded-[1.5rem] border border-gray-100 space-y-3">
                    <div class="flex justify-between items-center group/item">
                       <dt class="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Peserta</dt>
                       <dd class="text-sm font-black text-gray-800">{{ editablePayment.name }}</dd>
                    </div>
                    <div class="flex justify-between items-center group/item">
                       <dt class="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Email</dt>
                       <dd class="text-xs font-bold text-gray-500">{{ editablePayment.email }}</dd>
                    </div>
                    <div class="flex justify-between items-center group/item">
                       <dt class="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Batch</dt>
                       <dd class="text-sm font-black text-gray-800">{{ editablePayment.batchName || '-' }}</dd>
                    </div>
                  </div>

                  <div class="bg-indigo-50/50 p-5 rounded-[1.5rem] border border-indigo-100/50 space-y-3">
                    <div class="flex justify-between items-center group/item">
                       <dt class="text-[10px] font-bold text-indigo-400 uppercase tracking-widest leading-none">Jumlah</dt>
                       <dd class="text-lg font-black text-indigo-700 tabular-nums">{{ formatCurrency(editablePayment.amount) }}</dd>
                    </div>
                    <div class="flex justify-between items-center group/item">
                       <dt class="text-[10px] font-bold text-indigo-400 uppercase tracking-widest leading-none">Status</dt>
                       <dd>
                          <span :class="['px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider border', 
                            editablePayment.status === 'Paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                            editablePayment.status === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-100' : 
                            'bg-rose-50 text-rose-700 border-rose-100']">
                             {{ editablePayment.status }}
                          </span>
                       </dd>
                    </div>
                    <div class="flex justify-between items-center group/item">
                       <dt class="text-[10px] font-bold text-indigo-400 uppercase tracking-widest leading-none">Tanggal</dt>
                       <dd class="text-xs font-bold text-indigo-600">{{ formatDate(editablePayment.date) }}</dd>
                    </div>
                  </div>
                </div>

                <!-- Mode Edit -->
                <div v-else class="space-y-4">
                  <div class="space-y-2">
                    <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none px-1">Jumlah (Amount)</label>
                    <input 
                      type="number" 
                      v-model.number="editablePayment.amount" 
                      class="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 outline-none transition-all font-bold text-gray-700 text-sm" 
                    />
                  </div>
                  <div class="space-y-2">
                    <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none px-1">Status Pembayaran</label>
                    <div class="relative group">
                       <select 
                         v-model="editablePayment.status" 
                         class="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 outline-none transition-all font-bold text-gray-700 text-sm appearance-none"
                       >
                         <option value="Paid">Paid</option>
                         <option value="Pending">Pending</option>
                         <option value="Failed">Failed</option>
                         <option value="Refunded">Refunded</option>
                       </select>
                       <div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover:text-amber-500 transition-colors">
                          <Icon name="lucide:chevron-down" class="w-4 h-4" />
                       </div>
                    </div>
                  </div>
                </div>

                <!-- Bukti Pembayaran -->
                <div v-if="editablePayment.payment_proof" class="space-y-3">
                  <div class="flex items-center gap-2 px-1">
                     <Icon name="lucide:image" class="w-4 h-4 text-gray-400" />
                     <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Bukti Pembayaran</p>
                  </div>
                  <div class="group relative overflow-hidden rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-xl">
                    <img
                      :src="editablePayment.payment_proof"
                      alt="Bukti Pembayaran"
                      class="w-full h-auto max-h-96 object-contain bg-gray-50"
                    />
                    <div class="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                       <a :href="editablePayment.payment_proof" target="_blank" class="bg-white/20 backdrop-blur-md p-2 rounded-xl border border-white/30 text-white hover:bg-white/30 transition-all shadow-lg" title="Open in New Tab">
                          <Icon name="lucide:external-link" class="w-5 h-5" />
                       </a>
                    </div>
                  </div>
                </div>

                <!-- Footer Actions -->
                <div class="mt-8 flex items-center justify-end gap-3 pt-6 border-t border-gray-50">
                  <template v-if="!isEditing">
                    <button 
                      type="button"
                      @click="closeModal"
                      class="px-4 py-2.5 rounded-xl text-gray-700 hover:bg-gray-100 font-medium transition-colors text-sm"
                    >
                       Tutup
                    </button>
                    
                    <!-- Confirmation Actions for Pending -->
                    <template v-if="editablePayment.status === 'Pending'">
                      <button
                        type="button"
                        @click="$emit('markAsFailed', editablePayment)"
                        class="px-5 py-2.5 rounded-xl border border-rose-200 text-rose-600 font-bold hover:bg-rose-50 transition-all flex items-center gap-2 text-sm"
                      >
                        <Icon name="lucide:x-circle" class="w-4 h-4" />
                        Tolak
                      </button>
                      <button
                        type="button"
                        @click="$emit('markAsPaid', editablePayment)"
                        class="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black shadow-lg shadow-emerald-600/20 transition-all transform active:scale-95 flex items-center gap-2 text-sm"
                      >
                        <Icon name="lucide:check-circle" class="w-4 h-4" />
                        Terima & Verifikasi
                      </button>
                    </template>

                    <!-- Default Edit Action if not Pending or if already Paid -->
                    <button 
                      v-else
                      type="button"
                      @click="isEditing = true"
                      class="px-5 py-2.5 rounded-xl bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 transition-all flex items-center gap-2 text-sm"
                    >
                       <Icon name="lucide:edit-2" class="w-3.5 h-3.5" />
                       Edit Detail
                    </button>
                  </template>
                  <template v-else>
                    <button 
                      type="button"
                      @click="isEditing = false"
                      class="px-4 py-2.5 rounded-xl text-gray-700 hover:bg-gray-100 font-medium transition-colors text-sm"
                    >
                       Batal
                    </button>
                    <button 
                      type="button"
                      @click="saveChanges"
                      class="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black shadow-lg shadow-amber-600/20 transition-all transform active:scale-95 flex items-center gap-2 text-sm"
                    >
                       Simpan Perubahan
                    </button>
                  </template>
                </div>
              </div>
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
  modelValue: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(['update:modelValue', 'markAsPaid', 'markAsPending', 'saveEdit']);

const isEditing = ref(false);
const editablePayment = ref(null);

watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    editablePayment.value = { ...newVal };
  } else {
    editablePayment.value = null;
  }
  isEditing.value = false;
}, { deep: true, immediate: true });

const closeModal = () => {
  emit('update:modelValue', null);
};

const saveChanges = () => {
  if (!editablePayment.value) return;
  emit('saveEdit', editablePayment.value);
  isEditing.value = false;
};

const formatCurrency = (value) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value || 0);

const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(d);
};
</script>