export const useAdminStats = () => {
  const config = useRuntimeConfig()
  const token = useCookie('token').value || ''

  const { data, error, refresh } = useFetch(
    () => `${config.public.API_URL}/admin/stats`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )

  return { data, error, refresh }
}
