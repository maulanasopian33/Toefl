<script setup lang="ts">
import ToaflEditor from '@/components/ToaflEditor/ToaflEditor.vue';
import NotificationPopup from '@/components/NotificationPopup.vue';
definePageMeta({
  title: 'Editor Soal - Admin Panel',
  layout: false,
  middleware: ['auth', 'role-check'],
  permission: "batch.update",
})
</script>

<template>
  <div class="min-h-screen">
    <ToaflEditor />
    <NotificationPopup />
  </div>
</template>
