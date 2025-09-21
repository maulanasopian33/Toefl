// utils/profilePic.ts

/**
 * Generate profile picture URL berdasarkan nama
 * @param name string nama user
 * @returns string URL image
 */
export function generateProfilePic(name: string): string {
  // Ambil inisial dari nama
  const initials = name
    .split(" ")
    .map((n) => n[0]?.toUpperCase())
    .join("")
    .slice(0, 2); // maksimal 2 huruf

  // Generate warna random (background)
  const letters = "0123456789ABCDEF";
  let bgColor = "";
  for (let i = 0; i < 6; i++) {
    bgColor += letters[Math.floor(Math.random() * 16)];
  }

  // Tentukan warna teks (biar kontras, pakai hitam/putih)
  const r = parseInt(bgColor.substring(0, 2), 16);
  const g = parseInt(bgColor.substring(2, 4), 16);
  const b = parseInt(bgColor.substring(4, 6), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  const textColor = brightness > 128 ? "000000" : "FFFFFF";

  return `https://placehold.co/48x48/${bgColor}/${textColor}?text=${initials}`;
}
