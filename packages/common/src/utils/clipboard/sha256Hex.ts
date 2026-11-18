/**
 * SHA-256 of a UTF-8 string, hex encoded. Used to compare clipboard content
 * with a copied secret without handing the secret itself to other contexts.
 */
export const sha256Hex = async (text: string): Promise<string> => {
  const digest = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(text),
  );
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
};
