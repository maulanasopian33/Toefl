<template>
  <!-- Bottom Navigation (Hanya untuk Mobile) -->
  <div class="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-[0_-1px_4px_rgba(0,0,0,0.05)] z-40">
    <nav class="flex justify-around">
      <NuxtLink to="/" class="bottom-nav-item" active-class="text-green-600">
        <div class="p-2 rounded-full">
          <Icon name="lucide:layout-dashboard" class="w-5 h-5" />
        </div>
        <span class="text-[10px] font-medium leading-tight">Dashboard</span>
      </NuxtLink>
      <NuxtLink to="/payment/history" class="bottom-nav-item">
        <div class="p-2 rounded-full">
          <Icon name="lucide:wallet" class="w-5 h-5" />
        </div>
        <span class="text-[10px] font-medium leading-tight">Pembayaran</span>
      </NuxtLink>
      <NuxtLink to="/history" class="bottom-nav-item" active-class="text-indigo-600">
        <div class="p-2 rounded-full">
          <Icon name="lucide:bar-chart-3" class="w-5 h-5" />
        </div>
        <span class="text-[10px] font-medium leading-tight">Riwayat</span>
      </NuxtLink>
      <a href="#" class="bottom-nav-item">
        <div class="p-2 rounded-full">
          <Icon name="lucide:user-circle-2" class="w-5 h-5" />
        </div>
        <span class="text-[10px] font-medium leading-tight">Profil</span>
      </a>
    </nav>
  </div>
</template>

<style scoped>
.bottom-nav-item {
  @apply flex flex-col items-center justify-center text-center p-2 w-full text-slate-600 hover:bg-slate-50 transition-colors;
}
</style>