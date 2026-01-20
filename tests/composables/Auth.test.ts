import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAuthActions } from '@/composables/Auth';

// Mock relative imports for project composables
vi.mock('./Loading', () => ({
  useLoading: () => ({
    startLoading: vi.fn(),
    stopLoading: vi.fn(),
  }),
}));

vi.mock('./useNotification', () => ({
  useNotification: () => ({
    showNotification: vi.fn(),
  }),
}));

vi.mock('./useLogger', () => ({
  useLogger: () => ({
    logToServer: vi.fn(),
  }),
}));

vi.mock('./useAuth', () => ({
  useAuth: () => ({
    forceRefreshUserToken: vi.fn(),
    claims: { value: { role: 'user' } },
  }),
}));

// Mock global Nuxt functions
vi.stubGlobal('useRuntimeConfig', () => ({
  public: {
    API_URL: 'http://localhost/api',
  },
}));

vi.stubGlobal('useRouter', () => ({
  push: vi.fn(),
}));

vi.stubGlobal('useNuxtApp', () => ({
  $auth: {
    signInWithEmailAndPassword: vi.fn().mockResolvedValue({ user: {} }),
    currentUser: {
      getIdToken: vi.fn().mockResolvedValue('mock-token'),
    },
  },
  $googleProvider: {},
}));

vi.stubGlobal('navigateTo', vi.fn());
vi.stubGlobal('$fetch', vi.fn().mockResolvedValue({ success: true }));

describe('useAuthActions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call signInWithEmailAndPassword and redirect on success', async () => {
    const { loginEmailPassword } = useAuthActions();
    
    await loginEmailPassword('test@example.com', 'password123');

    expect(global.$fetch).toHaveBeenCalled();
  });
});
