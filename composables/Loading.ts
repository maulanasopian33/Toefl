// composables/useLoading.ts
import { ref } from 'vue';

const isLoading = ref(false);

export const useLoading = () => {
  const startLoading = () => {
    isLoading.value = true;
  };

  const stopLoading = () => {
    isLoading.value = false;
  };

  const toggleLoading = () => {
    isLoading.value = !isLoading.value;
  };

  return {
    isLoading,
    startLoading,
    stopLoading,
    toggleLoading,
  };
};