<template>
  <div class="flex h-screen overflow-hidden bg-gray-100">
    <div
      v-if="isSidebarOpen"
      class="fixed inset-0 z-40 bg-gray-900 bg-opacity-50 lg:hidden"
      @click="toggleSidebar"
    ></div>

    <AdminSidebar :is-open="isSidebarOpen" :user="user" @close-sidebar="toggleSidebar" />

    <main class="flex-1 p-4 sm:p-6 lg:p-8 py-5 h-screen content-main overflow-y-auto">
      <AdminHeader :user="user" @toggle-sidebar="toggleSidebar" />

      <div class="mt-8">
        <NuxtPage/>
      </div>
    </main>
    <LoadingPopup/>
    <NotificationPopup />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import NotificationPopup from '@/components/NotificationPopup.vue';
import { useNuxtApp } from '#app';

const isSidebarOpen = ref(false);
const user = ref<any>(null); // To store Firebase user object
const { $auth } = useNuxtApp();

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

onMounted(() => {
  $auth.onAuthStateChanged(firebaseUser => {
    user.value = firebaseUser;
  });
});
</script>

<style>
.content-main::-webkit-scrollbar {
  width: 6px; /* Mengatur lebar scrollbar menjadi tipis */
  height: 6PX;
}

.content-main::-webkit-scrollbar-thumb {
  background-color: #15803d; /* Warna hijau */
  border-radius: 10px; /* Membuat thumb memiliki sudut yang membulat */
}

.content-main::-webkit-scrollbar-track {
  background: transparent; /* Membuat track menjadi transparan */
}
</style>