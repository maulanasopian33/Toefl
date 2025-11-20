<template>
  <div class="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100 sm:p-5 lg:p-6">
    <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div class="space-y-4 lg:flex-1">
        <h2 class="text-sm font-medium text-slate-700">
          Filter Peserta
        </h2>

        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <!-- Search -->
          <div class="md:col-span-2 lg:col-span-2">
            <label class="block text-xs font-medium text-slate-500">
              Cari Peserta
            </label>
            <div class="mt-1 flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500">
              <Icon name="lucide:search" class="h-4 w-4 flex-none text-slate-400" />
              <input
                :value="search"
                @input="$emit('update:search', ($event.target as HTMLInputElement).value)"
                type="text"
                placeholder="Nama, email, atau NIM"
                class="w-full border-0 bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-0"
              />
            </div>
          </div>

          <!-- Fakultas -->
          <div>
            <label class="block text-xs font-medium text-slate-500">
              Fakultas
            </label>
            <div class="mt-1">
              <select
                :value="faculty"
                @input="$emit('update:faculty', ($event.target as HTMLSelectElement).value)"
                class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 shadow-xs focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="">Semua Fakultas</option>
                <option v-for="f in facultyOptions" :key="f" :value="f">
                  {{ f }}
                </option>
              </select>
            </div>
          </div>

          <!-- Prodi -->
          <div>
            <label class="block text-xs font-medium text-slate-500">
              Program Studi
            </label>
            <div class="mt-1">
              <select
                :value="program"
                @input="$emit('update:program', ($event.target as HTMLSelectElement).value)"
                class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 shadow-xs focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="">Semua Prodi</option>
                <option v-for="p in programOptions" :key="p" :value="p">
                  {{ p }}
                </option>
              </select>
            </div>
          </div>

          <!-- Role -->
          <div>
            <label class="block text-xs font-medium text-slate-500">
              Role
            </label>
            <div class="mt-1">
              <select
                :value="role"
                @input="$emit('update:role', ($event.target as HTMLSelectElement).value)"
                class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 shadow-xs focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="">Semua Role</option>
                <option value="admin">Admin</option>
                <option value="peserta">Peserta</option>
                <option value="panitia">Panitia</option>
              </select>
            </div>
          </div>

          <!-- Email Verified -->
          <div>
            <label class="block text-xs font-medium text-slate-500">
              Verifikasi Email
            </label>
            <div class="mt-1">
              <select
                :value="emailVerified"
                @input="$emit('update:emailVerified', ($event.target as HTMLSelectElement).value)"
                class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 shadow-xs focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="">Semua</option>
                <option value="verified">Terverifikasi</option>
                <option value="unverified">Belum Verifikasi</option>
              </select>
            </div>
          </div>

          <!-- Account status -->
          <div>
            <label class="block text-xs font-medium text-slate-500">
              Status Akun
            </label>
            <div class="mt-1">
              <select
                :value="accountStatus"
                @input="$emit('update:accountStatus', ($event.target as HTMLSelectElement).value)"
                class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 shadow-xs focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="">Semua</option>
                <option value="active">Aktif</option>
                <option value="disabled">Nonaktif</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Sort & Reset -->
      <div class="mt-2 w-full shrink-0 space-y-3 lg:mt-0 lg:w-64">
        <p class="text-xs font-medium text-slate-500">
          Pengurutan & Aksi
        </p>

        <div class="space-y-2">
          <label class="block text-xs font-medium text-slate-500">
            Urutkan
          </label>
          <select
            :value="sortBy"
            @input="$emit('update:sortBy', ($event.target as HTMLSelectElement).value)"
            class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 shadow-xs focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="createdAt">Tanggal Dibuat</option>
            <option value="name">Nama</option>
            <option value="lastLogin">Terakhir Login</option>
            <option value="role">Role</option>
          </select>
        </div>

        <div class="flex gap-2 pt-1">
          <button
            type="button"
            class="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100"
            @click="$emit('reset')"
          >
            Reset
          </button>
          <button
            type="button"
            class="flex-1 rounded-xl bg-indigo-600 px-3 py-2 text-xs font-semibold text-white hover:bg-indigo-700"
          >
            Terapkan
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  search: string
  faculty: string
  program: string
  role: string
  emailVerified: string
  accountStatus: string
  sortBy: string
  facultyOptions: string[]
  programOptions: string[]
}>()

defineEmits([
  'update:search',
  'update:faculty',
  'update:program',
  'update:role',
  'update:emailVerified',
  'update:accountStatus',
  'update:sortBy',
  'reset',
])
</script>