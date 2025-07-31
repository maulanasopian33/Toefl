// plugins/howler.client.ts
// Pastikan nama file diakhiri dengan `.client.ts` agar hanya dijalankan di sisi klien

import { Howl, Howler } from 'howler';

export default defineNuxtPlugin(() => {
  return {
    provide: {
      howl: Howl,
      howler: Howler
    }
  };
});