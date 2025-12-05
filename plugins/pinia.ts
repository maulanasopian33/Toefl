import { defineNuxtPlugin } from '#app'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

export default defineNuxtPlugin((nuxtApp) => {
  // The @pinia/nuxt module creates the pinia instance.
  // We can access it and add plugins to it.
  nuxtApp.$pinia.use(piniaPluginPersistedstate)
})