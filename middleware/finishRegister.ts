import { useUserDetailsGet } from "@/composables/UserDetails/get";

export default defineNuxtRouteMiddleware(async (to, from) => {
    const { data, pending, error } = await useUserDetailsGet();
    if (data?.value && !data.value.status) {
        // Pendaftaran belum selesai
        return navigateTo('/auth/personality');
    }
})
