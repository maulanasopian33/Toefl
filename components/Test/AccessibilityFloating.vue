<template>
  <div class="fixed bottom-24 right-6 z-[60] flex flex-col items-end space-y-4">
    <!-- Menu -->
    <Transition name="scale">
      <div v-if="isOpen" class="bg-white rounded-[2rem] shadow-2xl border border-gray-100 p-6 w-64 space-y-4 mb-2">
        <div class="flex items-center space-x-2 text-gray-900 mb-2">
          <Icon name="heroicons:adjustments-horizontal" class="w-5 h-5 text-emerald-600" />
          <h4 class="font-black text-sm uppercase tracking-wider">Aksesibilitas</h4>
        </div>
        
        <div class="space-y-3">
          <p class="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Ukuran Teks</p>
          <div class="grid grid-cols-1 gap-2">
            <button 
              v-for="size in sizes" 
              :key="size.id"
              @click="selectSize(size.id)"
              :class="[
                currentSize === size.id 
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20' 
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              ]"
              class="flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 font-bold group"
            >
              <div class="flex flex-col items-start">
                <span class="text-sm">{{ size.label }}</span>
              </div>
              <Icon v-if="currentSize === size.id" name="heroicons:check-circle" class="w-5 h-5" />
              <span v-else :class="size.previewClass" class="font-black opacity-30 group-hover:opacity-60">A</span>
            </button>
          </div>
        </div>

        <div class="pt-2 border-t border-gray-50">
           <button @click="isOpen = false" class="w-full py-2 bg-gray-900 text-white text-xs font-black rounded-xl hover:bg-black transition-all">
             Tutup
           </button>
        </div>
      </div>
    </Transition>

    <!-- Floating Button -->
    <button 
      @click="toggleMenu"
      class="w-14 h-14 bg-white text-emerald-600 rounded-full shadow-2xl border border-emerald-50 flex items-center justify-center hover:scale-110 active:scale-90 transition-all group relative"
      :class="{'ring-4 ring-emerald-500/10': isOpen}"
    >
      <div class="absolute inset-0 bg-emerald-50 rounded-full scale-0 group-hover:scale-100 transition-transform duration-500 opacity-50"></div>
      <Icon :name="isOpen ? 'heroicons:x-mark' : 'heroicons:language'" class="w-7 h-7 relative z-10" />
      
      <!-- Tooltip -->
      <div v-if="!isOpen" class="absolute right-full mr-4 px-3 py-1.5 bg-gray-900 text-white text-[10px] font-black rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none uppercase tracking-widest hidden md:block">
        Ukuran Teks
      </div>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
  currentSize: string;
}>();

const emit = defineEmits(['update:size']);

const isOpen = ref(false);

const sizes = [
  { id: 'small', label: 'Kecil', previewClass: 'text-[10px]' },
  { id: 'normal', label: 'Normal', previewClass: 'text-sm' },
  { id: 'large', label: 'Besar', previewClass: 'text-lg' },
  { id: 'extra-large', label: 'Sangat Besar', previewClass: 'text-2xl' },
];

const toggleMenu = () => {
  isOpen.value = !isOpen.value;
};

const selectSize = (sizeId: string) => {
  emit('update:size', sizeId);
};
</script>

<style scoped>
.scale-enter-active, .scale-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.scale-enter-from, .scale-leave-to {
  opacity: 0;
  transform: scale(0.9) translateY(20px);
}
</style>
