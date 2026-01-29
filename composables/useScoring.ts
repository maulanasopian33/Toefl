import { ref } from 'vue';
import { useFirebaseToken } from './FirebaseToken';
import { useLogger } from './useLogger';

export interface ScoringDetail {
  id?: number;
  scoring_table_id?: number;
  section_category: string;
  correct_count: number;
  converted_score: number;
}

export interface ScoringTable {
  id?: number;
  name: string;
  description?: string;
  details?: ScoringDetail[];
  createdAt?: string;
  updatedAt?: string;
}

export const useScoring = () => {
  const config = useRuntimeConfig();
  const { logToServer } = useLogger();
  
  const tables = ref<ScoringTable[]>([]);
  const sections = ref<{ idSection: string, namaSection: string }[]>([]);
  const isLoading = ref(false);
  const error = ref<Error | null>(null);

  const fetchTables = async () => {
    isLoading.value = true;
    error.value = null;
    try {
      const token = await useFirebaseToken();
      const response = await $fetch<{ status: boolean, data: ScoringTable[] }>(`${config.public.API_URL}/scoring`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      tables.value = response.data;
    } catch (e: any) {
      error.value = e;
      logToServer({
        level: 'error',
        message: 'Failed to fetch scoring tables',
        metadata: { error: e.message }
      });
    } finally {
      isLoading.value = false;
    }
  };

  const getTable = async (id: number | string) => {
    try {
      const token = await useFirebaseToken();
      const response = await $fetch<{ status: boolean, data: ScoringTable }>(`${config.public.API_URL}/scoring/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (e: any) {
      logToServer({
        level: 'error',
        message: `Failed to fetch scoring table ${id}`,
        metadata: { error: e.message }
      });
      throw e;
    }
  };

  const createTable = async (data: ScoringTable) => {
    try {
      const token = await useFirebaseToken();
      const response = await $fetch<{ status: boolean, data: ScoringTable }>(`${config.public.API_URL}/scoring`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: data
      });
      return response.data;
    } catch (e: any) {
      logToServer({
        level: 'error',
        message: 'Failed to create scoring table',
        metadata: { error: e.message, data }
      });
      throw e;
    }
  };

  const updateTable = async (id: number | string, data: ScoringTable) => {
    try {
      const token = await useFirebaseToken();
      const response = await $fetch<{ status: boolean, data: ScoringTable }>(`${config.public.API_URL}/scoring/${id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: data
      });
      return response.data;
    } catch (e: any) {
      logToServer({
        level: 'error',
        message: `Failed to update scoring table ${id}`,
        metadata: { error: e.message, data }
      });
      throw e;
    }
  };

  const deleteTable = async (id: number | string) => {
    try {
      const token = await useFirebaseToken();
      await $fetch(`${config.public.API_URL}/scoring/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (e: any) {
      logToServer({
        level: 'error',
        message: `Failed to delete scoring table ${id}`,
        metadata: { error: e.message }
      });
      throw e;
    }
  };

  const fetchSections = async () => {
    try {
      const token = await useFirebaseToken();
      const response = await $fetch<{ idSection: string, namaSection: string }[] | { status: boolean, data: any[] }>(`${config.public.API_URL}/sections`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Handle potential different response structures
      if (Array.isArray(response)) {
        sections.value = response;
      } else if (response && typeof response === 'object' && 'data' in response) {
        sections.value = response.data;
      }
    } catch (e: any) {
      logToServer({
        level: 'error',
        message: 'Failed to fetch sections for scoring',
        metadata: { error: e.message }
      });
    }
  };

  return {
    tables,
    sections,
    isLoading,
    error,
    fetchTables,
    fetchSections,
    getTable,
    createTable,
    updateTable,
    deleteTable
  };
};
