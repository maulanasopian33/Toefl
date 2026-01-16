import { type Ref } from 'vue';
import { useFirebaseToken } from './FirebaseToken';
import { useLogger } from './useLogger';

export interface UserDetail {
  uid: string;
  namaLengkap: string;
  nim: string;
  fakultas: string;
  prodi: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserData {
  uid: string;
  email: string;
  name: string;
  email_verified: boolean;
  picture: string;
  lastLogin: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  detailuser: UserDetail;
}

interface UserMeResult {
  data: Ref<UserData | null>;
  pending: Ref<boolean>;
  error: Ref<Error | null>;
  refresh: () => void;
}

export const useUserMe = async (): Promise<UserMeResult> => {
  const authToken = await useFirebaseToken();
  const config = useRuntimeConfig();

  if (!authToken) {
    return {
      data: ref<UserData | null>(null),
      pending: ref(false),
      error: ref(new Error('User not authenticated.')),
      refresh: () => {},
    };
  }

  const { data, pending, error, refresh } = await useFetch<{ status: boolean; message: string; data: UserData }>(
    `${config.public.API_URL}/users/me`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
    }
  );

  const dataValue = computed(() => (data.value ? data.value.data : null));

  const { logToServer } = useLogger();
  watch(error, (newErr) => {
    if (newErr) {
      logToServer({
        level: 'error',
        message: 'Failed to fetch /users/me',
        metadata: { error: newErr.message }
      });
    }
  });

  return {
    data: dataValue as Ref<UserData | null>,
    pending: pending as Ref<boolean>,
    error: error as Ref<Error | null>,
    refresh,
  };
};
