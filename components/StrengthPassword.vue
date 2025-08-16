<template>
  <Transition
    enter-active-class="transition ease-out duration-200"
    enter-from-class="transform opacity-0 scale-95"
    enter-to-class="transform opacity-100 scale-100"
    leave-active-class="transition ease-in duration-75"
    leave-from-class="transform opacity-100 scale-100"
    leave-to-class="transform opacity-0 scale-95"
  >
    <div
      v-if="showpanel && password.length > 0"
      class="absolute z-10 mt-2 w-fit p-4 bg-white rounded-md shadow-lg border border-gray-200"
    >
      <p class="font-semibold text-gray-600 mb-2">Kekuatan Kata Sandi:</p>
      <ul class="space-y-1">
        <li
          :class="passwordChecks.length ? 'text-green-500' : 'text-red-500'"
          class="flex items-center"
        >
          <svg
            class="h-5 w-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              :d="passwordChecks.length ? 'M5 13l4 4L19 7' : 'M6 18L18 6M6 6l12 12'"
            ></path>
          </svg>
          <span>Minimal 8 karakter</span>
        </li>
        <li
          :class="passwordChecks.uppercase ? 'text-green-500' : 'text-red-500'"
          class="flex items-center"
        >
          <svg
            class="h-5 w-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              :d="passwordChecks.uppercase ? 'M5 13l4 4L19 7' : 'M6 18L18 6M6 6l12 12'"
            ></path>
          </svg>
          <span>Termasuk huruf besar (A-Z)</span>
        </li>
        <li
          :class="passwordChecks.lowercase ? 'text-green-500' : 'text-red-500'"
          class="flex items-center"
        >
          <svg
            class="h-5 w-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              :d="passwordChecks.lowercase ? 'M5 13l4 4L19 7' : 'M6 18L18 6M6 6l12 12'"
            ></path>
          </svg>
          <span>Termasuk huruf kecil (a-z)</span>
        </li>
        <li
          :class="passwordChecks.number ? 'text-green-500' : 'text-red-500'"
          class="flex items-center"
        >
          <svg
            class="h-5 w-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              :d="passwordChecks.number ? 'M5 13l4 4L19 7' : 'M6 18L18 6M6 6l12 12'"
            ></path>
          </svg>
          <span>Termasuk angka (0-9)</span>
        </li>
      </ul>
    </div>
  </Transition>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  password: {
    type: String,
    default: '',
  },
  showPasswordStrength: {
    type: Boolean,
    default: false,
  },
});

const emits = defineEmits(['PassedPassword']);
let showpanel = ref(false);

const passwordChecks = ref({
  length: false,
  uppercase: false,
  lowercase: false,
  number: false,
});

watch(
  () => props.password,
  (newVal) => {
    passwordChecks.value.length = newVal.length >= 8;
    passwordChecks.value.uppercase = /[A-Z]/.test(newVal);
    passwordChecks.value.lowercase = /[a-z]/.test(newVal);
    passwordChecks.value.number = /[0-9]/.test(newVal);
    // Periksa semua kondisi dan emit hasilnya
    const isPasswordValid = Object.values(passwordChecks.value).every(Boolean);
    emits('PassedPassword', isPasswordValid);
  },
  { immediate: true }
);

watch(
  () => props.showPasswordStrength,
  (newVal) => {
    showpanel.value = newVal;
  },
  { immediate: true }
);
</script>