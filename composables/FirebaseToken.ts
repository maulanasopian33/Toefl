import { getAuth, onAuthStateChanged } from "firebase/auth";

export const useFirebaseToken = async (): Promise<string | null> => {
  const auth = getAuth();

  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      unsubscribe(); // stop listener setelah dapat state

      if (user) {
        const token = await user.getIdToken();
        resolve(token);
      } else {
        resolve(null);
      }
    });
  });
};
