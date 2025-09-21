// utils/formatDate.ts

/**
 * Format date string dari DB ke format Indonesia
 * @param dateStr string dari DB (YYYY-MM-DD atau YYYY-MM-DD HH:mm:ss)
 * @returns string format Indonesia (contoh: 18 Agustus 2025)
 */
export function formatDateIndo(dateStr: string | Date): string {
  if (!dateStr) return "-";

  const date = new Date(dateStr);

  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
  };

  return date.toLocaleDateString("id-ID", options);
}
