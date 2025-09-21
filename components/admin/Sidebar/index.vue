<template>
  <div
    class="fixed sidebar overflow-y-scroll inset-y-0 left-0 z-50 w-72 transform bg-white shadow-lg transition-transform duration-300 ease-in-out lg:static lg:translate-x-0"
    :class="{ '-translate-x-full': !isOpen }"
  >
    <div class="p-6 px-3">
      <div class="mb-8 flex items-center">
        <div class="mr-3 flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500 font-bold text-white">
          L
        </div>
        <span class="text-xl font-bold text-gray-800">lessa</span>
        <button class="ml-auto block lg:hidden" @click="$emit('closeSidebar')">
          <svg class="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <nav class="space-y-2">
        <h3 class="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-400">Menu</h3>
        
        <div v-for="item in navItems" :key="item.name">
          <nuxt-link
            :to="item.link"
            class="flex items-center rounded-lg px-4 py-3"
            :class="[
              pathRoute === item.link ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-50',
              { 'cursor-pointer': item.children }
            ]"
            @click.prevent="toggleSubmenu(item.name)"
          >
            <div class="w-5 h-5 mr-3" v-html="item.icon"></div>
            {{ item.name }}
            <svg
              v-if="item.children"
              class="w-4 h-4 ml-auto transform transition-transform duration-200"
              :class="{ 'rotate-180': openSubmenus[item.name] }"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
            </svg>
          </nuxt-link>
          
          <div v-show="openSubmenus[item.name]" class="mt-2 space-y-1 pl-8">
            <nuxt-link
              v-for="subItem in item.children"
              :key="subItem.name"
              :to="subItem.link"
              :class="[
                pathRoute === subItem.link ? 'bg-primary text-white hover:bg-primary/60' : 'text-gray-600 hover:bg-gray-50',
                { 'cursor-pointer': item.children }
              ]"
              class="flex items-center rounded-lg px-4 py-3 text-sm text-gray-600"
            >
              {{ subItem.name }}
            </nuxt-link>
          </div>
        </div>
      </nav>

      <div class="mt-8">
        <div class="mb-4 flex items-center justify-between">
          <h3 class="text-sm font-semibold text-gray-800">Your Promo</h3>
          <svg class="h-4 w-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" />
          </svg>
        </div>
        <div class="space-y-3">
          <PromoCard :discount="65" />
          <PromoCard :discount="55" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import PromoCard from '@/components/Cards/PromoCard.vue';
import navItems from '@/data/navItems'; // Import data

defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
});
defineEmits(['closeSidebar']);
const openSubmenus = ref({});

const route = useRoute();
const pathRoute = computed(() => route.path);
watch(
  () => route.path,
  (newPath, oldPath) => {
    pathRoute.value = newPath;
  }
);

function toggleSubmenu(itemName) {
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