<script setup lang="ts">
const props = defineProps<{sections:{id:string;name:string}[],activeId:string,isOpen:boolean}>()
const emit = defineEmits(['select','toggle','add-section', 'import-bank'])
</script>

<template>
  <div>
    <!-- Overlay for mobile -->
    <div v-if="isOpen" class="fixed inset-0 bg-black/60 z-40 md:hidden" @click="emit('toggle', true)"></div>
    
    <!-- Sidebar Navigation -->
    <nav class="w-72 bg-white border-r border-slate-200 pt-24 md:pt-0  p-4 fixed inset-y-0 left-0 z-50 md:static transform transition-transform duration-300 ease-in-out flex flex-col h-full"
         :class="isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'">
      
      <!-- Sidebar Header -->
      <div class="flex justify-between items-center mb-4 px-2 flex-shrink-0">
        <h3 class="font-bold text-slate-800 text-sm tracking-wide">Daftar Bagian</h3>
        <div class="flex items-center gap-1">
          <button @click="emit('import-bank')" class="p-2 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 hover:text-rose-700 transition-colors" title="Impor dari Bank Soal">
            <Icon name="lucide:database-zap" class="w-4 h-4" />
          </button>
          <button @click="emit('add-section')" class="p-2 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 hover:text-indigo-700 transition-colors" title="Tambah Bagian">
            <Icon name="lucide:plus" class="w-4 h-4" />
          </button>
        </div>
      </div>

      <!-- Scrollable Section List -->
      <div class="flex-grow overflow-y-auto -mr-2 pr-2 custom-scrollbar">
        <div class="space-y-1.5">
          <button v-for="s in sections" :key="s.id"
                  @click="emit('select', s.id); emit('toggle', true)"
                  class="w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-3 group"
                  :class="s.id === activeId ? 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200 shadow-sm' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'">
            <div class="w-1.5 h-1.5 rounded-full transition-colors" :class="s.id === activeId ? 'bg-indigo-500' : 'bg-slate-300 group-hover:bg-slate-400'"></div>
            <span class="truncate">{{ s.name }}</span>
            <Icon v-if="s.id === activeId" name="lucide:chevron-right" class="w-4 h-4 ml-auto text-indigo-400" />
          </button>
        </div>
      </div>
    </nav>
  </div>
</template>