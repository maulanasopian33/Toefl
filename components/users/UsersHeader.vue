<template>
  <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
    <div>
      <h1 class="text-xl font-semibold text-slate-900 sm:text-2xl">
        Manajemen Peserta
      </h1>
      <p class="mt-1 text-sm text-slate-500">
        Kelola akun peserta, verifikasi status, dan lakukan tindakan admin.
      </p>
    </div>

    <div class="flex items-center gap-3">
      <button
        type="button"
        class="hidden rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 sm:inline-flex sm:items-center sm:gap-2"
        @click="$emit('sync')"
      >
        <span class="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
        <span>Sinkronkan Data</span>
      </button>
    </div>
  </div>
</template>