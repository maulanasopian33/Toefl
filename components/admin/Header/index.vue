<template>
  <div class="flex items-center justify-between gap-4">
    <!-- Left Section: Greeting and Search -->
    <div class="flex items-center gap-4 flex-1">
      <!-- Hamburger Menu for Mobile -->
      <button class="lg:hidden text-gray-500 hover:text-gray-800" @click="$emit('toggleSidebar')">
        <Icon name="lucide:menu" class="h-6 w-6" />
      </button>

      <!-- Greeting -->
      <div class="hidden md:block">
        <h1 class="text-xl font-bold text-gray-800">
          Selamat Datang, {{ user?.displayName || user?.email?.split('@')[0] || 'Admin' }} 👋
        </h1>
        <p class="text-sm text-gray-500">Berikut adalah ringkasan aktivitas terbaru di platform Anda.</p>
      </div>

      <!-- Search Bar (Optional Feature) -->
      <div class="relative hidden lg:block ml-auto max-w-xs w-full">
        <Icon name="lucide:search" class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Cari peserta, ujian, atau pengaturan..."
          class="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-full bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/50 focus:border-primary/30 transition-all"
        />
      </div>
    </div>
    
    <!-- Right Section: Actions and Profile -->
    <div class="flex items-center gap-3 md:gap-4">
      <!-- Notifications Dropdown (Dummy) -->
      <div class="relative">
        <button @click="toggleDropdown('notifications')" class="relative p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors">
          <Icon name="lucide:bell" class="h-5 w-5" />
          <span class="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        <div v-if="dropdowns.notifications" class="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
          <div class="p-3 font-semibold text-sm border-b">Notifikasi</div>
          <div class="p-3 text-center text-xs text-gray-500">Belum ada notifikasi baru.</div>
        </div>
      </div>

      <!-- Profile Dropdown -->
      <div class="relative">
        <button @click="toggleDropdown('profile')" class="flex items-center gap-2">
          <div class="w-9 h-9 bg-gray-200 rounded-full overflow-hidden">
            <img v-if="user?.picture" :src="`${user?.picture}`" @error="onImageError" alt="Avatar" class="w-full h-full object-cover" />
            <span v-else class="w-full h-full flex items-center justify-center text-sm font-semibold text-gray-600 bg-gray-200">
              {{ userInitials }}
            </span>
          </div>
          <div class="hidden md:block text-left">
            <p class="text-sm font-semibold text-gray-800 truncate max-w-[100px]">{{ user?.displayName || 'Admin' }}</p>
            <p class="text-xs text-gray-500">Administrator</p>
          </div>
          <Icon name="lucide:chevron-down" class="h-4 w-4 text-gray-400 hidden md:block" />
        </button>

        <!-- Dropdown Menu -->
        <Transition name="fade">
          <div v-if="dropdowns.profile" class="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10 py-1">
            <NuxtLink to="/admin/profile" class="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              <Icon name="lucide:user-circle" class="h-4 w-4" />
              Profil Saya
            </NuxtLink>
            <NuxtLink to="/admin/settings/general" class="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              <Icon name="lucide:settings" class="h-4 w-4" />
              Pengaturan
            </NuxtLink>
            <hr class="my-1" />
            <button @click="logout" class="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50">
              <Icon name="lucide:log-out" class="h-4 w-4" />
              Logout
            </button>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineEmits(['toggleSidebar']);
import { signOut } from 'firebase/auth';
import { ref, onMounted, computed, reactive } from 'vue';

const router = useRouter();
const { startLoading, stopLoading } = useLoading();
// Dapatkan instance auth dari plugin
const { $auth } = useNuxtApp();
const config = useRuntimeConfig()
const API_URL = config.public.API_URL 
const imageURL = ref<string | null>(null);
// Gunakan ref() untuk user object agar reaktif
const user = ref<any>(null);

// State for dropdowns
const dropdowns = reactive({
  profile: false,
  notifications: false,
});

const toggleDropdown = (type: 'profile' | 'notifications') => {
  if (type === 'profile') {
    dropdowns.profile = !dropdowns.profile;
    dropdowns.notifications = false;
  } else {
    dropdowns.notifications = !dropdowns.notifications;
    dropdowns.profile = false;
  }
};

const userInitials = computed(() => {
  if (!user.value) return 'A';
  const name = user.value.displayName || user.value.email || 'Admin';
  return name.charAt(0).toUpperCase();
});

// Memantau perubahan status autentikasi
onMounted(() => {
  $auth.onAuthStateChanged(firebaseUser => {
    user.value = firebaseUser;
    if (firebaseUser) {
      imageURL.value = `${API_URL}/images/avatar/${firebaseUser.uid}.png`;
    } else {
      imageURL.value = null;
    }
  });
});

const onImageError = () => {
  imageURL.value = null; // Set to null to show initials as fallback
};

const logout = async () => {
  try {
    startLoading();
    await signOut($auth);
    router.push('/auth/login'); // Redirect ke halaman login setelah logout
  } catch (error) {
    stopLoading();
  } finally {
    stopLoading();
  }
};

const login = () => {
  router.push('/auth/login'); // Redirect ke halaman login
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>