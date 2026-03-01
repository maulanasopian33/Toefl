import { useFirebaseToken } from '../FirebaseToken';
import { useLogger } from '../useLogger';

export const useBatchParticipantDelete = async (participantId: string) => {
  const authToken = await useFirebaseToken();
  const config = useRuntimeConfig();

  if (!authToken) {
    return {
      data: ref(null),
      pending: ref(false),
      error: ref(new Error('User not authenticated.')),
      refresh: () => {},
    };
  }

  const { data, pending, error, refresh } = await useFetch(`${config.public.API_URL}/batch-participant/${participantId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${authToken}`,
      'Content-Type': 'application/json',
    }
  });

  const { logToServer } = useLogger();
  watch(error, (newErr) => {
    if (newErr) {
      logToServer({
        level: 'error',
        message: 'Failed to delete batch participant',
        metadata: { participantId, error: newErr.message }
      });
    }
  });

  return {
    data,
    pending,
    error,
    refresh,
  };
}
