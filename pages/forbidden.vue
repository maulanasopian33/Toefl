<template>
  <div class="flex min-h-screen items-center justify-center bg-slate-100 px-4">
    <div class="w-full max-w-md text-center">
      <Icon name="lucide:shield-ban" class="mx-auto h-24 w-24 text-red-400" />

      <h1 class="mt-6 text-4xl font-bold tracking-tight text-slate-800 sm:text-5xl">
        Akses Ditolak
      </h1>

      <p class="mt-4 text-base text-slate-600">
        Maaf, Anda tidak memiliki izin untuk mengakses halaman yang Anda tuju.
        Silakan kembali ke dashboard Anda.
      </p>

      <NuxtLink
        :to="homeLink"
        class="mt-8 inline-flex items-center justify-center rounded-lg bg-green-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-green-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
      >
        Kembali ke Dashboard
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

definePageMeta({
  layout: false, // Menggunakan layout kosong tanpa header/footer
});

const { claims } = useAuth();

const homeLink = computed(() => {
  return claims.value.role === 'admin' ? '/admin' : '/';
});
</script>