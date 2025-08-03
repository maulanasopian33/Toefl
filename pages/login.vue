<template>
  <div class="login-container">
    <!-- Main Content - Login Form Container -->
    <main class="flex-grow flex items-center justify-center p-4">
        <div class="bg-white rounded-xl shadow-2xl flex flex-col lg:flex-row max-w-4xl w-full overflow-hidden">
            <!-- Left Section (Illustration and Intro Text) -->
            <div class="left-section-bg p-8 flex-1 flex flex-col justify-between items-start text-white lg:w-1/2 rounded-l-xl">
                <div class="mb-8">
                    <h2 class="text-3xl font-bold mb-2 rounded-md">Masuk ke</h2>
                    <p class="text-lg opacity-90 rounded-md">ToaflArabi adalah platform pembelajaran bahasa Arab yang interaktif dan mudah digunakan.</p>
                </div>
                <div class="w-full h-48 illustration-placeholder rounded-lg mb-8">
                    <!-- Placeholder for illustration -->
                </div>
                <!-- Login as section -->
                <div>
                    <h3 class="text-xl font-semibold mb-4 rounded-md">Masuk sebagai</h3>
                    <div class="flex flex-wrap gap-4">
                        <!-- User 1 -->
                        <div class="flex items-center bg-white bg-opacity-20 p-3 rounded-full pr-6 cursor-pointer hover:bg-opacity-30 transition duration-200">
                            <img src="https://placehold.co/40x40/cccccc/ffffff?text=JP" alt="John Peter" class="w-10 h-10 rounded-full mr-3">
                            <div>
                                <p class="font-semibold text-sm rounded-md">John Peter</p>
                                <p class="text-xs opacity-80 rounded-md">Aktif 1 hari lalu</p>
                            </div>
                        </div>
                        <!-- User 2 -->
                        <div class="flex items-center bg-white bg-opacity-20 p-3 rounded-full pr-6 cursor-pointer hover:bg-opacity-30 transition duration-200">
                            <img src="https://placehold.co/40x40/cccccc/ffffff?text=AA" alt="Alina Ahmen" class="w-10 h-10 rounded-full mr-3">
                            <div>
                                <p class="font-semibold text-sm rounded-md">Alina Ahmen</p>
                                <p class="text-xs opacity-80 rounded-md">Aktif 4 hari lalu</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Right Section (Login Form) -->
            <div class="p-8 flex-1 lg:w-1/2 flex flex-col justify-center">
                <div class="flex justify-end text-sm mb-4">
                    <span class="text-gray-600 rounded-md">Belum punya akun?</span>
                    <a href="#" class="text-green-600 font-semibold ml-1 hover:underline rounded-md">Daftar</a>
                </div>
                <h2 class="text-3xl font-bold text-gray-800 mb-6 rounded-md">Masuk</h2>

                <!-- Social Login Buttons -->
                <div class="flex space-x-4 mb-6">
                    <LoginGoogleMethod/>
                    <button class="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg flex items-center justify-center border border-gray-300 hover:bg-gray-200 transition duration-300">
                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path fill-rule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.505 1.492-3.89 3.776-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33V22C18.343 21.128 22 16.991 22 12z" clip-rule="evenodd" />
                        </svg>
                    </button>
                    <button class="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg flex items-center justify-center border border-gray-300 hover:bg-gray-200 transition duration-300">
                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.83 17.29a.996.996 0 01-1.414 0L12 13.414l-4.414 4.414a.996.996 0 01-1.414-1.414L10.586 12 6.172 7.586a.996.996 0 011.414-1.414L12 10.586l4.414-4.414a.996.996 0 011.414 1.414L13.414 12l4.414 4.414a.996.996 0 010 1.414z"/>
                        </svg>
                    </button>
                </div>

                <!-- Separator -->
                <div class="relative flex py-5 items-center">
                    <div class="flex-grow border-t border-gray-300"></div>
                    <span class="flex-shrink mx-4 text-gray-500 rounded-md">Atau</span>
                    <div class="flex-grow border-t border-gray-300"></div>
                </div>

                <!-- Login Form Fields -->
                <div class="mb-4">
                    <label for="username" class="block text-gray-700 text-sm font-bold mb-2 rounded-md">Masukkan nama pengguna atau alamat email Anda</label>
                    <input type="text" id="username" class="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" placeholder="Nama pengguna atau email">
                </div>
                <div class="mb-6">
                    <label for="password" class="block text-gray-700 text-sm font-bold mb-2 rounded-md">Masukkan Kata Sandi Anda</label>
                    <input type="password" id="password" class="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" placeholder="Kata sandi">
                    <a href="#" class="inline-block align-baseline font-bold text-sm text-green-600 hover:text-green-800 rounded-md">Lupa Kata Sandi?</a>
                </div>

                <!-- Sign In Button -->
                <button class="bg-green-600 text-white font-bold py-3 px-4 rounded-lg w-full hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-300">
                    Masuk
                </button>
            </div>
        </div>
    </main>
  </div>
</template>

<script setup>

</script>

<style scoped>
/* Set Inter font as default */
        body {
            font-family: 'Inter', sans-serif;
        }
        /* Custom background for the main login section */
        .login-bg {
            background-color: #f0f2f5; /* Light gray background for the overall page */
        }
        /* Custom background for the left section of the login card */
        .left-section-bg {
            background: linear-gradient(135deg, #10B981 0%, #059669 100%); /* Green gradient */
            position: relative;
            overflow: hidden;
        }
        /* Style for the illustration placeholder */
        .illustration-placeholder {
            background-image: url('https://placehold.co/400x300/10B981/ffffff?text=Ilustrasi'); /* Placeholder image for illustration */
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
        }
</style>