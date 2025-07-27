<template>
  <div>
    <main class="flex-grow container mx-auto p-4 md:p-6 lg:p-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">

            <!-- Bagian Utama Dashboard -->
            <div class="md:col-span-2 bg-white p-6 rounded-xl shadow-lg">
                <HeroSection/>

                <notifPembayaran/>
                <notifSertifikat/>

                <!-- Riwayat Tes Terakhir -->
                <div class="bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <h3 class="text-2xl font-semibold text-gray-800 mb-4">Riwayat Tes Terakhir</h3>
                    <div id="lastTestDetails">
                        <p class="text-gray-600">Belum ada tes yang diselesaikan.</p>
                    </div>
                    <button id="viewAllHistoryButton" class="mt-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg shadow-sm transition duration-300 ease-in-out">
                        Lihat Semua Riwayat Tes
                    </button>
                </div>
            </div>

            <!-- Sidebar dengan Link Cepat -->
            <div class="md:col-span-1 bg-white p-6 rounded-xl shadow-lg h-fit sticky top-4">
                <h2 class="text-2xl font-semibold mb-6 text-gray-800">Menu Cepat</h2>
                <nav>
                    <ul class="space-y-3">
                        <li>
                            <a href="#" class="flex items-center p-3 rounded-lg text-gray-700 hover:bg-green-100 hover:text-green-700 transition duration-200 ease-in-out font-medium">
                                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
                                Materi Belajar
                            </a>
                        </li>
                        <li>
                            <a href="#" class="flex items-center p-3 rounded-lg text-gray-700 hover:bg-green-100 hover:text-green-700 transition duration-200 ease-in-out font-medium">
                                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13m-6 0V9l6-3v7m-6 10v-3a2 2 0 012-2h3a2 2 0 012 2v3m-6 0h6"></path></svg>
                                Latihan Soal
                            </a>
                        </li>
                        <li>
                            <a href="#" class="flex items-center p-3 rounded-lg text-gray-700 hover:bg-green-100 hover:text-green-700 transition duration-200 ease-in-out font-medium">
                                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H2v-2a3 3 0 015.356-1.857M17 20v-2c0-.653-.198-1.274-.567-1.802M5.356 18H9m1.857-3.356C11.356 14.274 11 13.653 11 13v-2c0-.653.198-1.274.567-1.802M9 10a2 2 0 11-4 0 2 2 0 014 0zm-2 2a2 2 0 100-4 2 2 0 000 4zm10-2a2 2 0 11-4 0 2 2 0 014 0zm-2 2a2 2 0 100-4 2 2 0 000 4z"></path></svg>
                                Riwayat Skor
                            </a>
                        </li>
                        <li>
                            <a href="#" class="flex items-center p-3 rounded-lg text-gray-700 hover:bg-green-100 hover:text-green-700 transition duration-200 ease-in-out font-medium">
                                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                Bantuan & FAQ
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    </main>
  </div>
</template>

<script lang="ts" setup>
import notifPembayaran from '@/components/DashboardUser/notifPembayaran.vue';
import HeroSection from '@/components/DashboardUser/heroSection.vue';
import notifSertifikat from '@/components/DashboardUser/notifSertifikat.vue';
</script>

<style>

</style>