<template>
  <HeaderPrimary/>
  <div class="w-full mx-auto">
    <!-- Main Content - Login Form Container -->
    <main class="flex-grow flex items-center justify-center p-4">
        <div class="bg-white rounded-xl shadow-2xl flex flex-col lg:flex-row max-w-4xl w-full overflow-hidden">
            <!-- Left Section (Illustration and Intro Text) -->
            <div class="left-section-bg p-8 flex-1 flex flex-col justify-between items-start text-white lg:w-1/2 rounded-l-xl">
                <div class="mb-8">
                    <h2 class="text-3xl font-bold mb-2 rounded-md">{{ state.title }}</h2>
                    <p class="text-lg opacity-90 rounded-md">{{ state.description }}</p>
                </div>
                <div class="w-full h-48 illustration-placeholder rounded-lg mb-8">
                    <!-- Placeholder for illustration -->
                </div>
                <!-- Login as section -->
                <div v-if="state.loginAs">
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
            <div class="p-8 flex-1 lg:w-1/2 flex flex-col">
                <div class="flex justify-end text-sm mb-4" v-if="state.navlogin || state.navregister">
                    <span class="text-gray-600 rounded-md" v-if="!state.navlogin">Belum punya akun?</span>
                    <span class="text-gray-600 rounded-md" v-if="!state.navregister">sudah punya akun?</span>
                    <nuxt-link to="/auth/register" class="text-green-600 font-semibold ml-1 hover:underline rounded-md" v-if="!state.navlogin">Daftar</nuxt-link>
                    <nuxt-link to="/auth/login" class="text-green-600 font-semibold ml-1 hover:underline rounded-md" v-if="!state.navregister">login</nuxt-link>
                </div>
                <NuxtPage/>
            </div>
        </div>
    </main>
  </div>
</template>

<script lang="ts" setup>
const { state } = useLayoutStore();
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