<template>
  <div class="min-h-screen bg-[#F8FAFC] p-4 lg:p-10">
    <header class="mb-10 space-y-2 text-center max-w-2xl mx-auto">
      <h1 class="text-4xl font-black text-slate-900 tracking-tight">Hubungi <span class="text-indigo-600">Dukungan Teknis</span></h1>
      <p class="text-slate-500 font-medium text-lg leading-relaxed">
        Mengalami kendala teknis atau butuh bantuan kustomisasi? Tim kami siap membantu Anda 24/7.
      </p>
    </header>

    <div class="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
      <!-- Contact Cards -->
      <div v-for="contact in contacts" :key="contact.title" class="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 text-center space-y-6 group hover:-translate-y-2 transition-all duration-300">
        <div class="inline-flex p-5 rounded-3xl transition-colors" :class="contact.bg">
          <Icon :name="contact.icon" class="w-10 h-10" :class="contact.text" />
        </div>
        <div>
          <h3 class="text-xl font-black text-slate-800">{{ contact.title }}</h3>
          <p class="text-slate-500 text-sm font-medium mt-2">{{ contact.desc }}</p>
        </div>
        <div class="pt-4">
          <a :href="contact.link" class="text-sm font-black underline decoration-2 decoration-indigo-200 hover:decoration-indigo-500 underline-offset-8 transition-all">
            {{ contact.action }}
          </a>
        </div>
      </div>
    </div>

    <!-- Contact Form Section -->
    <div class="max-w-3xl mx-auto mt-16 bg-white rounded-[3rem] shadow-2xl shadow-slate-200 border border-slate-50 overflow-hidden">
      <div class="p-10 md:p-12">
        <h3 class="text-2xl font-black text-slate-900 mb-8">Kirim Tiket Bantuan</h3>
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div class="space-y-2">
              <label class="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Subjek</label>
              <select class="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-sm font-bold text-slate-700 outline-none ring-2 ring-transparent focus:ring-indigo-500 transition-all">
                <option>Masalah Login</option>
                <option>Error Database</option>
                <option>Pertanyaan Pembayaran</option>
                <option>Lainnya</option>
              </select>
            </div>
            <div class="space-y-2">
              <label class="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Prioritas</label>
              <select class="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-sm font-bold text-slate-700 outline-none ring-2 ring-transparent focus:ring-indigo-500 transition-all">
                <option>Rendah</option>
                <option>Normal</option>
                <option>Mendesak</option>
              </select>
            </div>
          </div>
          <div class="space-y-2">
            <label class="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Pesan Lengkap</label>
            <textarea rows="4" class="w-full bg-slate-50 border-none rounded-3xl px-5 py-4 text-sm font-bold text-slate-700 outline-none ring-2 ring-transparent focus:ring-indigo-500 transition-all resize-none" placeholder="Jelaskan detail kendala Anda..."></textarea>
          </div>
          <button type="submit" class="w-full py-5 bg-indigo-600 text-white font-black text-sm rounded-2xl shadow-xl shadow-indigo-600/20 hover:bg-slate-900 transition-all active:scale-95 flex items-center justify-center gap-3">
            Kirim Tiket Sekarang
            <Icon name="lucide:send" class="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'role-check'],
  permission: 'system.app'
});

const contacts = [
  { 
    title: 'Email Support', 
    desc: 'Untuk pertanyaan umum dan non-urgent.', 
    action: 'support@toeflarabi.id', 
    link: 'mailto:support@toeflarabi.id',
    icon: 'lucide:mail', 
    bg: 'bg-indigo-50 text-indigo-600',
    text: 'text-indigo-600'
  },
  { 
    title: 'Fast Response', 
    desc: 'Hubungi via WhatsApp untuk bantuan instalasi.', 
    action: '+62 812 3456 7890', 
    link: 'https://wa.me/6281234567890',
    icon: 'lucide:message-circle', 
    bg: 'bg-emerald-50 text-emerald-600',
    text: 'text-emerald-600'
  },
  { 
    title: 'Developer Portal', 
    desc: 'Dokumentasi teknis API & Integrasi.', 
    action: 'dev.toeflarabi.id', 
    link: '#',
    icon: 'lucide:code-2', 
    bg: 'bg-amber-50 text-amber-600',
    text: 'text-amber-600'
  }
];

const handleSubmit = () => {
  // Logic to handle form submission
  alert('Tiket bantuan Anda telah dikirim! Tim kami akan merespons melalui email segera.');
};
</script>
