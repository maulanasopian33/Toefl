<template>
  <div class="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100">
    <div class="flex items-center justify-between border-b border-slate-100 px-4 py-3 sm:px-5">
      <p class="text-xs text-slate-500">
        Menampilkan
        <span class="font-medium text-slate-700">{{ users.length }}</span>
        dari
        <span class="font-medium text-slate-700">{{ totalFiltered }}</span>
        user
      </p>
      <p class="hidden text-xs text-slate-500 sm:block">
        Klik ikon &middot;&middot;&middot; untuk aksi cepat
      </p>
    </div>

    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-slate-100 text-left text-sm">
        <thead class="bg-slate-50/60">
          <tr>
            <th scope="col" class="whitespace-nowrap px-4 py-3 text-xs font-medium uppercase tracking-wide text-slate-500 sm:px-5">User</th>
            <th scope="col" class="whitespace-nowrap px-4 py-3 text-xs font-medium uppercase tracking-wide text-slate-500">Data Akademik</th>
            <th scope="col" class="whitespace-nowrap px-4 py-3 text-xs font-medium uppercase tracking-wide text-slate-500">Status</th>
            <th scope="col" class="whitespace-nowrap px-4 py-3 text-xs font-medium uppercase tracking-wide text-slate-500">Aktivitas</th>
            <th scope="col" class="whitespace-nowrap px-4 py-3 text-xs font-medium uppercase tracking-wide text-slate-500"><!-- Aksi --></th>
          </tr>
        </thead>

        <tbody class="divide-y divide-slate-100 bg-white">
          <!-- Skeleton Loader -->
          <template v-if="isLoading">
            <tr v-for="i in 5" :key="`skel-${i}`" class="animate-pulse">
              <td class="max-w-xs px-4 py-3.5 sm:px-5">
                <div class="flex items-center gap-3">
                  <div class="h-9 w-9 rounded-full bg-slate-200"></div>
                  <div class="space-y-1.5">
                    <div class="h-3 w-32 rounded bg-slate-200"></div>
                    <div class="h-2 w-40 rounded bg-slate-200"></div>
                  </div>
                </div>
              </td>
              <td class="whitespace-nowrap px-4 py-3.5">
                <div class="space-y-1.5">
                  <div class="h-3 w-20 rounded bg-slate-200"></div>
                  <div class="h-2 w-36 rounded bg-slate-200"></div>
                </div>
              </td>
              <td class="whitespace-nowrap px-4 py-3.5">
                <div class="flex items-center gap-1.5">
                  <div class="h-4 w-16 rounded-full bg-slate-200"></div>
                  <div class="h-4 w-12 rounded-full bg-slate-200"></div>
                </div>
              </td>
              <td class="whitespace-nowrap px-4 py-3.5">
                <div class="space-y-1.5">
                  <div class="h-3 w-28 rounded bg-slate-200"></div>
                  <div class="h-2 w-24 rounded bg-slate-200"></div>
                </div>
              </td>
              <td class="whitespace-nowrap px-4 py-3.5 text-right">
                <div class="h-5 w-5 rounded-full bg-slate-200 ml-auto"></div>
              </td>
            </tr>
          </template>

          <!-- Empty State -->
          <tr v-else-if="users.length === 0">
            <td colspan="5" class="px-4 py-16 text-center sm:px-5">
              <div class="flex flex-col items-center gap-3">
                <Icon name="lucide:search-x" class="h-12 w-12 text-slate-300" />
                <h4 class="text-base font-semibold text-slate-700">Tidak Ada Hasil Ditemukan</h4>
                <p class="text-xs text-slate-500">Coba ubah atau atur ulang filter pencarian Anda.</p>
              </div>
            </td>
          </tr>
          <tr v-for="user in users" :key="user.uid" class="hover:bg-slate-50/70">
            <!-- User -->
            <td class="max-w-xs px-4 py-3.5 text-sm text-slate-700 sm:px-5">
              <div class="flex items-center gap-3">
                <template v-if="user.picture">
                  <img :src="apiUrl + user.picture" alt="avatar" class="h-9 w-9 rounded-full object-cover" />
                </template>
                <template v-else>
                  <div class="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-50 text-xs font-semibold text-indigo-600">
                    {{ initials(user.name) }}
                  </div>
                </template>
                <div class="space-y-0.5">
                  <p class="truncate text-sm font-medium text-slate-900">{{ user.name }}</p>
                  <p class="truncate text-xs text-slate-500">{{ user.email }}</p>
                  <p class="truncate text-[11px] text-slate-400">UID: {{ user.uid }}</p>
                </div>
              </div>
            </td>

            <!-- Akademik -->
            <td class="whitespace-nowrap px-4 py-3.5 text-sm text-slate-700">
              <div class="space-y-0.5">
                <p class="font-medium text-slate-900">{{ user.detailuser.nim || '-' }}</p>
                <p class="text-xs text-slate-500">{{ user.detailuser.fakultas || '-' }} &middot; {{ user.detailuser.prodi || '-' }}</p>
              </div>
            </td>

            <!-- Status -->
            <td class="whitespace-nowrap px-4 py-3.5 text-sm">
              <div class="flex flex-wrap items-center gap-1.5">
                <!-- Status Email -->
                <span :class="['relative group inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium', user.email_verified ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700']">
                  <Icon :name="user.email_verified ? 'lucide:mail-check' : 'lucide:mail-question'" class="h-3.5 w-3.5" />
                  {{ user.email_verified ? 'Terverifikasi' : 'Belum' }}
                  <div class="absolute bottom-full left-1/2 mb-2 w-max -translate-x-1/2 rounded-md bg-gray-800 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100 invisible group-hover:visible pointer-events-none">
                    Status verifikasi email
                  </div>
                </span>

                <!-- Role Pengguna -->
                <span class="relative group inline-flex items-center gap-1.5 rounded-full bg-gray-700 px-2.5 py-1 text-[11px] font-semibold text-white">
                  <Icon name="lucide:shield" class="h-3.5 w-3.5" />
                  {{ user.role }}
                  <div class="absolute bottom-full left-1/2 mb-2 w-max -translate-x-1/2 rounded-md bg-gray-800 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100 invisible group-hover:visible pointer-events-none">
                    Role pengguna
                  </div>
                </span>

                <!-- Status Akun -->
                <span :class="['relative group inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium', user.disabled ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700']">
                  <Icon :name="user.disabled ? 'lucide:user-x' : 'lucide:user-check'" class="h-3.5 w-3.5" />
                  {{ user.disabled ? 'Nonaktif' : 'Aktif' }}
                  <div class="absolute bottom-full left-1/2 mb-2 w-max -translate-x-1/2 rounded-md bg-gray-800 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100 invisible group-hover:visible pointer-events-none">
                    Status akun
                  </div>
                </span>
              </div>
            </td>

              <!-- Aktivitas -->
            <td class="whitespace-nowrap px-4 py-3.5 text-sm text-slate-700">
              <p>Login: <span class="font-medium">{{ formatDate(user.lastLogin) || '-' }}</span></p>
              <p class="text-xs text-slate-500">Dibuat: {{ formatDate(user.createdAt) }}</p>
            </td>

            <!-- 3-dot Menu -->
            <td class="whitespace-nowrap px-4 py-3.5 text-right text-sm relative">
              <div class="inline-flex">
                <button type="button" class="rounded-full p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700" @click.stop="toggleMenu(user.uid)">
                  <Icon name="lucide:more-vertical" class="h-5 w-5" />
                </button>
              </div>
              <transition
                enter-active-class="transition ease-out duration-100"
                enter-from-class="opacity-0 translate-y-1"
                enter-to-class="opacity-100 translate-y-0"
                leave-active-class="transition ease-in duration-75"
                leave-from-class="opacity-100 translate-y-0"
                leave-to-class="opacity-0 translate-y-1"
              >
                <div v-if="openMenuUid === user.uid" class="absolute right-4 top-full mt-1 z-30 w-44 rounded-xl border border-slate-100 bg-white py-1 text-xs shadow-lg ring-1 ring-slate-900/5">
                  <button type="button" class="flex w-full items-center justify-between px-3 py-2 hover:bg-slate-50" @click="emit('viewDetail', user)">
                    <span>Detail Peserta</span>
                  </button>
                  <button type="button" class="flex w-full items-center justify-between px-3 py-2 hover:bg-slate-50" @click="emit('resetPassword', user)">
                    <span>Reset Password</span>
                  </button>
                  <button type="button" class="flex w-full items-center justify-between px-3 py-2 hover:bg-slate-50" @click="emit('toggleDisable', user)">
                    <span>{{ user.disabled ? 'Aktifkan Akun' : 'Nonaktifkan Akun' }}</span>
                  </button>
                </div>
              </transition>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <UsersPagination
      :current-page="currentPage"
      :total-pages="totalPages"
      @update:currentPage="p => emit('update:currentPage', p)"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import type { User } from '@/composables/useUsers'
import UsersPagination from './UsersPagination.vue'

const config = useRuntimeConfig()
const apiUrl = config.public.API_URL
defineProps<{
  users: User[]
  totalFiltered: number
  isLoading: boolean
  currentPage: number
  totalPages: number
}>()

const emit = defineEmits(['viewDetail', 'resetPassword', 'toggleDisable', 'update:currentPage'])

// 3-dot menu state
const openMenuUid = ref<string | null>(null)

const toggleMenu = (uid: string) => {
  openMenuUid.value = openMenuUid.value === uid ? null : uid
}

const closeMenu = () => {
  openMenuUid.value = null
}

onMounted(() => {
  window.addEventListener('click', closeMenu)
})

onUnmounted(() => {
  window.removeEventListener('click', closeMenu)
})

// Helpers
const initials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('')

const formatDate = (iso?: string) => {
  if (!iso) return ''
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}
</script>