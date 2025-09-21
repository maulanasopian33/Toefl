<template>
  <div class="bg-white p-6 rounded-xl shadow-sm">
    <div class="flex items-center justify-between mb-4">
      <h4 class="font-semibold text-gray-800">Best Seller</h4>
      <svg class="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
        <path d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" />
      </svg>
    </div>
    <div class="space-y-4">
      <div v-for="(item, index) in bestSellers" :key="index" class="flex items-center justify-between">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-gray-200 rounded-lg mr-3"></div>
          <div>
            <p class="font-medium text-gray-800">{{ item.name }}</p>
            <div class="flex items-center text-sm text-yellow-500">
              <span>{{ item.rating }}</span>
              <div class="flex ml-1">
                <svg class="w-3 h-3 fill-current" viewBox="0 0 20 20">
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  bestSellers: {
    type: Array,
    required: true,
  },
});
</script>