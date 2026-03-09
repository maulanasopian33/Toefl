<template>
  <div v-if="isOpen" class="fixed z-[999] pointer-events-none inset-0 flex items-end justify-end p-4 md:p-8">
    
    <!-- ───── Full Content View ───── -->
    <Transition
      enter-active-class="transition duration-500 ease-out"
      enter-from-class="transform translate-x-full opacity-0 scale-95"
      enter-to-class="transform translate-x-0 opacity-100 scale-100"
      leave-active-class="transition duration-300 ease-in"
      leave-from-class="transform translate-x-0 opacity-100 scale-100"
      leave-to-class="transform translate-x-full opacity-0 scale-95"
    >
      <div 
        v-if="!isMinimized" 
        class="pointer-events-auto bg-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] h-[85vh] w-full max-w-xl rounded-[2.5rem] border border-slate-100 flex flex-col overflow-hidden"
      >
        <!-- Header -->
        <div class="px-8 py-6 border-b border-slate-100 flex items-center justify-between flex-shrink-0 bg-white">
          <div class="flex items-center gap-3">
            <div class="p-2 bg-emerald-50 rounded-xl text-emerald-600">
              <Icon name="lucide:book-open" class="w-5 h-5" />
            </div>
            <div>
              <h3 class="font-black text-slate-900 text-sm">Panduan Aktif</h3>
              <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Membantu Anda Sambil Bekerja</p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <button 
              @click="minimize" 
              class="p-2.5 rounded-2xl text-slate-400 hover:bg-slate-50 hover:text-slate-900 transition-all"
              title="Sembunyikan ke Bubble"
            >
              <Icon name="lucide:minus" class="w-5 h-5" />
            </button>
            <button 
              @click="close" 
              class="p-2.5 rounded-2xl text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-all"
              title="Tutup Panduan"
            >
              <Icon name="lucide:x" class="w-5 h-5" />
            </button>
          </div>
        </div>

        <!-- Content -->
        <div class="flex-1 overflow-y-auto p-8 custom-scrollbar bg-[#F8FAFC]/30">
          <AdminSupportDocReaderContent v-if="currentDoc" :doc="currentDoc" :show-footer="false" />
        </div>

        <!-- Footer -->
        <div class="px-8 py-3 bg-slate-50 border-t border-slate-100 flex justify-center">
            <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">
              Jendela ini tetap terbuka saat Anda berpindah menu
            </p>
        </div>
      </div>
    </Transition>

    <!-- ───── Floating Bubble View ───── -->
    <Transition
      enter-active-class="transition duration-500 ease-out"
      enter-from-class="transform translate-y-20 opacity-0 scale-50"
      enter-to-class="transform translate-y-0 opacity-100 scale-100"
      leave-active-class="transition duration-300 ease-in"
      leave-from-class="transform translate-y-0 opacity-100 scale-100"
      leave-to-class="transform translate-y-20 opacity-0 scale-50"
    >
      <div 
        v-if="isMinimized" 
        class="pointer-events-auto flex flex-col items-end gap-3"
      >
        <!-- Tooltip/Label -->
        <div class="bg-slate-900 text-white px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl animate-bounce">
           Lanjutkan Panduan: {{ currentDoc?.title }}
        </div>
        
        <!-- Bubble Button -->
        <button 
          @click="maximize"
          class="w-16 h-16 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-3xl shadow-[0_15px_30px_-5px_rgba(79,70,229,0.4)] flex items-center justify-center text-white hover:scale-110 active:scale-90 transition-all group relative border-2 border-white/20"
        >
           <Icon name="lucide:book-open" class="w-8 h-8 group-hover:rotate-12 transition-transform" />
           <!-- Notification Badge -->
           <span class="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white animate-pulse"></span>
        </button>
      </div>
    </Transition>

  </div>
</template>

<script setup lang="ts">
import { useDocPopupStore } from '@/stores/useDocPopupStore'
import { storeToRefs } from 'pinia'

const store = useDocPopupStore()
const { isOpen, isMinimized, currentDoc } = storeToRefs(store)
const { close, minimize, maximize } = store

</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #E2E8F0;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #CBD5E1;
}
</style>
