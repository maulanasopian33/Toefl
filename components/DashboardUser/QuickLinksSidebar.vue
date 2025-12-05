<template>
  <div>
    <h2 class="text-xl font-semibold mb-4 text-slate-800">Menu Cepat</h2>
    <nav class="space-y-3">
      <a href="#" class="quick-link-card group bg-emerald-50 border-emerald-200 hover:border-emerald-400">
        <div class="quick-link-icon bg-emerald-100 text-emerald-600">
          <Icon name="lucide:book-open-check" class="w-6 h-6" />
        </div>
        <div>
          <h4 class="font-semibold text-emerald-900">Materi Belajar</h4>
          <p class="text-sm text-emerald-800/80">Pelajari konsep penting sebelum tes.</p>
        </div>
        <Icon name="lucide:chevron-right" class="quick-link-arrow text-emerald-500" />
      </a>

      <a href="#" class="quick-link-card group bg-sky-50 border-sky-200 hover:border-sky-400">
        <div class="quick-link-icon bg-sky-100 text-sky-600">
          <Icon name="lucide:file-question" class="w-6 h-6" />
        </div>
        <div>
          <h4 class="font-semibold text-sky-900">Latihan Soal</h4>
          <p class="text-sm text-sky-800/80">Asah kemampuan dengan soal latihan.</p>
        </div>
        <Icon name="lucide:chevron-right" class="quick-link-arrow text-sky-500" />
      </a>

      <NuxtLink to="/history" class="quick-link-card group bg-indigo-50 border-indigo-200 hover:border-indigo-400">
        <div class="quick-link-icon bg-indigo-100 text-indigo-600">
          <Icon name="lucide:bar-chart-3" class="w-6 h-6" />
        </div>
        <div>
          <h4 class="font-semibold text-indigo-900">Riwayat Skor</h4>
          <p class="text-sm text-indigo-800/80">Lihat progres dan hasil tes Anda.</p>
        </div>
        <Icon name="lucide:chevron-right" class="quick-link-arrow text-indigo-500" />
      </NuxtLink>

      <a href="#" class="quick-link-card group bg-slate-50 border-slate-200 hover:border-slate-400">
        <div class="quick-link-icon bg-slate-100 text-slate-600">
          <Icon name="lucide:help-circle" class="w-6 h-6" />
        </div>
        <div>
          <h4 class="font-semibold text-slate-900">Bantuan & FAQ</h4>
          <p class="text-sm text-slate-800/80">Temukan jawaban dari pertanyaan Anda.</p>
        </div>
        <Icon name="lucide:chevron-right" class="quick-link-arrow text-slate-500" />
      </a>
    </nav>
  </div>
</template>

<style scoped>
.quick-link-card {
    @apply flex items-center p-4 rounded-xl border-2 transition-all duration-200 ease-in-out transform hover:-translate-y-1 hover:shadow-lg;
}

.quick-link-icon {
    @apply flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center mr-4;
}

.quick-link-arrow {
    @apply w-5 h-5 ml-auto transform transition-transform duration-200 group-hover:translate-x-1;
}
</style>