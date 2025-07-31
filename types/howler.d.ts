// types/howler.d.ts
import type { Howl, Howler } from 'howler';

declare module '#app' {
  interface NuxtApp {
    $howl: typeof Howl;
    $howler: typeof Howler;
  }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $howl: typeof Howl;
    $howler: typeof Howler;
  }
}