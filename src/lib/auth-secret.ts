/** مفتاح الجلسة — AUTH_SECRET في Vercel، أو اشتقاق ثابت من رابط الموقع */
export function getAuthSecretBytes(): Uint8Array {
  const explicit = process.env.AUTH_SECRET?.trim();
  if (explicit && explicit.length >= 16) {
    return new TextEncoder().encode(explicit);
  }
  const site = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://agdezgym.vercel.app";
  const derived = `atlas-agdez-session-v1:${site}`;
  return new TextEncoder().encode(derived);
}
