<template>
  <div class="space-y-6">
    <div class="flex items-center space-x-3 text-gray-400">
      <Icon name="heroicons:squares-2x2" class="w-5 h-5" />
      <h2 class="text-xs font-bold uppercase tracking-[0.2em]">Menu Dashboard</h2>
    </div>
    
    <nav class="flex flex-col space-y-2">
      <NuxtLink 
        v-for="link in quickLinks" 
        :key="link.to"
        :to="link.to" 
        class="group relative flex items-center gap-4 p-4 rounded-2xl border-2 border-transparent transition-all duration-300 hover:bg-emerald-50/50 hover:border-emerald-100"
      >
        <div class="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 bg-gray-50 text-gray-400 group-hover:bg-emerald-100 group-hover:text-emerald-600">
          <Icon :name="link.icon" class="w-6 h-6" />
        </div>
        <div class="flex-1">
          <h4 class="font-bold text-gray-900 text-sm tracking-tight group-hover:text-emerald-700 transition-colors">{{ link.title }}</h4>
          <p class="text-xs font-medium text-gray-400 group-hover:text-emerald-600/70 transition-colors">{{ link.description }}</p>
        </div>
        <Icon name="heroicons:chevron-right" class="w-4 h-4 text-gray-300 group-hover:translate-x-1 group-hover:text-emerald-500 transition-all" />
      </NuxtLink>
    </nav>

    <!-- Support/Help Center -->
    <div class="pt-6 border-t border-gray-50">
      <div class="p-6 bg-gray-900 rounded-[2rem] relative overflow-hidden group cursor-pointer">
        <div class="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
        <div class="relative z-10 space-y-3">
          <div class="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white">
            <Icon name="heroicons:question-mark-circle" class="w-6 h-6" />
          </div>
          <div>
            <h5 class="text-white font-extrabold text-sm">Butuh Bantuan?</h5>
            <p class="text-gray-400 text-[11px] font-medium leading-relaxed">Hubungi tim support kami atau baca panduan di FAQ.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const quickLinks = [
  {
    to: '/materi',
    icon: 'heroicons:book-open',
    title: 'Materi Belajar',
    description: 'Pelajari konsep penting sebelum tes.'
  },
  {
    to: '/practice',
    icon: 'heroicons:academic-cap',
    title: 'Latihan Soal',
    description: 'Asah kemampuan dengan soal latihan.'
  },
  {
    to: '/history',
    icon: 'heroicons:presentation-chart-line',
    title: 'Riwayat Skor',
    description: 'Lihat progres dan hasil tes Anda.'
  }
];
</script>

<style scoped>
/* No extra styles needed as we use Tailwind and matching layout */
</style>
