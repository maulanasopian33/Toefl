<template>
  <header class="bg-green-700 text-white p-4 shadow-md">
      <div class="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <h1 class="text-3xl font-bold mb-2 md:mb-0">{{ AppConfig.appName }}</h1>
          <div class="flex items-center space-x-4">
              <span id="userName" class="text-lg">Selamat datang, Pengguna!</span>
              <button class="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition duration-300 ease-in-out">
                  Keluar
              </button>
          </div>
      </div>
  </header>
</template>

<script lang="ts" setup>
import { AppConfig } from '@/data/AppConfig';

</script>

<style>

</style>