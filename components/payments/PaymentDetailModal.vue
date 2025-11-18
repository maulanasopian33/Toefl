<template>
  <div v-if="modelValue" class="fixed inset-0 z-40 bg-black/40 flex items-center justify-center" @click.self="closeModal">
    <div class="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 overflow-hidden">
      <div class="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <p class="text-sm font-semibold text-gray-900">Detail Pembayaran</p>
        <button class="text-gray-400 hover:text-gray-700" @click="$emit('update:modelValue', null)">
          <Icon name="lucide:x" class="w-4 h-4" />
        </button>
      </div>
      <div v-if="editablePayment" class="p-4 space-y-4 text-sm text-gray-700 max-h-[70vh] overflow-y-auto">
        <!-- Mode Lihat -->
        <div v-if="!isEditing" class="space-y-2">
          <p><span class="font-semibold">Peserta:</span> {{ editablePayment.name }}</p>
          <p><span class="font-semibold">Email:</span> {{ editablePayment.email }}</p>
          <p><span class="font-semibold">Batch:</span> {{ editablePayment.batchName || '-' }}</p>
          <p><span class="font-semibold">Jumlah:</span> {{ formatCurrency(editablePayment.amount) }}</p>
          <p><span class="font-semibold">Status:</span> {{ editablePayment.status }}</p>
          <p><span class="font-semibold">Tanggal:</span> {{ formatDate(editablePayment.date) }}</p>
        </div>

        <!-- Mode Edit -->
        <div v-else class="space-y-4">
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">Jumlah (Amount)</label>
            <input type="number" v-model.number="editablePayment.amount" class="input w-full" />
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">Status</label>
            <select v-model="editablePayment.status" class="input w-full">
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
              <option value="Refunded">Refunded</option>
            </select>
          </div>
        </div>

        <!-- Tampilkan Bukti Pembayaran jika ada -->
        <div v-if="editablePayment.payment_proof" class="pt-2 border-t border-gray-100">
          <p class="font-semibold mb-2">Bukti Pembayaran:</p>
          <a :href="editablePayment.payment_proof" target="_blank" rel="noopener noreferrer">
            <img
              :src="editablePayment.payment_proof"
              alt="Bukti Pembayaran"
              class="w-full rounded-lg border border-gray-200 cursor-pointer hover:opacity-80 transition-opacity"
            />
          </a>
        </div>
      </div>

      <!-- Tombol Aksi -->
      <div class="px-4 py-3 border-t border-gray-100 flex items-center justify-end gap-2">
        <!-- Tombol Mode Lihat -->
        <template v-if="!isEditing">
          <button class="btn-small" @click="closeModal">Tutup</button>
          <button class="btn-secondary px-4 py-2 text-xs" @click="isEditing = true">Edit</button>
          <button
            v-if="editablePayment && editablePayment.status !== 'Paid'"
            class="btn-primary px-4 py-2 text-xs"
            @click="$emit('markAsPaid', editablePayment)"
          >
            Tandai Lunas
          </button>
        </template>
        <!-- Tombol Mode Edit -->
        <template v-else>
          <button class="btn-small" @click="isEditing = false">Batal</button>
          <button class="btn-primary px-4 py-2 text-xs" @click="saveChanges">Simpan Perubahan</button>
        </template>
        <!--
        <button
          v-if="payment && payment.status === 'Paid'"
          class="btn-warning px-4 py-2 text-xs"
          @click="$emit('markAsPending', payment)"
        >
          Tandai Pending
        </button>
        <button
          v-if="payment && payment.status !== 'Paid'"
          class="btn-primary px-4 py-2 text-xs"
          @click="$emit('markAsPaid', payment)"
        >
          Tandai Lunas
        </button>
        -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

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
    // Buat salinan data agar tidak mengubah prop secara langsung
    editablePayment.value = { ...newVal };
  } else {
    editablePayment.value = null;
  }
  // Reset mode edit setiap kali modal dibuka
  isEditing.value = false;
}, { deep: true });

const closeModal = () => {
  emit('update:modelValue', null);
};

const saveChanges = () => {
  if (!editablePayment.value) return;
  // Kirim data yang sudah diedit ke parent
  emit('saveEdit', editablePayment.value);
  // Nonaktifkan mode edit setelah menyimpan
  isEditing.value = false;
};

// const payment = computed(() => props.modelValue);

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