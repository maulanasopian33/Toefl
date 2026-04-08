export const useDebug = () => {
    const config = useRuntimeConfig();
    const { $auth } = useNuxtApp();

    /**
     * Kirim log debugging ke backend.
     * @param message Pesan log
     * @param context Data tambahan (JSON)
     * @param level Tingkat log (INFO, DEBUG, WARN, ERROR)
     */
    const debugLog = async (message: string, context: any = null, level: 'INFO' | 'DEBUG' | 'WARN' | 'ERROR' = 'DEBUG') => {
        try {
            // Silently log to console as well
            console.log(`[DEBUG] ${level}: ${message}`, context);

            const token = await $auth?.currentUser?.getIdToken();
            if (!token) return;

            await $fetch(`${config.public.API_URL}/debug/store`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: { message, context, level }
            });
        } catch (error) {
            // Kita tidak memunculkan notifikasi error agar tidak mengganggu UI user
            console.warn('[DEBUG_STORE_FAILED]', error);
        }
    };

    return {
        debugLog
    };
};
