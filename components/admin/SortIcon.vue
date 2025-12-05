<template>
  <span class="inline-block w-4 h-4">
    <Icon 
      v-if="sortKey === currentKey" 
      :name="sortOrder === 'asc' ? 'lucide:arrow-up' : 'lucide:arrow-down'" 
      class="w-4 h-4"
    />
    <Icon 
      v-else 
      name="lucide:arrow-up-down" 
      class="w-4 h-4 text-slate-300 group-hover:text-slate-500"
    />
  </span>
</template>

<script setup lang="ts">
defineProps<{ sortKey: string; sortOrder: 'asc' | 'desc'; currentKey: string }>();
</script>