<template>
  <header
    class="sticky top-0 z-40 w-full border-b backdrop-blur-sm transition-colors duration-300"
    :class="isDarkMode
      ? 'border-gray-800 bg-gray-900/95'
      : 'border-gray-200 bg-white/95'"
  >
    <div class="container mx-auto flex h-16 items-center justify-between px-4 relative">
      <!-- Left: Branding -->
      <NuxtLink to="/" class="flex items-center gap-2.5">
        <div v-if="settings?.logoUrl" class="flex h-8 w-8 items-center justify-center">
          <img :src="settings.logoUrl" alt="App Logo" class="h-full w-full object-contain" />
        </div>
        <div v-else class="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-900 text-white">
          <span class="text-sm font-bold tracking-tighter" :class="isDarkMode && 'text-gray-200'">{{ appInitials }}</span>
        </div>
        <span class="hidden text-lg font-semibold sm:inline" :class="isDarkMode ? 'text-gray-200' : 'text-gray-800'">{{ settings?.appName || 'ToeflArabi' }}</span>
      </NuxtLink>

      <!-- Right: User Menu / Auth Buttons -->
      <div class="flex items-center gap-4">
        <div v-if="isAuthenticated && user" class="relative z-50">
          <!-- Dropdown Trigger -->
          <button
            @click="toggleMenu"
            class="group inline-flex w-full items-center justify-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition-colors focus:outline-none"
            :class="isDarkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'"
            :aria-expanded="isMenuOpen"
            aria-haspopup="true"
          >
                <img :src="getPhoto(userdb) || '/img/avatar.png'" alt="User Avatar" class="h-8 w-8 rounded-full object-cover" />
                <span class="hidden sm:inline" :class="isDarkMode ? 'text-gray-300' : 'text-gray-800'">{{ getNamaLengkap(userdb) }}</span>
                <Icon name="lucide:chevron-down" class="-mr-1 h-4 w-4 text-gray-400 transition-transform group-hover:text-gray-600" />
          </button>

          <!-- Dropdown Panel -->
          <Transition
            enter-active-class="transition ease-out duration-100"
            enter-from-class="transform opacity-0 scale-95"
            enter-to-class="transform opacity-100 scale-100"
            leave-active-class="transition ease-in duration-75"
            leave-from-class="transform opacity-100 scale-100"
            leave-to-class="transform opacity-0 scale-95"
          >
            <div v-if="isMenuOpen" ref="menuRef" class="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div class="px-1 py-1">
                <div class="px-3 py-2">
                  <p class="text-sm font-medium text-gray-900 truncate">{{ getNamaLengkap(userdb) }}</p>
                  <p class="text-xs text-gray-500 truncate">{{ user.email }}</p>
                </div>
              </div>
              <div class="px-1 py-1">
                <NuxtLink to="/" @click="closeMenu" class="group flex w-full items-center rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900">
                      <Icon name="lucide:layout-dashboard" class="mr-2 h-4 w-4 text-gray-500" />
                      Dashboard
                    </NuxtLink>
                <NuxtLink to="/profile" @click="closeMenu" class="group flex w-full items-center rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900">
                      <Icon name="lucide:user-circle" class="mr-2 h-4 w-4 text-gray-500" />
                      Profil Saya
                    </NuxtLink>
              </div>
              <div class="px-1 py-1">
                <button @click="logoutAndCloseMenu" class="group flex w-full items-center rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-800">
                      <Icon name="lucide:log-out" class="mr-2 h-4 w-4 text-gray-500 group-hover:text-red-600" />
                      Keluar
                    </button>
              </div>
            </div>
          </Transition>
        </div>

        <div v-else class="flex items-center gap-2">
          <NuxtLink to="/auth/login" class="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100">
            Masuk
          </NuxtLink>
          <NuxtLink to="/auth/register" class="rounded-lg bg-gray-800 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-700">
            Daftar
          </NuxtLink>
        </div>
      </div>
    </div>
  </header>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useAuth } from '@/composables/useAuth';
import { useAuthActions } from '@/composables/Auth';
import { useAppSettings } from '@/composables/useAppSettings';
import { useUserMe } from '@/composables/UserMe';
import { Icon } from '#components'; // Pastikan Icon diimpor jika belum

const { isAuthenticated, user } = useAuth();
const { logout } = useAuthActions();
const { data: userdb } = await useUserMe();
const config = useRuntimeConfig();
const { settings } = useAppSettings();

const isDarkMode = computed(() => {
  return settings.value?.theme === 'dark';
});

const appInitials = computed(() => {
  if (!settings.value) return 'TA';
  const source = settings.value.appShortName || settings.value.appName || 'Toefl Arabi';
  return source
    .split(' ')
    .map((w: string) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
});

// --- Helper Functions ---
const getPhoto = (userData: any) => {
  if (!userData || !userData.picture) return null;
  // Asumsi path adalah relatif, misal: /images/avatar/....png
  // dan perlu digabungkan dengan base URL API.
  return `${config.public.API_URL.replace('/api/v1', '')}${userData.picture}`;
};

const getNamaLengkap = (userData: any) => {
  if (!userData) return '...';
  return userData.name || 'Pengguna';
};
// --- End of Helper Functions ---

const isMenuOpen = ref(false);
const menuRef = ref<HTMLElement | null>(null); // Ref untuk elemen dropdown

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const closeMenu = () => {
  isMenuOpen.value = false;
};

const logoutAndCloseMenu = async () => {
  await logout();
  closeMenu();
};

// Click outside listener
const handleClickOutside = (event: MouseEvent) => {
  if (menuRef.value && !menuRef.value.contains(event.target as Node) && !event.target.closest('button[aria-haspopup="true"]')) {
    closeMenu();
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style>
/* Gaya tambahan bisa ditambahkan di sini jika diperlukan, 
   namun sebagian besar sudah ditangani oleh kelas Tailwind. */
</style>