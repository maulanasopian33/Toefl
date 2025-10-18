<template>
  <div>
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
      <div class="flex items-center mb-4 sm:mb-0">
        <div class="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center text-white mr-3">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
          </svg>
        </div>
        <h2 class="text-xl font-semibold text-gray-800">Dashboard</h2>
      </div>

      <div class="flex space-x-3 w-full sm:w-auto">
        <button class="flex-1 sm:flex-none flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 text-sm md:text-base">
          <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" />
          </svg>
          <span class="hidden sm:inline">This year</span>
          <svg class="w-4 h-4 ml-2" fill="currentColor" viewBox="0 0 20 20">
            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
          </svg>
        </button>
        <button class="flex-1 sm:flex-none flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 text-sm md:text-base">
          <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
          </svg>
          <span class="hidden sm:inline">Download report</span>
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard v-for="(stat, index) in stats" :key="index" :stat="stat" />
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="col-span-1 lg:col-span-2 bg-white p-6 rounded-xl shadow-sm">
        <!-- <RevenueChart :revenue-data="revenueData" /> -->
      </div>
      <div class="col-span-1 space-y-6">
        <NeedMoreInfoCard />
        <BestSellerCard :best-sellers="bestSellers" />
      </div>
    </div>
  </div>
</template>

<script setup>
import BestSellerCard from '@/components/Cards/BestSellerCard.vue';
import NeedMoreInfoCard from '@/components/Cards/NeedMoreInfoCard.vue';
import StatCard from '@/components/Cards/StatCard.vue';
import { ref } from 'vue';
definePageMeta({
        layout: 'admin',
        middleware: ['auth', 'role-check'],
        requiredRole: 'admin'
    });
    
const stats = ref([
  {
    title: 'Total sales',
    value: '321k',
    iconPath: 'M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267zM10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.614 1.19c.395.536 1.086.906 1.903 1.05V15a1 1 0 102 0v-.413c.518-.104 1.016-.305 1.376-.608C12.398 13.501 13 12.746 13 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0010 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.614-1.19c-.395-.536-1.086-.906-1.903-1.05V5z',
  },
  {
    title: 'Visitor',
    value: '678k',
    iconPath: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
  },
  {
    title: 'Cvr',
    value: '7.89',
    iconPath: 'M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z',
  },
  {
    title: 'Total orders',
    value: '211k',
    iconPath: 'M9 2a1 1 0 000 2h2a1 1 0 100-2H9zM4 5a2 2 0 012-2v1a1 1 0 00-1 1v.01a1 1 0 00-1 1v.01a1 1 0 001 1h12a1 1 0 001-1V6a1 1 0 001-1V4a1 1 0 00-1-1H6a2 2 0 012 2z',
  },
]);

const revenueData = ref({
  labels: ['2 Dec', '3 Dec', '4 Dec', '5 Dec', '6 Dec', '7 Dec'],
  data: [30, 40, 35, 50, 49, 60],
});

const bestSellers = ref([
  {
    name: 'Wooden Chair',
    rating: '4.8/5',
  },
  {
    name: 'Dining Chair',
    rating: '4.8/5',
  },
  {
    name: 'Lamps Chairs',
    rating: '4.6/5',
  },
]);
</script>