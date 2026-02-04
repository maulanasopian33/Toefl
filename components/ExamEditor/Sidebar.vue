<script setup lang="ts">
import { computed } from 'vue'
import draggable from 'vuedraggable'
const props = defineProps<{sections:{id:string;name:string}[],activeId:string,isOpen:boolean}>()
const emit = defineEmits(['select','toggle','add-section', 'import-bank', 'reorder'])

const list = computed({
  get: () => props.sections,
  set: (val) => emit('reorder', val)
})
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
        <draggable 
          v-model="list" 
          item-key="id"
          class="space-y-1.5"
          ghost-class="opacity-50"
          drag-class="rotate-1"
        >
          <template #item="{element: s}">
            <button @click="emit('select', s.id); emit('toggle', true)"
                    class="w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-3 group relative overflow-hidden"
                    :class="s.id === activeId ? 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200 shadow-sm' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'">
              <div class="flex items-center gap-3 flex-1 min-w-0">
                <div class="w-1.5 h-1.5 rounded-full transition-colors flex-shrink-0" :class="s.id === activeId ? 'bg-indigo-500' : 'bg-slate-300 group-hover:bg-slate-400'"></div>
                <span class="truncate">{{ s.name }}</span>
              </div>
              
              <div class="flex items-center gap-2 flex-shrink-0">
                <Icon v-if="s.id === activeId" name="lucide:chevron-right" class="w-4 h-4 text-indigo-400" />
                <Icon name="lucide:grip-vertical" class="w-4 h-4 text-slate-300 cursor-grab active:cursor-grabbing hover:text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </button>
          </template>
        </draggable>
      </div>
    </nav>
  </div>
</template>