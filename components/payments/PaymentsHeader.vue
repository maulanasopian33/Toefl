<template>
  <div class="card">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4 border-b border-gray-100 pb-3">
      <div>
        <h2 class="text-lg font-semibold text-gray-900">Global Payments</h2>
        <p class="text-xs text-gray-500">Pantau semua pembayaran peserta lintas batch TOAFL.</p>
      </div>
      <div class="flex gap-2 w-full md:w-auto justify-end">
        <NuxtLink to="/admin/payments/add" class="btn-secondary inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm">
          <Icon name="lucide:plus" class="h-4 w-4" />
          <span>Tambah Pembayaran</span>
        </NuxtLink>
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div class="flex items-center gap-3">
        <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 ring-1 ring-sky-100">
          <Icon name="lucide:receipt" class="w-5 h-5 text-sky-700" />
        </div>
        <div>
          <p class="text-[11px] text-gray-500 uppercase tracking-wide">Total Transaksi</p>
          <p class="text-sm font-semibold text-gray-900">{{ totalItems }} transaksi</p>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 ring-1 ring-emerald-100">
          <Icon name="lucide:check-circle-2" class="w-5 h-5 text-emerald-700" />
        </div>
        <div>
          <p class="text-[11px] text-gray-500 uppercase tracking-wide">Lunas (Paid)</p>
          <p class="text-sm font-semibold text-gray-900">{{ paidCount }} transaksi</p>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 ring-1 ring-amber-100">
          <Icon name="lucide:alert-circle" class="w-5 h-5 text-amber-700" />
        </div>
        <div>
          <p class="text-[11px] text-gray-500 uppercase tracking-wide">Pending / Belum Lunas</p>
          <p class="text-sm font-semibold text-gray-900">{{ nonPaidCount }} transaksi</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  totalItems: {
    type: Number,
    default: 0,
  },
  paidCount: {
    type: Number,
    default: 0,
  },
  nonPaidCount: {
    type: Number,
    default: 0,
  },
});
</script>