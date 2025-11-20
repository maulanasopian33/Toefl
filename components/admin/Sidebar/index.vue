<template>
  <div
    class="fixed sidebar overflow-y-scroll inset-y-0 left-0 z-50 w-72 transform bg-gray-900 text-gray-200 shadow-lg transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 lg:border-r lg:border-gray-800"
    :class="{ '-translate-x-full': !isOpen }"
  >
    <div class="p-6 flex flex-col h-full">
      <!-- App Logo & Name/Tagline -->
      <div v-if="settings" class="mb-8 flex items-center justify-between">
        <div
          class="flex items-center flex-grow"
        >
          <div
            class="mr-3 flex h-10 w-10 items-center justify-center rounded-lg text-white flex-shrink-0 overflow-hidden"
            :style="{ backgroundColor: settings.primaryColor || '#f97316' }"
          >
            <img v-if="settings.logoUrl" :src="`${config.public.API_URL}${settings.logoUrl}`" alt="Logo" class="h-full w-full object-contain p-1.5" />
            <span v-else class="text-lg font-bold tracking-tighter">
              {{ appInitials }}
            </span>
          </div>
          <div class="min-w-0">
            <p class="text-lg font-bold text-gray-50 truncate">{{ settings.appName }}</p>
            <p class="text-xs text-gray-400 truncate">
              {{ settings.tagline }}
            </p>
          </div>
        </div>
        <!-- Close button for mobile -->
        <button class="ml-auto block lg:hidden" @click="$emit('closeSidebar')">
          <Icon name="lucide:x" class="h-6 w-6 text-gray-400 hover:text-white" />
        </button>
      </div>

      <!-- Main Navigation -->
      <nav class="flex-grow space-y-1">
        <h3 class="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-500">Menu Utama</h3>
        
        <div v-for="item in computedNavItems" :key="item.name">
          <nuxt-link
            :to="item.link"
            class="flex items-center rounded-lg px-4 py-2.5 text-sm font-medium transition-colors duration-200"
            :class="[
              pathRoute === item.link
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-gray-300 hover:bg-gray-800 hover:text-white',
              { 'cursor-pointer': item.children },
              // Apply primary color if settings are loaded and it's the active link
              pathRoute === item.link && settings?.primaryColor
                ? `bg-[${settings.primaryColor}] hover:bg-[${settings.primaryColor}]/90`
                : '',
            ]"
          >
            <div class="w-5 h-5 mr-3 flex items-center justify-center" v-html="item.icon"></div>
            {{ item.name }}
            <!-- Wrapper for chevron icon to handle click separately -->
            <div v-if="item.children" class="ml-auto" @click.prevent="toggleSubmenu(item.name)">
              <svg
                class="w-4 h-4 transform transition-transform duration-200"
                :class="{ 'rotate-180': openSubmenus[item.name] }"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
              </svg>
            </div>
          </nuxt-link>
          
          <!-- Submenu items -->
          <div v-if="item.children && openSubmenus[item.name]" class="mt-2 space-y-1 pl-8">
            <nuxt-link
              v-for="subItem in item.children"
              :key="subItem.name"
              :to="subItem.link"
              class="flex items-center rounded-lg px-4 py-2 text-sm transition-colors duration-200"
              :class="[
                pathRoute === subItem.link
                  ? 'bg-indigo-700 text-white'
                  : 'text-gray-400 hover:bg-gray-700 hover:text-white',
                { 'cursor-pointer': item.children }
              ]"
            >
              {{ subItem.name }}
            </nuxt-link>
          </div>
        </div>
      </nav>
      
      <!-- Promo/Recommendation Section -->
      <div class="mt-auto pt-8"> <!-- Use mt-auto to push it to the bottom -->
        <div class="mb-4 flex items-center justify-between text-gray-400">
          <h3 class="text-xs font-semibold uppercase tracking-wider">Rekomendasi & Promo</h3>
          <NuxtLink to="/admin/promos" class="text-xs hover:text-white transition-colors">
            Lihat Semua <Icon name="lucide:arrow-right" class="h-3 w-3 inline-block ml-1" />
          </NuxtLink>
        </div>
        <div class="space-y-3">
          <PromoCard :discount="65" />
          <PromoCard :discount="55" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { computed, watch } from 'vue'; // Ensure computed and watch are imported
import PromoCard from '@/components/Cards/PromoCard.vue';
import navItems from '@/data/navItems'; // Import data
import { useAppSettings } from '@/composables/useAppSettings';

defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  user: { // Add user prop
    type: Object,
    default: null,
  },
});
defineEmits(['closeSidebar']);
const openSubmenus = ref({});

const route = useRoute();
const pathRoute = computed(() => route.path);
const { settings } = useAppSettings()
const config = useRuntimeConfig()

const computedNavItems = computed(() => {
  const appSettings = settings.value;

  return navItems.map(item => {
    if (item.name === 'Settings' && item.children) {
      const updatedChildren = item.children.map(child => {
        if (child.name === 'Pengaturan Aplikasi' && appSettings) {
          return { ...child, name: `Pengaturan ${appSettings.appName || 'Aplikasi'}` };
        }
        return child;
      });
      return { ...item, children: updatedChildren };
    }
    return item;
  });
});

const appInitials = computed(() => {
  if (!settings.value) return '';
  const source = settings.value.appShortName || settings.value.appName || '';
  return source
    .split(' ')
    .map((w: string) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
});

watch(
  () => route.path,
  (newPath, oldPath) => {
    pathRoute.value = newPath;
  }
);

function toggleSubmenu(itemName: string) { // Add type for itemName
  openSubmenus.value[itemName] = !openSubmenus.value[itemName];
}
</script>

<style>
.sidebar::-webkit-scrollbar {
  width: 6px; /* Mengatur lebar scrollbar menjadi tipis */
}

.sidebar::-webkit-scrollbar-thumb {
  background-color: #15803d; /* Warna hijau */
  border-radius: 10px; /* Membuat thumb memiliki sudut yang membulat */
}

.sidebar::-webkit-scrollbar-track {
  background: transparent; /* Membuat track menjadi transparan */
}
</style>