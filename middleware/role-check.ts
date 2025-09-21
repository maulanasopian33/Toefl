// middleware/role-check.ts

export default defineNuxtRouteMiddleware(async (to, from) => {
  // Access the requiredRole property directly from the meta object
  const requiredRole = to.meta.requiredRole as string;

  // If there's no required role, let the user proceed
  if (!requiredRole) {
    return;
  }

  // Fetch the user data
  const { data, error } = await useUserMe();

  // Handle a failed data fetch
  if (error.value) {
    console.error('Failed to fetch user data:', error.value);
    return navigateTo('/auth/login');
  }

  // Check if the user's role matches the required role
  if (data.value?.role !== requiredRole) {
    return navigateTo('/forbidden');
  }

  // If all checks pass, allow navigation
  return;
});