// src/data/navItems.js

export default [
  {
    name: 'Dashboard',
    link: '/admin',
    icon: `<svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 13h1v7a2 2 0 0 0 2 2h4v-9H3zm9-4h9v11a2 2 0 0 1-2 2h-7V9zm0-7a1 1 0 0 1 .707.293l4 4A1 1 0 0 1 16 8H8a1 1 0 0 1-.707-1.707l4-4A1 1 0 0 1 12 2z"/>
    </svg>`,
  },

  // BATCH
  {
    name: 'Batch',
    link: '#',
    icon: `<svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M4 5h16a1 1 0 0 1 1 1v3H3V6a1 1 0 0 1 1-1zm-1 6h18v3H3zm0 5h18v3a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"/>
    </svg>`,
    children: [
      { name: 'All Batch', link: '/admin/batch' },
      { name: 'Add Batch', link: '/admin/batch/add' },
      { name: 'Categories', link: '/admin/batch/categories' },
    ],
  },

  // PESERTA
  {
    name: 'Peserta',
    link: '#',
    icon: `<svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 11a4 4 0 1 0-4-4 4.005 4.005 0 0 0 4 4zM8 11a3 3 0 1 0-3-3 3.003 3.003 0 0 0 3 3zm8 2c-2.67 0-8 1.34-8 4v2h12v-2c0-2.66-5.33-4-8-4zM8 13c-2.67 0-6 1.34-6 4v2h4v-2c0-1.37.63-2.55 1.7-3.5A9.18 9.18 0 0 0 8 13z"/>
    </svg>`,
    children: [
      { name: 'Semua Peserta', link: '/admin/participants' },
      { name: 'Tambah Peserta', link: '/admin/participants/add' },
      { name: 'Import Peserta', link: '/admin/participants/import' },
    ],
  },

  // BANK SOAL
  {
    name: 'Bank Soal',
    link: '#',
    icon: `<svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M5 3h14a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2h-5l-4 3v-3H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm2 4v2h10V7zm0 4v2h7v-2z"/>
    </svg>`,
    children: [
      { name: 'Semua Soal', link: '/admin/questions' },
      { name: 'Section', link: '/admin/sections' },
      { name: 'Group Soal', link: '/admin/groups' },
      { name: 'Tambah Soal', link: '/admin/questions/add' },
    ],
  },

  // MEDIA
  {
    name: 'Media Library',
    link: '#',
    icon: `<svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M4 5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H9l-3 3v-3H6a2 2 0 0 1-2-2zm3 1a2 2 0 1 0 2 2 2.003 2.003 0 0 0-2-2zm11 9-3.5-4.5-2.5 3.01-1.5-1.8L7 15z"/>
    </svg>`,
    children: [
      { name: 'Semua Media', link: '/admin/media' },
      { name: 'Upload Media', link: '/admin/media/upload' },
    ],
  },

  // PAYMENTS
  {
    name: 'Payments',
    link: '#',
    icon: `<svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M4 4h16a2 2 0 0 1 2 2v3H2V6a2 2 0 0 1 2-2zm-2 7h20v7a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2zm13 4h3v2h-3z"/>
    </svg>`,
    children: [
      { name: 'Semua Pembayaran', link: '/admin/payments' },
      { name: 'Tambah Pembayaran', link: '/admin/payments/add' },
      { name: 'Tagihan per Batch', link: '/admin/payments/invoices' },
      { name: 'Rekap Keuangan', link: '/admin/payments/recap' },
    ],
  },

  // RESULTS
  {
    name: 'Results',
    link: '#',
    icon: `<svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M5 3h14a2 2 0 0 1 2 2v16l-4-3H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm3 5v7h2V8zm4 3v4h2v-4zm4-2v6h2v-6z"/>
    </svg>`,
    children: [
      { name: 'Hasil per Batch', link: '/admin/results/batch' },
      { name: 'Hasil per Peserta', link: '/admin/results/participants' },
    ],
  },

  // CERTIFICATES
  {
    name: 'Certificates',
    link: '#',
    icon: `<svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 3h12a2 2 0 0 1 2 2v10.5l-3-1.5-3 1.5-3-1.5-3 1.5-3-1.5V5a2 2 0 0 1 2-2zm3 4v2h6V7z"/>
    </svg>`,
    children: [
      { name: 'Generate Sertifikat', link: '/admin/certificates/generate' },
      { name: 'Template Sertifikat', link: '/admin/certificates/templates' },
      { name: 'Riwayat Sertifikat', link: '/admin/certificates/history' },
    ],
  },

  // REPORTS
  {
    name: 'Reports',
    link: '#',
    icon: `<svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M5 3h11l5 5v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm7 2v5h5zM7 13v2h4v-2zm0 4v2h7v-2z"/>
    </svg>`,
    children: [
      { name: 'Laporan Ujian', link: '/admin/reports/exam' },
      { name: 'Laporan Peserta', link: '/admin/reports/participants' },
      { name: 'Laporan Keuangan', link: '/admin/reports/finance' },
    ],
  },

  // LOGS
  {
    name: 'Log Aktivitas',
    link: '/admin/log-activity',
    icon: `<svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"/>
      <path d="M9 4v16h2V4zm5 0v16h2V4z"/>
    </svg>`,
  },

  // SETTINGS
  {
    name: 'Settings',
    link: '#',
    icon: `<svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.14 12.94a7.953 7.953 0 0 0 .06-.94 7.953 7.953 0 0 0-.06-.94l2.03-1.58a.5.5 0 0 0 .12-.64l-1.92-3.32a.5.5 0 0 0-.61-.22l-2.39.96a7.994 7.994 0 0 0-1.63-.94L14.5 2.5a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 0-.5.5l-.34 2.32a7.994 7.994 0 0 0-1.63.94l-2.39-.96a.5.5 0 0 0-.61.22L2.61 8.34a.5.5 0 0 0 .12.64l2.03 1.58a7.953 7.953 0 0 0-.06.94c0 .32.02.63.06.94l-2.03 1.58a.5.5 0 0 0-.12.64l1.92 3.32a.5.5 0 0 0 .61.22l2.39-.96c.5.39 1.04.72 1.63.94l.34 2.32a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5l.34-2.32c.59-.22 1.13-.55 1.63-.94l2.39.96a.5.5 0 0 0 .61-.22l1.92-3.32a.5.5 0 0 0-.12-.64zM12 15a3 3 0 1 1 3-3 3.003 3.003 0 0 1-3 3z"/>
    </svg>`,
    children: [
      { name: 'Pengaturan Ujian', link: '/admin/settings/exam' },
      { name: 'Pengaturan Aplikasi', link: '/admin/settings/general' },
      { name: 'Pengaturan Lembaga', link: '/admin/settings/institution' },
      { name: 'User & Roles', link: '/admin/settings/users' },
    ],
  },

  // SUPPORT
  {
    name: 'Support',
    link: '#',
    icon: `<svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2a9 9 0 0 0-9 9v1a5 5 0 0 0 5 5h1v-5H7v-1a5 5 0 0 1 10 0v1h-2v5h1a5 5 0 0 0 5-5v-1a9 9 0 0 0-9-9zm-1 17v3h2v-3z"/>
    </svg>`,
    children: [
      { name: 'Panduan Penggunaan', link: '/admin/support/docs' },
      { name: 'Kontak Support', link: '/admin/support/contact' },
    ],
  },
];
