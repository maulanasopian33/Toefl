<template>
  <div class="">
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

    <!-- Login Form -->
    <LoginEmailPassword/>
  </div>
</template>

<script setup>
  const { setTitle, setDescription, NavLogin, NavRegister } = useLayoutStore();
  definePageMeta({
    layout: 'auth'
  })
  setTitle('Masuk Ke');
  setDescription('ToaflArabi adalah platform pembelajaran bahasa Arab yang interaktif dan mudah digunakan.');
  NavLogin(false);
  NavRegister(true);
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