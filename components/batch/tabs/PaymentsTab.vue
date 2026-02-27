<template>
  <div class="card">
    <!-- Header + Toolbar -->
    <div
      class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4 border-b border-gray-100 pb-4"
    >
      <div>
        <h3 class="card-title mb-1">Riwayat Pembayaran</h3>
        <p class="text-xs text-gray-500">
          Kelola pembayaran peserta pada batch ini.
        </p>
      </div>

      <!-- Filter & Search -->
      <div
        class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto"
      >
        <div
          class="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 w-full sm:w-auto"
        >
          <Icon name="lucide:filter" class="w-4 h-4 text-gray-400 flex-shrink-0" />
          <select
            v-model="selectedStatus"
            class="input !border-0 !bg-transparent !px-0 !py-0 text-xs sm:text-sm"
          >
            <option value="">Semua Status</option>
            <option value="Paid">Lunas (Paid)</option>
            <option value="Pending">Pending</option>
          </select>
        </div>

        <div
          class="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 w-full sm:w-60"
        >
          <Icon name="lucide:search" class="w-4 h-4 text-gray-400 flex-shrink-0" />
          <input
            v-model="q"
            placeholder="Cari nama peserta..."
            class="input !border-0 !bg-transparent !px-0 !py-0 text-xs sm:text-sm"
          />
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto">
      <table class="w-full text-sm min-w-[640px]">
        <thead>
          <tr class="text-left text-xs text-gray-500 bg-gray-50 border-y border-gray-100">
            <th class="px-4 py-3 font-semibold">
              <button
                @click="sortBy('name')"
                class="flex items-center gap-1 hover:text-gray-900"
              >
                Nama Peserta
                <Icon
                  v-if="sortKey === 'name'"
                  :name="sortOrder === 'asc' ? 'lucide:arrow-up' : 'lucide:arrow-down'"
                  class="w-3 h-3"
                />
              </button>
            </th>
            <th class="px-4 py-3 font-semibold">Jumlah</th>
            <th class="px-4 py-3 font-semibold">
              <button
                @click="sortBy('date')"
                class="flex items-center gap-1 hover:text-gray-900"
              >
                Tanggal Pembayaran
                <Icon
                  v-if="sortKey === 'date'"
                  :name="sortOrder === 'asc' ? 'lucide:arrow-up' : 'lucide:arrow-down'"
                  class="w-3 h-3"
                />
              </button>
            </th>
            <th class="px-4 py-3 font-semibold text-center">Status</th>
            <th class="px-4 py-3 font-semibold text-right">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="payment in paginatedPayments"
            :key="payment.id"
            class="border-b border-gray-100 hover:bg-gray-50/60 transition-colors"
          >
            <td class="px-4 py-3 font-medium text-gray-800">
              {{ payment.name }}
            </td>
            <td class="px-4 py-3 text-gray-800">
              {{ formatCurrency(payment.amount) }}
            </td>
            <td class="px-4 py-3 text-gray-600">
              {{ payment.date }}
            </td>
            <td class="px-4 py-3 text-center">
              <span
                :class="paymentStatusClass(payment.status)"
                class="inline-flex items-center justify-center px-3 py-1 text-[11px] rounded-full font-semibold"
              >
                {{ payment.status }}
              </span>
            </td>
            <td class="px-4 py-3 text-right">
              <button
                @click="showPaymentDetails(payment)"
                class="btn-small inline-flex items-center gap-1"
              >
                <Icon name="lucide:eye" class="w-3 h-3" />
                <span>Detail</span>
              </button>
            </td>
          </tr>

          <tr v-if="!sortedPayments.length && q">
            <td colspan="5" class="py-6 text-center text-sm text-gray-500">
              Tidak ada data pembayaran yang cocok dengan pencarian Anda.
            </td>
          </tr>

          <tr v-else-if="!sortedPayments.length">
            <td colspan="5" class="py-6 text-center text-sm text-gray-500">
              Belum ada data pembayaran untuk batch ini.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div
      v-if="totalPages > 1"
      class="flex flex-col sm:flex-row items-center justify-between gap-3 mt-6 text-xs sm:text-sm"
    >
      <div class="flex items-center gap-2">
        <button
          @click="prevPage"
          :disabled="currentPage === 1"
          class="px-3 py-2 border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          Sebelumnya
        </button>
        <button
          @click="nextPage"
          :disabled="currentPage === totalPages"
          class="px-3 py-2 border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          Berikutnya
        </button>
      </div>
      <span class="text-gray-600">
        Halaman
        <span class="font-semibold">{{ currentPage }}</span>
        dari
        <span class="font-semibold">{{ totalPages }}</span>
      </span>
    </div>

    <!-- Modal Detail Pembayaran -->
    <PaymentDetailModal
      v-model="isDetailModalOpen"
      :payment="selectedPayment"
      @confirmPayment="handleConfirmPayment"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import PaymentDetailModal from '@/components/batch/modals/PaymentDetailModal.vue';

const props = defineProps({
  batch: { type: Object, required: true },
});

const q = ref('');
const currentPage = ref(1);
const itemsPerPage = ref(5);
const sortKey = ref('date');
const sortOrder = ref('desc');
const selectedStatus = ref('');

const isDetailModalOpen = ref(false);
const selectedPayment = ref(null);

const showPaymentDetails = (payment) => {
  selectedPayment.value = payment;
  isDetailModalOpen.value = true;
};

const handleConfirmPayment = (paymentData) => {
  // Payment confirmation

  const paymentInArray = props.batch.payments.find((p) => p.id === paymentData.id);
  if (paymentInArray) {
    paymentInArray.status = 'Paid';
  }

  const participantInArray = props.batch.participants.find(
    (p) => p.name === paymentData.name
  );
  if (participantInArray) {
    participantInArray.paymentStatus = 'Paid';
  }
};

const filteredPayments = computed(() => {
  const query = q.value.toLowerCase();
  const status = selectedStatus.value;

  return props.batch.payments.filter((p) => {
    const nameMatch = p.name.toLowerCase().includes(query);
    const statusMatch = !status || p.status === status;
    return nameMatch && statusMatch;
  });
});

const sortedPayments = computed(() => {
  const data = [...filteredPayments.value];
  data.sort((a, b) => {
    let valA = a[sortKey.value];
    let valB = b[sortKey.value];

    if (sortKey.value === 'date') {
      const monthMap = {
        Jan: 0,
        Feb: 1,
        Mar: 2,
        Apr: 3,
        Mei: 4,
        Jun: 5,
        Jul: 6,
        Agu: 7,
        Sep: 8,
        Okt: 9,
        Nov: 10,
        Des: 11,
      };
      const parseDate = (dateStr) => {
        const parts = dateStr.split(' ');
        return new Date(parts[2], monthMap[parts[1]], parts[0]);
      };
      valA = parseDate(a.date);
      valB = parseDate(b.date);
    }

    if (typeof valA === 'string') {
      valA = valA.toLowerCase();
      valB = valB.toLowerCase();
    }

    if (valA < valB) return sortOrder.value === 'asc' ? -1 : 1;
    if (valA > valB) return sortOrder.value === 'asc' ? 1 : -1;
    return 0;
  });
  return data;
});

watch([q, selectedStatus], () => {
  currentPage.value = 1;
});

const totalPages = computed(() =>
  Math.ceil(sortedPayments.value.length / itemsPerPage.value)
);

const paginatedPayments = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return sortedPayments.value.slice(start, end);
});

const formatCurrency = (value) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value);

const paymentStatusClass = (status) => {
  const s = status.toLowerCase();
  if (s === 'paid') return 'bg-emerald-100 text-emerald-800';
  if (s === 'pending') return 'bg-amber-100 text-amber-800';
  return 'bg-red-100 text-red-800';
};

const sortBy = (key) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortKey.value = key;
    sortOrder.value = 'asc';
  }
  currentPage.value = 1;
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};
</script>
