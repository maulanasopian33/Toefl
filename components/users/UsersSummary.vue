<template>
  <div class="grid gap-4 md:grid-cols-3">
    <div class="flex items-center justify-between rounded-2xl bg-white px-4 py-4 shadow-sm ring-1 ring-slate-100 sm:px-5">
      <div>
        <p class="text-xs font-medium uppercase tracking-wide text-slate-500">
          Total User
        </p>
        <p class="mt-2 text-2xl font-semibold text-slate-900">
          {{ totalCount }}
        </p>
        <p class="mt-1 text-xs text-slate-500">
          Semua akun terdaftar
        </p>
      </div>
      <div class="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-50">
        <Icon name="lucide:users" class="h-5 w-5 text-indigo-600" />
      </div>
    </div>

    <div class="flex items-center justify-between rounded-2xl bg-white px-4 py-4 shadow-sm ring-1 ring-slate-100 sm:px-5">
      <div>
        <p class="text-xs font-medium uppercase tracking-wide text-slate-500">
          Email Terverifikasi
        </p>
        <p class="mt-2 text-2xl font-semibold text-emerald-600">
          {{ verifiedCount }}
        </p>
        <p class="mt-1 text-xs text-slate-500">
          {{ totalCount > 0 ? ((verifiedCount / totalCount) * 100).toFixed(0) : 0 }}% dari total user
        </p>
      </div>
      <div class="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50">
        <Icon name="lucide:mail-check" class="h-5 w-5 text-emerald-600" />
      </div>
    </div>

    <div class="flex items-center justify-between rounded-2xl bg-white px-4 py-4 shadow-sm ring-1 ring-slate-100 sm:px-5">
      <div>
        <p class="text-xs font-medium uppercase tracking-wide text-slate-500">
          Akun Aktif
        </p>
        <p class="mt-2 text-2xl font-semibold text-amber-500">
          {{ activeCount }}
        </p>
        <p class="mt-1 text-xs text-slate-500">
          {{ disabledCount }} akun nonaktif
        </p>
      </div>
      <div class="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-50">
        <Icon name="lucide:shield-check" class="h-5 w-5 text-amber-600" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  totalCount: number
  verifiedCount: number
  activeCount: number
  disabledCount: number
}>()
</script>