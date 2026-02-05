<script setup lang="ts">
import { useAppSettings } from '@/composables/useAppSettings';

const { settings, fetchSettings } = useAppSettings();
const config = useRuntimeConfig();

// Fetch settings on app init if not already loaded
await fetchSettings();

useHead({
  title: () => settings.value?.appName ? `${settings.value.appName} - ${settings.value.tagline || ''}` : 'Loading...',
  link: [
    {
      rel: 'icon',
      type: 'image/x-icon',
      href: () => settings.value?.faviconUrl ? `${config.public.MEDIA_URL}${settings.value.faviconUrl}` : '/favicon.ico'
    }
  ]
})
</script>

<template>
  <div>
    <NuxtLayout>
      <NuxtPage/>
    </NuxtLayout>
    <AppPwaNotification />
  </div>
</template>
