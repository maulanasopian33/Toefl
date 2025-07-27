<template>
  <div>
    <!-- Section Navigation Bar -->
        <nav id="sectionNavBar" class="bg-primary flex justify-center space-x-4 md:space-x-8 pt-4">
          <button @click="goToSection(index)" v-for="(item, index) in sections" :class="currentSectionIndex === index ? 'active-section' : ''" class="section-nav-button text-white text-lg font-medium px-4 py-2 rounded-t-lg hover:bg-accent focus:outline-none focus:ring-2 focus:ring-accent">{{item.name}}</button>
        </nav>
    <!-- Konten Utama Aplikasi -->
    <main class="flex-grow container mx-auto p-4 md:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-4 gap-6">

        <!-- Sidebar / Ringkasan Tes (Dapat dilipat) -->
        <aside id="sidebar" class="lg:col-span-1 bg-white p-6 rounded-xl shadow-lg h-fit sticky top-4 sidebar-transition">
            <div id="sidebarContent">
                <h2 class="text-2xl font-semibold mb-6 text-gray-800">Ringkasan Tes</h2>
                <div class="flex items-center justify-between mb-3">
                    <span class="text-gray-600">Waktu Tersisa:</span>
                    <span id="timer" class="text-blue-600 font-bold text-lg">00:00</span>
                </div>
                <div class="flex items-center justify-between">
                    <span class="text-gray-600">Progress:</span>
                    <span id="progressText" class="text-blue-600 font-bold text-lg">0/0</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                    <div id="progressBar" class="bg-blue-600 h-2.5 rounded-full" style="width: 0%;"></div>
                </div>

                <div class="mt-8 pt-6 border-t border-gray-200">
                    <h3 class="text-xl font-semibold mb-4 text-gray-800">Navigasi Pertanyaan</h3>
                    <div id="questionNavigationGrid" class="grid grid-cols-5 gap-2">
                        <!-- Tombol nomor pertanyaan akan di-render di sini oleh JS -->
                    </div>
                </div>
            </div>
        </aside>

        <!-- Area Konten Utama -->
        <section id="mainContentArea" class="lg:col-span-3 bg-white p-6 rounded-xl shadow-lg sidebar-transition">
            <!-- Section Introduction/Break Screen -->
            <div id="sectionIntroScreen" class="text-center py-10">
                <h2 id="introSectionTitle" class="text-3xl font-bold text-gray-800 mb-4">{{ introSectionTitle }}</h2>
                <p class="text-lg text-gray-700 mb-6 max-w-2xl mx-auto">{{ introInstructions }}</p>
                <div id="introAudioPlayerContainer" v-show="audioInstructions !== ''" class="bg-gray-100 p-4 rounded-lg mb-6 shadow-sm mx-auto max-w-md">
                    <audio id="introAudioPlayer" controls class="w-full">
                        <source :src="audioInstructions" type="audio/mpeg">
                        Browser Anda tidak mendukung elemen audio.
                    </audio>
                    <p class="text-sm text-gray-500 mt-2 text-center">Dengarkan audio instruksi di atas.</p>
                </div>
                <button id="startSectionButton" class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition duration-300 ease-in-out">
                    Mulai Bagian Ini
                </button>
            </div>

            <!-- Question View -->
            <div id="questionView" class="hidden">
                <h2 id="questionSectionTitle" class="text-2xl font-semibold mb-6 text-gray-800"></h2>

                <!-- Konten Pertanyaan -->
                <div class="mb-8">
                    <p id="instructionText" class="text-gray-700 text-lg leading-relaxed mb-4"></p>

                    <!-- Audio Player (Added for Listening Section) -->
                    <div id="audioPlayerContainer" class="bg-gray-100 p-4 rounded-lg mb-6 shadow-sm hidden">
                        <audio id="audioPlayer" controls class="w-full">
                            <source src="" type="audio/mpeg">
                            Browser Anda tidak mendukung elemen audio.
                        </audio>
                        <p class="text-sm text-gray-500 mt-2 text-center">Dengarkan audio di atas.</p>
                    </div>

                    <div id="passageArea" class="bg-gray-50 p-4 rounded-lg border border-gray-200 text-gray-800 mb-6 max-h-80 overflow-y-auto hidden">
                        <p id="passageText" class="text-sm md:text-base leading-relaxed"></p>
                    </div>

                    <p id="questionText" class="text-gray-900 text-xl font-medium mb-4"></p>

                    <!-- Pilihan Jawaban -->
                    <div id="answerOptions" class="space-y-4">
                        <!-- Pilihan jawaban akan di-render di sini oleh JS -->
                    </div>
                </div>

                <!-- Tombol Navigasi -->
                <div class="flex justify-between mt-8 pt-6 border-t border-gray-200">
                    <button id="prevButton" class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out flex items-center" disabled>
                        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
                        Sebelumnya
                    </button>
                    <button id="nextButton" class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out flex items-center">
                        Selanjutnya
                        <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                    </button>
                </div>
            </div>

            <!-- Test Finished Message -->
            <div id="testFinishedMessage" class="hidden mt-8 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg text-center font-semibold text-lg">
                Tes telah selesai! Silakan klik tombol "Lihat Hasil" untuk melihat skor Anda.
                <button id="viewResultsButton" class="mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out">
                    Lihat Hasil
                </button>
            </div>

            <!-- Test Results Area -->
            <div id="testResultsArea" class="hidden mt-8 p-6 bg-blue-50 rounded-xl border border-blue-200">
                <h3 class="text-2xl font-bold text-blue-800 mb-4">Hasil Tes Anda</h3>
                <p class="text-lg text-gray-700 mb-2">Total Pertanyaan: <span id="totalQuestionsResult" class="font-semibold"></span></p>
                <p class="text-lg text-gray-700 mb-2">Jawaban Benar: <span id="correctAnswersResult" class="font-semibold text-green-600"></span></p>
                <p class="text-lg text-gray-700 mb-2">Jawaban Salah: <span id="wrongAnswersResult" class="font-semibold text-red-600"></span></p>
                <p class="text-2xl font-bold text-blue-700 mt-4">Skor Anda: <span id="scoreResult" class="text-green-800"></span></p>
            </div>

            <!-- Admin View -->
            <div id="adminView" class="hidden p-6 rounded-xl shadow-lg bg-white">
                <h2 class="text-2xl font-semibold mb-6 text-gray-800">Panel Admin: Tambah & Kelola Pertanyaan</h2>

                <div class="mb-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
                    <h3 class="text-xl font-bold text-blue-800 mb-4">Tambah Pertanyaan Baru</h3>
                    <form id="addQuestionForm" class="space-y-4">
                        <div>
                            <label for="questionType" class="block text-sm font-medium text-gray-700">Tipe Bagian:</label>
                            <select id="questionType" name="type" class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                                <option value="Reading">Reading</option>
                                <option value="Listening">Listening</option>
                                <option value="Writing">Writing</option>
                                <option value="Speaking">Speaking</option>
                            </select>
                        </div>
                        <div>
                            <label for="questionPassage" class="block text-sm font-medium text-gray-700">Teks Bacaan/Instruksi (Opsional):</label>
                            <textarea id="questionPassage" name="passage" rows="4" class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" placeholder="Masukkan teks bacaan atau instruksi audio di sini..."></textarea>
                        </div>
                        <div>
                            <label for="questionAudioSrc" class="block text-sm font-medium text-gray-700">URL Audio (untuk Listening, Opsional):</label>
                            <input type="text" id="questionAudioSrc" name="audioSrc" class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" placeholder="Contoh: https://www.example.com/audio.mp3">
                        </div>
                        <div>
                            <label for="questionText" class="block text-sm font-medium text-gray-700">Teks Pertanyaan:</label>
                            <textarea id="questionTextForm" name="question" rows="3" class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" required placeholder="Masukkan teks pertanyaan di sini..."></textarea>
                        </div>
                        <div id="optionsContainer">
                            <label class="block text-sm font-medium text-gray-700">Pilihan Jawaban (Pisahkan dengan baris baru untuk setiap pilihan):</label>
                            <textarea id="questionOptionsForm" name="options" rows="4" class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" placeholder="Pilihan A\nPilihan B\nPilihan C"></textarea>
                        </div>
                        <div>
                            <label for="correctAnswer" class="block text-sm font-medium text-gray-700">Jawaban Benar (Cocokkan persis dengan salah satu pilihan atau kosongkan untuk Writing/Speaking):</label>
                            <input type="text" id="correctAnswerForm" name="correctAnswer" class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" placeholder="Jawaban yang benar">
                        </div>
                        <button type="submit" class="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out">
                            Tambah Pertanyaan
                        </button>
                    </form>
                </div>

                <div class="p-6 bg-gray-50 rounded-lg border border-gray-200">
                    <h3 class="text-xl font-bold text-gray-800 mb-4">Daftar Pertanyaan yang Ada</h3>
                    <div id="existingQuestionsList" class="space-y-4">
                        <!-- Existing questions will be rendered here -->
                        <p class="text-gray-600 text-center" id="noQuestionsMessage">Belum ada pertanyaan ditambahkan.</p>
                    </div>
                </div>
                <button id="backToTestButton" class="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out">
                    Kembali ke Tes
                </button>
            </div>
        </section>
    </main>
  </div>
</template>

<script lang="ts" setup>
let pos = ref(0);
let currentSectionIndex = ref(0);
let introSectionTitle = ref('');
let introInstructions = ref('');
let audioInstructions = ref('');
// Definisi bagian-bagian tes
const sections = [
    { id: "reading", name: "Reading", type: "Reading", instructions: "Bagian Reading akan menguji kemampuan Anda memahami teks akademik. Bacalah setiap teks dengan cermat dan jawab pertanyaan berdasarkan informasi yang diberikan.", questions: [] },
    { id: "listening", name: "Listening", type: "Listening", instructions: "Bagian Listening akan menguji kemampuan Anda memahami percakapan dan kuliah dalam bahasa Inggris. Dengarkan setiap rekaman audio dengan seksama dan jawab pertanyaan berdasarkan apa yang Anda dengar.", questions: [], audioInstructions: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" }, // Audio for section instructions
    { id: "writing", name: "Writing", type: "Writing", instructions: "Bagian Writing akan menguji kemampuan Anda untuk menulis esai yang terstruktur dan koheren. Baca prompt dengan cermat dan tulis esai Anda di kolom yang tersedia.", questions: [] },
    { id: "speaking", name: "Speaking", type: "Speaking", instructions: "Bagian Speaking akan menguji kemampuan Anda berbicara bahasa Inggris secara efektif. Baca prompt dan berikan respons Anda. Ini adalah simulasi, jadi Anda akan mengetikkan jawaban Anda.", questions: [] }
];

const renderSectionIntro = () => {
    const currentSection = sections[currentSectionIndex.value];
    introSectionTitle.value = `Mulai Bagian: ${currentSection.name}`;
    introInstructions.value = currentSection.instructions;
    audioInstructions.value = currentSection.audioInstructions || '';
    // Penting: Saat audioInstructions berubah, elemen audio mungkin perlu di-load ulang
    // Pastikan DOM diperbarui sebelum mencoba memutar audio
    nextTick(() => {
        const audioPlayer = document.getElementById('introAudioPlayer') as HTMLAudioElement;
        if (audioPlayer && audioPlayer.src) {
            // Memuat ulang audio jika src berubah
            audioPlayer.load();
            // Tidak otomatis play di sini karena kebijakan browser
        }
    });
}

renderSectionIntro()

// ------------------------- FUNCTIONS -------------------------
const goToSection = (index: number) => {
    currentSectionIndex.value = index;
    renderSectionIntro();
}
</script>

<style scoped>
.section-nav-button {
            transition: all 0.2s ease-in-out;
            border-bottom: 3px solid transparent; /* Default transparent bottom border */
            padding-bottom: 0.75rem; /* pb-3 */
        }
        .section-nav-button.active-section {
            border-color: #ffffff; /* White border for active section */
            font-weight: 700; /* font-bold */
        }
</style>