<template>
  <div class="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden ring-1 ring-gray-900/5">
    <div class="flex items-center justify-between border-b border-gray-100 px-6 py-4 bg-gray-50/50">
      <p class="text-xs font-semibold uppercase tracking-wider text-gray-500">
        Menampilkan
        <span class="font-bold text-gray-700">{{ users.length }}</span>
        dari
        <span class="font-bold text-gray-700">{{ totalFiltered }}</span>
        peserta
      </p>
      <div class="flex items-center gap-2 text-xs text-gray-400">
         <Icon name="lucide:info" class="w-3.5 h-3.5" />
         Klik baris untuk aksi cepat
      </div>
    </div>

    <div class="overflow-x-auto relative">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-gray-50/50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-semibold grid-cols-5">
            <th scope="col" class="px-6 py-4">User</th>
            <th scope="col" class="px-6 py-4">Data Akademik</th>
            <th scope="col" class="px-6 py-4">Status</th>
            <th scope="col" class="px-6 py-4">Aktivitas</th>
            <th scope="col" class="px-6 py-4 text-right">Aksi</th>
          </tr>
        </thead>

        <tbody class="divide-y divide-gray-100 bg-white">
          <!-- Skeleton Loader -->
          <template v-if="isLoading">
            <tr v-for="i in 5" :key="`skel-${i}`" class="animate-pulse">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="h-10 w-10 rounded-full bg-slate-100"></div>
                  <div class="space-y-1.5 flex-1">
                    <div class="h-4 w-32 rounded bg-slate-100"></div>
                    <div class="h-3 w-40 rounded bg-slate-100"></div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="space-y-1.5">
                  <div class="h-4 w-20 rounded bg-slate-100"></div>
                  <div class="h-3 w-36 rounded bg-slate-100"></div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="flex gap-2">
                   <div class="h-6 w-20 rounded-full bg-slate-100"></div>
                   <div class="h-6 w-16 rounded-full bg-slate-100"></div>
                </div>
              </td>
              <td class="px-6 py-4">
                 <div class="h-4 w-24 rounded bg-slate-100"></div>
              </td>
              <td class="px-6 py-4"></td>
            </tr>
          </template>

          <!-- Empty State -->
          <tr v-else-if="users.length === 0">
            <td colspan="5" class="px-6 py-16 text-center">
              <div class="flex flex-col items-center gap-3">
                <div class="p-4 bg-slate-50 rounded-full text-slate-400">
                    <Icon name="lucide:search-x" class="h-8 w-8" />
                </div>
                <div>
                   <h4 class="text-base font-bold text-gray-800">Tidak Ada Hasil Ditemukan</h4>
                   <p class="text-sm text-gray-500 mt-1">Coba ubah atau atur ulang filter pencarian Anda.</p>
                </div>
              </div>
            </td>
          </tr>
          
          <tr v-for="user in users" :key="user.uid" class="group hover:bg-slate-50 transition-colors">
            <!-- User -->
            <td class="px-6 py-4 text-sm text-slate-700">
              <div class="flex items-center gap-4">
                <template v-if="user.picture">
                  <img :src="user.picture" alt="avatar" class="h-10 w-10 rounded-full object-cover shadow-sm ring-1 ring-slate-100" />
                </template>
                <template v-else>
                  <div class="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50 text-sm font-bold text-indigo-600 shadow-sm ring-1 ring-indigo-100">
                    {{ initials(user.name) }}
                  </div>
                </template>
                <div class="flex flex-col gap-0.5">
                  <p class="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{{ user.name }}</p>
                  <div class="flex items-center text-xs text-gray-500 gap-1.5">
                     <Icon name="lucide:mail" class="w-3 h-3 text-gray-400" />
                     {{ user.email }}
                  </div>
                  <p class="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded w-fit mt-0.5 font-mono">UID: {{ user.uid.substring(0,8) }}...</p>
                </div>
              </div>
            </td>

            <!-- Akademik -->
            <td class="px-6 py-4 align-middle whitespace-nowrap text-sm text-slate-700">
              <div class="flex flex-col gap-1">
                <div class="font-bold text-gray-900 flex items-center gap-2">
                   <Icon name="lucide:contact-2" class="w-4 h-4 text-indigo-400" />
                   {{ user.detailuser.nim || '-' }}
                </div>
                <p class="text-xs text-slate-500 pl-6">{{ user.detailuser.fakultas || '-' }} &middot; {{ user.detailuser.prodi || '-' }}</p>
              </div>
            </td>

            <!-- Status -->
            <td class="px-6 py-4 align-middle whitespace-nowrap text-sm">
              <div class="flex flex-wrap items-center gap-2">
                <!-- Status Email -->
                <span 
                   class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border"
                   :class="user.email_verified ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-orange-50 text-orange-700 border-orange-100'"
                >
                  <Icon :name="user.email_verified ? 'lucide:badge-check' : 'lucide:badge-alert'" class="h-3.5 w-3.5" />
                  {{ user.email_verified ? 'Verified' : 'Unverified' }}
                </span>

                <!-- Role -->
                <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 text-white text-xs font-semibold shadow-sm">
                  <Icon name="lucide:shield" class="h-3 w-3 text-slate-400" />
                  {{ user.role }}
                </span>

                <!-- Status Akun -->
                 <span v-if="user.disabled" class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-50 text-red-700 border border-red-100 text-xs font-semibold">
                    <Icon name="lucide:ban" class="h-3.5 w-3.5" />
                    Banned
                 </span>
              </div>
            </td>

            <!-- Aktivitas -->
            <td class="px-6 py-4 align-middle whitespace-nowrap text-sm text-slate-700">
              <div class="flex flex-col gap-1 text-xs">
                 <div class="flex items-center gap-2 text-gray-600">
                    <Icon name="lucide:log-in" class="w-3.5 h-3.5 text-blue-400" />
                    <span>Last Login:</span>
                    <span class="font-semibold text-gray-900">{{ formatDate(user.lastLogin) || '-' }}</span>
                 </div>
                 <div class="flex items-center gap-2 text-gray-400">
                    <Icon name="lucide:clock" class="w-3.5 h-3.5" />
                    <span>Created:</span>
                    <span>{{ formatDate(user.createdAt) }}</span>
                 </div>
              </div>
            </td>

            <!-- 3-dot Menu -->
            <td class="px-6 py-4 align-middle whitespace-nowrap text-right relative">
              <div class="inline-flex">
                <button 
                  type="button" 
                  class="rounded-lg p-2 text-slate-400 hover:bg-white hover:text-blue-600 hover:shadow-md transition-all ring-1 ring-transparent hover:ring-slate-100" 
                  @click.stop="toggleMenu(user.uid)"
                >
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
                <div v-if="openMenuUid === user.uid" class="absolute right-10 top-8 z-30 w-48 rounded-xl border border-slate-100 bg-white p-1 text-xs shadow-xl ring-1 ring-slate-900/5">
                  <div class="px-3 py-2 border-b border-slate-50 mb-1">
                     <p class="font-semibold text-gray-900 truncate">{{ user.name }}</p>
                     <p class="text-[10px] text-gray-400">Actions Menu</p>
                  </div>
                  <button type="button" class="flex w-full items-center gap-2 px-3 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-700 text-gray-600 transition-colors" @click="emit('viewDetail', user)">
                    <Icon name="lucide:user-circle" class="w-4 h-4" />
                    <span>Detail Peserta</span>
                  </button>
                  <button type="button" class="flex w-full items-center gap-2 px-3 py-2 rounded-lg hover:bg-amber-50 hover:text-amber-700 text-gray-600 transition-colors" @click="emit('resetPassword', user)">
                    <Icon name="lucide:key-round" class="w-4 h-4" />
                    <span>Reset Password</span>
                  </button>
                  <button type="button" class="flex w-full items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-50 text-gray-600 transition-colors" @click="emit('toggleDisable', user)">
                    <Icon :name="user.disabled ? 'lucide:check-circle' : 'lucide:ban'" class="w-4 h-4" />
                    <span>{{ user.disabled ? 'Aktifkan Akun' : 'Nonaktifkan Akun' }}</span>
                  </button>
                  <button type="button" class="flex w-full items-center gap-2 px-3 py-2 rounded-lg hover:bg-indigo-50 hover:text-indigo-700 text-gray-600 transition-colors" @click="emit('changeRole', user)">
                    <Icon name="lucide:shield-check" class="w-4 h-4" />
                    <span>Ubah Role</span>
                  </button>
                  <div class="my-1 h-px bg-slate-100"></div>
                  <button type="button" class="flex w-full items-center gap-2 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors" @click="emit('deleteUser', user)">
                     <Icon name="lucide:trash-2" class="w-4 h-4" />
                    <span>Hapus User</span>
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

const emit = defineEmits(['viewDetail', 'resetPassword', 'toggleDisable', 'update:currentPage', 'deleteUser', 'changeRole'])

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
const initials = (name?: string | null) => {
  if (!name) return ''
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('')
}

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