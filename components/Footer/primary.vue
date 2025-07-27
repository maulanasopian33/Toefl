<template>
  <!-- Footer Aplikasi -->
    <footer class="bg-gray-800 text-white p-4 mt-8">
        <div class="container mx-auto text-center text-sm">
            &copy; {{ new Date().getFullYear() }} {{ AppConfig.appName }} V{{ AppConfig.appVersion }}. Semua Hak Dilindungi.
        </div>
    </footer>
</template>

<script lang="ts" setup>
import { AppConfig } from '@/data/AppConfig';
</script>

<style>

</style>