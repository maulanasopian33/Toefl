import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useLogger } from "./useLogger";

export const useFirebaseToken = async (): Promise<string | null> => {
  const auth = getAuth();
  const { logToServer } = useLogger();

  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      unsubscribe(); // stop listener setelah dapat state

      if (user) {
        try {
          const token = await user.getIdToken();
          resolve(token);
        } catch (e: any) {
          logToServer({
            level: 'error',
            message: 'Failed to get Firebase ID token',
            metadata: { error: e.message }
          });
          resolve(null);
        }
      } else {
        resolve(null);
      }
    }, (error) => {
      logToServer({
        level: 'error',
        message: 'Firebase onAuthStateChanged error',
        metadata: { error: error.message }
      });
      resolve(null);
    });
  });
};
