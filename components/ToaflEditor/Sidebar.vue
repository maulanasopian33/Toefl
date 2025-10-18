<script setup lang="ts">
const props = defineProps<{sections:{id:string;name:string}[],activeId:string,isOpen:boolean}>()
const emit = defineEmits(['select','toggle','add-section'])
</script>

<template>
  <div>
    <!-- Overlay for mobile -->
    <div v-if="isOpen" class="fixed inset-0 bg-black/60 z-20 md:hidden" @click="emit('toggle', true)"></div>
    
    <!-- Sidebar Navigation -->
    <nav class="w-64 bg-white border-r border-gray-200 p-4 fixed inset-y-0 left-0 z-30 md:static transform transition-transform duration-300 ease-in-out flex flex-col"
         :class="isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'">
      
      <!-- Sidebar Header -->
      <div class="flex justify-between items-center mb-4 px-2 flex-shrink-0">
        <h3 class="font-semibold text-gray-500 text-sm tracking-wider uppercase">Bagian Ujian</h3>
        <button @click="emit('add-section')" class="p-2 rounded-lg bg-indigo-100 text-indigo-700 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
        </button>
      </div>

      <!-- Scrollable Section List -->
      <div class="flex-grow overflow-y-auto -mr-2 pr-2">
        <div class="space-y-1">
          <button v-for="s in sections" :key="s.id"
                  @click="emit('select', s.id); emit('toggle', true)"
                  class="block w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200"
                  :class="s.id === activeId ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-700 hover:bg-gray-100'">
            {{ s.name }}
          </button>
        </div>
      </div>
    </nav>
  </div>
</template>