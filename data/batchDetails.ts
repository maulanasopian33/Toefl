export const batchData = {
  id: "BATCH123",
  name: "TOAFL Batch A - 2025",
  status: "Upcoming",
  startDate: "19 Agu 2025",
  endDate: "18 Sep 2025",
  participantsCount: 89,
  paymentsTotal: 3200000,

  sections: [
    {
      id: 1,
      name: "Listening",
      description: "Bagian listening comprehension",
      groups: [
        { id: 11, name: "Listening A", questionsCount: 20 },
        { id: 12, name: "Listening B", questionsCount: 25 },
      ],
    },
    {
      id: 2,
      name: "Structure",
      description: "Structure & Written Expression",
      groups: [{ id: 21, name: "Structure A", questionsCount: 30 }],
    },
  ],

  participants: [
    { id: 1, name: "Maulana Sopian", email: "maulana@example.com", paymentStatus: "Paid" }, // Lunas
    { id: 2, name: "Rizky Kurniawan", email: "rizky@example.com", paymentStatus: "Pending" }, // Menunggu Konfirmasi
    { id: 3, name: "Sarah Anjani", email: "sarah@example.com", paymentStatus: "Paid" }, // Lunas
    { id: 4, name: "Budi Santoso", email: "budi@example.com", paymentStatus: "Paid" }, // Lunas
    { id: 5, name: "Citra Lestari", email: "citra@example.com", paymentStatus: "Unpaid" }, // Belum Bayar
    { id: 6, name: "Dewi Anggraini", email: "dewi@example.com", paymentStatus: "Paid" }, // Lunas
    { id: 7, name: "Eko Prasetyo", email: "eko@example.com", paymentStatus: "Pending" }, // Menunggu Konfirmasi
    { id: 8, name: "Fitriani", email: "fitri@example.com", paymentStatus: "Paid" }, // Lunas
    { id: 9, name: "Gilang Ramadhan", email: "gilang@example.com", paymentStatus: "Unpaid" }, // Belum Bayar
    { id: 10, name: "Hana Yulita", email: "hana@example.com", paymentStatus: "Paid" }, // Lunas
  ],

  recentActivities: [
    "Peserta baru: Maulana ditambahkan",
    "Group Listening A ditambah",
    "Pembayaran diterima Rp120.000",
  ],

  payments: [
    { id: 1, name: "Maulana Sopian", amount: 150000, status: "Paid", date: "10 Agu 2025" },
    { id: 2, name: "Sarah Anjani", amount: 150000, status: "Paid", date: "11 Agu 2025" },
    { id: 3, name: "Budi Santoso", amount: 150000, status: "Paid", date: "11 Agu 2025" },
    { id: 4, name: "Rizky Kurniawan", amount: 150000, status: "Pending", date: "12 Agu 2025" },
    { id: 5, name: "Dewi Anggraini", amount: 150000, status: "Paid", date: "12 Agu 2025" },
    { id: 6, name: "Eko Prasetyo", amount: 150000, status: "Pending", date: "13 Agu 2025" },
    { id: 7, name: "Fitriani", amount: 150000, status: "Paid", date: "13 Agu 2025" },
    { id: 8, name: "Hana Yulita", amount: 150000, status: "Paid", date: "14 Agu 2025" },
  ],

  results: [
    { id: 1, name: "Maulana Sopian", score: 487 },
    { id: 2, name: "Sarah Anjani", score: 503 },
    { id: 3, name: "Budi Santoso", score: 550 },
    { id: 4, name: "Rizky Kurniawan", score: 450 },
    { id: 5, name: "Dewi Anggraini", score: 510 },
    { id: 6, name: "Eko Prasetyo", score: 499 },
    { id: 7, name: "Fitriani", score: 525 },
    { id: 8, name: "Hana Yulita", score: 470 },
    { id: 9, name: "Citra Lestari", score: null },
    { id: 10, name: "Gilang Ramadhan", score: null },
  ],
};