import { ref } from 'vue';
import { batchData } from '@/data/batchDetails';

export function useBatchDetails(batchId: string) {
  // Di masa depan, Anda bisa mengganti ini dengan panggilan API
  // const { data: batch, pending, error } = await useFetch(`/api/batches/${batchId}`);
  const batch = ref(batchData);
  batch.value.id = batchId; // Timpa ID dari data dummy dengan ID dari URL

  return { batch };
}