export const base64ToBase64Url = (b64: string): string => {
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/[=]*$/g, '');
};

export const base64UrlToBuffer = (b64url: string): Uint8Array => {
  const b64 = b64url
    .replace(/-/g, '+')
    .replace(/_/g, '/')
    .replace(/[=]*$/g, '');
  return Uint8Array.from(Buffer.from(b64, 'base64'));
};

export function bufferToBase64Url(buffer: Buffer): string {
  // buffer to binary string
  const byteView = new Uint8Array(buffer);
  let str = '';
  for (const charCode of byteView) {
    str += String.fromCharCode(charCode);
  }

  // binary string to base64
  const base64String = btoa(str); //Buffer.from(str).toString('base64');

  // base64 to base64url
  return base64String
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/[=]/g, '');
}
