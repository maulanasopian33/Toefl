import type { UserData } from '@/composables/UserMe';
const config = useRuntimeConfig()
const API_URL = config.public.API_URL 

export function getNamaLengkap(user: UserData | null): string {
  return user?.detailuser?.namaLengkap || user?.name || '';
}

export function getEmail(user: UserData | null): string {
  return user?.email || '';
}

export function isEmailVerified(user: UserData | null): boolean {
  return user?.email_verified || false;
}

export function getPhoto(user: UserData | null): string {
  return  user?.picture  ? API_URL + user?.picture : generateProfilePic(getNamaLengkap(user));
}
