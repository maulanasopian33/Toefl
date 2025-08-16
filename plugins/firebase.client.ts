// plugins/firebase.client.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

export default defineNuxtPlugin(nuxtApp => {
  const config = useRuntimeConfig(); // Mengambil variabel dari nuxt.config.ts
  const firebaseConfig = {
    apiKey: config.public.firebaseApiKey,
    authDomain: config.public.firebaseAuthDomain,
    projectId: config.public.firebaseProjectId,
    storageBucket: config.public.firebaseStorageBucket,
    messagingSenderId: config.public.firebaseMessagingSenderId,
    appId: config.public.firebaseAppId
  };

  // Inisialisasi Firebase
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const googleProvider = new GoogleAuthProvider();

  return {
    provide: {
      app,
      auth,
      googleProvider
    }
  };
});