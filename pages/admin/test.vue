<template>
  <div>
    <main class="flex-grow lg:w-3/4">
            <!-- Batch Header Section -->
            <div class="card mb-6">
                <div class="flex flex-col md:flex-row items-start md:items-center justify-between mb-4">
                    <div>
                        <h2 class="text-2xl font-bold text-gray-900" id="batch-title">Detail Batch Ujian</h2>
                        <p class="text-gray-600 text-sm" id="batch-subtitle">ID Batch: <span id="batch-id-display"></span></p>
                    </div>
                    <div class="mt-4 md:mt-0 text-right">
                        <p class="text-gray-700 text-sm font-semibold">Tanggal Ujian:</p>
                        <p class="text-gray-900 text-base font-bold" id="batch-dates-display"></p>
                    </div>
                </div>
                <hr class="my-4 border-gray-200">
                <p class="text-gray-700" id="batch-description">Deskripsi singkat tentang batch ujian ini.</p>
                <div class="flex flex-col sm:flex-row gap-4 mt-6">
                    <button onclick="editBatch()" class="secondary-button text-white font-semibold py-2 px-4 rounded-lg shadow-md flex-1">
                        <span class="flex items-center justify-center"><svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>Edit Batch</span>
                    </button>
                    <button onclick="deleteBatch()" class="danger-button text-white font-semibold py-2 px-4 rounded-lg shadow-md flex-1">
                        <span class="flex items-center justify-center"><svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>Hapus Batch</span>
                    </button>
                </div>
            </div>

            <!-- Participant and Progress Overview Section -->
            <div class="card mb-6">
                <h3 class="text-xl font-bold text-gray-800 mb-4">Ringkasan Peserta & Progres</h3>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div class="section-box">
                        <p class="text-3xl font-bold text-teal-600" id="total-participants-count">0</p>
                        <p class="text-gray-600 text-sm mt-1">Total Peserta</p>
                    </div>
                    <div class="section-box">
                        <p class="text-3xl font-bold text-blue-600" id="completed-count">0</p>
                        <p class="text-gray-600 text-sm mt-1">Selesai Ujian</p>
                    </div>
                    <div class="section-box">
                        <p class="text-3xl font-bold text-orange-600" id="in-progress-count">0</p>
                        <p class="text-gray-600 text-sm mt-1">Sedang Berlangsung</p>
                    </div>
                </div>
            </div>

            <!-- Participant List Section -->
            <div class="card mb-6">
                <h3 class="text-xl font-bold text-gray-800 mb-4">Daftar Lengkap Peserta</h3>
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Peserta</th>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status Ujian</th>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nilai Akhir</th>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tindakan</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200" id="participants-table-body">
                            <!-- Participant data will be loaded here -->
                        </tbody>
                    </table>
                </div>
                <p id="no-participants-message" class="text-gray-500 text-center py-4 hidden">Belum ada peserta yang bergabung.</p>
            </div>

            <!-- Additional Admin Actions Section -->
            <div class="card mb-6">
                <h3 class="text-xl font-bold text-gray-800 mb-4">Tindakan Lanjutan</h3>
                <div class="space-y-4">
                    <button onclick="downloadScores()" class="main-button text-white font-semibold py-3 px-6 rounded-lg shadow-md w-full">
                        <span class="flex items-center justify-center"><svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>Unduh Laporan Nilai</span>
                    </button>
                    <button onclick="sendNotifications()" class="secondary-button text-white font-semibold py-3 px-6 rounded-lg shadow-md w-full">
                        <span class="flex items-center justify-center"><svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 01-6 0v-1m6 0H9"></path></svg>Kirim Notifikasi Massal</span>
                    </button>
                </div>
            </div>
        </main>

        <!-- Sidebar -->
        <aside class="lg:w-1/4">
            <div class="card">
                <h3 class="text-xl font-bold text-gray-800 mb-4">Menu Admin</h3>
                <ul class="space-y-3">
                    <li>
                        <a href="#" class="flex items-center text-gray-700 hover:text-teal-600 transition duration-150 ease-in-out">
                            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M15 12a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                            Kelola Semua Batch
                        </a>
                    </li>
                    <li>
                        <a href="#" class="flex items-center text-gray-700 hover:text-teal-600 transition duration-150 ease-in-out">
                            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                            Kelola Pengguna
                        </a>
                    </li>
                    <li>
                        <a href="#" class="flex items-center text-gray-700 hover:text-teal-600 transition duration-150 ease-in-out">
                            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c1.657 0 3 .895 3 2s-1.343 2-3 2-3-.895-3-2 1.343-2 3-2z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 16a6 6 0 00-6 6h12a6 6 0 00-6-6z"></path></svg>
                            Kelola Soal Ujian
                        </a>
                    </li>
                    <li>
                        <a href="#" class="flex items-center text-gray-700 hover:text-teal-600 transition duration-150 ease-in-out">
                            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 12a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1h-6a1 1 0 01-1-1v-6z"></path></svg>
                            Laporan & Analisis
                        </a>
                    </li>
                </ul>
            </div>
        </aside>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
        layout: 'admin'
    });
</script>

<style>
body {
            font-family: 'Inter', sans-serif;
            background-color: #f3f4f6; /* Light gray background */
            line-height: 1.6;
        }
        .card {
            background-color: #ffffff;
            border-radius: 0.75rem; /* rounded-xl */
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); /* shadow-md */
            padding: 1.5rem;
        }
        .main-button {
            background-color: #10b981; /* Green */
            transition: all 0.2s ease-in-out;
        }
        .main-button:hover {
            background-color: #059669; /* Darker green */
            transform: translateY(-1px);
            box-shadow: 0 2px 4px rgba(0,0,0,0.15);
        }
        .secondary-button {
            background-color: #06b6d4; /* Cyan */
            transition: all 0.2s ease-in-out;
        }
        .secondary-button:hover {
            background-color: #0891b2; /* Darker cyan */
            transform: translateY(-1px);
            box-shadow: 0 2px 4px rgba(0,0,0,0.15);
        }
        .danger-button {
            background-color: #ef4444; /* Red */
            transition: all 0.2s ease-in-out;
        }
        .danger-button:hover {
            background-color: #dc2626; /* Darker red */
            transform: translateY(-1px);
            box-shadow: 0 2px 4px rgba(0,0,0,0.15);
        }
        .alert-info {
            background-color: #e0f2fe; /* Light blue */
            border-left: 4px solid #3b82f6; /* Blue border */
            color: #1e40af; /* Dark blue text */
            padding: 1rem;
            border-radius: 0.5rem;
        }
        .alert-success {
            background-color: #d1fae5; /* Light green */
            border-left: 4px solid #34d399; /* Green border */
            color: #065f46; /* Dark green text */
            padding: 1rem;
            border-radius: 0.5rem;
        }
        .alert-danger {
            background-color: #fee2e2; /* Light red */
            border-left: 4px solid #ef4444; /* Red border */
            color: #991b1b; /* Dark red text */
            padding: 1rem;
            border-radius: 0.5rem;
        }
        .section-box {
            background-color: #f8fafc; /* Lighter gray for section boxes */
            border-radius: 0.5rem;
            padding: 1rem;
            border: 1px solid #e2e8f0;
        }
</style>