export const toArrayBuffer = (
  value: Buffer | Uint8Array<ArrayBufferLike>,
): ArrayBuffer => {
  return Uint8Array.from(value).buffer;
};
