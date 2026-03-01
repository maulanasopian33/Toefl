import { ref } from 'vue';

export interface SystemLogFile {
  filename: string;
  size: number;
  sizeFormatted: string;
  lastModified: string;
  type: 'HTTP Traffic' | 'Application';
}

export const useSystemLogs = () => {
  const config = useRuntimeConfig();
  const baseUrl = `${config.public.API_URL}/logs/system`;

  const logFiles = ref<SystemLogFile[]>([]);
  const logContent = ref<string[]>([]);
  const selectedFile = ref<SystemLogFile | null>(null);
  const isLoadingFiles = ref(false);
  const isLoadingContent = ref(false);
  const error = ref<string | null>(null);
  const lines = ref(200);

  const fetchLogFiles = async () => {
    isLoadingFiles.value = true;
    error.value = null;
    try {
      const token = await useFirebaseToken();
      const response = await $fetch<{ status: boolean; data: SystemLogFile[] }>(baseUrl, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.status) {
        logFiles.value = response.data;
      }
    } catch (e: any) {
      error.value = e?.data?.message || 'Gagal memuat daftar file log.';
    } finally {
      isLoadingFiles.value = false;
    }
  };

  const fetchLogContent = async (file: SystemLogFile) => {
    selectedFile.value = file;
    logContent.value = [];
    isLoadingContent.value = true;
    error.value = null;
    try {
      const token = await useFirebaseToken();
      const response = await $fetch<{ status: boolean; data: { lines: string[]; filename: string } }>(
        `${baseUrl}/${file.filename}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { lines: lines.value }
        }
      );
      if (response.status) {
        logContent.value = response.data.lines;
      }
    } catch (e: any) {
      error.value = e?.data?.message || 'Gagal membaca isi file log.';
    } finally {
      isLoadingContent.value = false;
    }
  };

  const clearSelection = () => {
    selectedFile.value = null;
    logContent.value = [];
  };

  return {
    logFiles,
    logContent,
    selectedFile,
    isLoadingFiles,
    isLoadingContent,
    error,
    lines,
    fetchLogFiles,
    fetchLogContent,
    clearSelection
  };
};
