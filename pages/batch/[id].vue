<template>
  <div class="min-h-screen flex flex-col">
    <div class="container mx-auto p-6 flex flex-col lg:flex-row gap-6 flex-grow">
      <main class="flex-grow lg:w-3/4">
        <div v-if="pending" class="card text-center p-10">
          <p class="text-xl text-gray-600">Memuat detail batch...</p>
        </div>
        
        <div v-else-if="!data" class="card text-center p-10">
          <p class="text-red-500 text-xl mt-10">Batch tidak ditemukan.</p>
        </div>
        
        <div v-else>
          <BatchHeader :batch="data" />
          <BatchParticipation :batch="data" @update-batch="updateBatch" />
          <BatchSchedule />
          <BatchInstructions :instruksi="data.intruksiKhusus" />
          <BatchParticipants :participants="data.participants" />
        </div>
      </main>

      <aside class="lg:w-1/4">
        <div class="card">
          <h3 class="text-xl font-bold text-gray-800 mb-4">Menu Cepat</h3>
          <ul class="space-y-3">
            <li>
              <NuxtLink to="/batches" class="flex items-center text-gray-700 hover:text-green-600 transition duration-150 ease-in-out">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                Kembali ke Daftar Batch
              </NuxtLink>
            </li>
            <li>
              <a href="#" class="flex items-center text-gray-700 hover:text-green-600 transition duration-150 ease-in-out">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.523 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.523 18.246 18 16.5 18c-1.747 0-3.332.477-4.5 1.253"></path></svg>
                Materi Belajar
              </a>
            </li>
            <li>
              <a href="#" class="flex items-center text-gray-700 hover:text-green-600 transition duration-150 ease-in-out">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v14m-7 0h14a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                Latihan Soal
              </a>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { useBatchGetById } from '@/composables/Batch/getbyid';
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const batchId = route.params.id;
const {data, pending, error} = await useBatchGetById(batchId)

console.log(batchId)
console.log(data)
console.log(error)

const updateBatch = (updatedBatch) => {
  batch.value = { ...updatedBatch };
};
</script>

<style>
/* Base styles from original HTML */
body {
    font-family: 'Inter', sans-serif;
    background-color: #f3f4f6;
    line-height: 1.6;
}
.card {
    background-color: #ffffff;
    border-radius: 0.75rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    padding: 1.5rem;
}
</style>