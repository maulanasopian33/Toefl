<template>
  <div class="min-h-screen bg-[#F8FAFC] p-4 lg:p-10">
    <header class="mb-10 space-y-2">
      <h1 class="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-4">
        <div class="p-3 bg-emerald-600 rounded-2xl shadow-lg shadow-emerald-600/20">
          <Icon name="lucide:book-open" class="w-8 h-8 text-white" />
        </div>
        Panduan Penggunaan
      </h1>
      <p class="text-slate-500 font-medium text-lg">
        Pelajari cara mengelola platform ini dengan efisien.
      </p>
    </header>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <!-- Main Content -->
      <div class="lg:col-span-8 space-y-6">
        <section v-for="section in docs" :key="section.title" class="bg-white rounded-[2.5rem] p-8 md:p-10 border border-slate-100 shadow-xl shadow-slate-200/40 space-y-6">
          <h2 class="text-2xl font-black text-slate-800 flex items-center gap-3">
            <span class="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-emerald-600 text-sm border border-slate-100">{{ section.id }}</span>
            {{ section.title }}
          </h2>
          
          <div class="space-y-4">
            <div v-for="item in section.items" :key="item.q" class="p-6 rounded-3xl bg-slate-50 border border-slate-100 group transition-all hover:bg-white hover:shadow-lg hover:shadow-slate-200/50">
              <h3 class="font-bold text-slate-900 mb-2 flex items-center justify-between">
                {{ item.q }}
                <Icon name="lucide:chevron-right" class="w-4 h-4 text-slate-300 group-hover:text-emerald-500 transition-colors" />
              </h3>
              <p class="text-sm text-slate-500 leading-relaxed">{{ item.a }}</p>
            </div>
          </div>
        </section>
      </div>

      <!-- Quick Links Sidebar -->
      <aside class="lg:col-span-4 space-y-6">
        <div class="bg-indigo-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-indigo-600/20 relative overflow-hidden group">
          <div class="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
          <div class="relative z-10 space-y-4">
            <h3 class="text-xl font-black">Butuh Bantuan Lebih?</h3>
            <p class="text-indigo-100 text-sm font-medium leading-relaxed">
              Tim dukungan kami siap membantu Anda menyelesaikan kendala teknis atau pertanyaan seputar platform.
            </p>
            <NuxtLink to="/admin/support/contact" class="inline-flex items-center gap-2 bg-white text-indigo-600 px-6 py-3 rounded-2xl font-black text-sm shadow-lg hover:bg-slate-50 transition-all active:scale-95">
              Hubungi Kami
              <Icon name="lucide:headphones" class="w-4 h-4" />
            </NuxtLink>
          </div>
        </div>

        <div class="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-6">
          <h3 class="text-sm font-black text-slate-400 uppercase tracking-widest">Pintasan Cepat</h3>
          <div class="space-y-3">
            <NuxtLink v-for="link in shortcuts" :key="link.name" :to="link.href" class="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors group">
              <div class="p-2 rounded-xl bg-slate-50 group-hover:bg-white transition-colors">
                <Icon :name="link.icon" class="w-5 h-5 text-slate-400 group-hover:text-indigo-600" />
              </div>
              <span class="text-sm font-bold text-slate-600 group-hover:text-slate-900">{{ link.name }}</span>
            </NuxtLink>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'role-check'],
  permission: 'system.app'
});

const docs = [
  {
    id: 1,
    title: 'Manajemen Batch',
    items: [
      { q: 'Bagaimana cara membuka pendaftaran?', a: 'Buka menu Batch > Add Batch, tentukan tanggal mulai dan selesai, lalu set status menjadi "Published".' },
      { q: 'Bagaimana memantau progres peserta?', a: 'Klik tombol detail (ikon mata) pada daftar Batch untuk melihat statistik peserta secara real-time.' }
    ]
  },
  {
    id: 2,
    title: 'Pengaturan Soal (Bank Soal)',
    items: [
      { q: 'Format pertanyaan yang didukung?', a: 'Sistem mendukung pilihan ganda (TOEFL/TOAFL Style) dengan integrasi Listening (Audio MP3) dan Reading (Passage).' },
      { q: 'Mengapa soal tidak muncul di user?', a: 'Pastikan soal sudah masuk ke dalam Group dan Section, serta Batch yang bersangkutan sudah diaktifkan.' }
    ]
  },
  {
    id: 3,
    title: 'Sertifikat & Penilaian',
    items: [
      { q: 'Kapan sertifikat bisa diunduh?', a: 'Sertifikat akan tersedia otomatis setelah admin memvalidasi hasil ujian user di menu Results.' },
      { q: 'Bagaimana cara mengubah tabel skoring?', a: 'Masuk ke menu Penilaian > Tabel Skoring untuk menyesuaikan konversi nilai mentah ke skor TOEFL.' }
    ]
  }
];

const shortcuts = [
  { name: 'Tambah Batch Baru', href: '/admin/batch/add', icon: 'lucide:plus-circle' },
  { name: 'Lihat Transaksi', href: '/admin/payments', icon: 'lucide:credit-card' },
  { name: 'Audit Log System', href: '/admin/log-activity', icon: 'lucide:shield-check' }
];
</script>
