<script setup lang="ts">
import ExamEditor from '@/components/ExamEditor/ExamEditor.vue';
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
    <ExamEditor />
    <NotificationPopup />
  </div>
</template>
