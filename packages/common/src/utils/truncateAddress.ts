export const truncateAddress = (
  address: string,
  size = 6,
  lastChunkSize?: number,
): string => {
  const firstChunk = address.substring(0, size);
  const lastChunk = address.substr(-(lastChunkSize ?? size / 2));

  return `${firstChunk}...${lastChunk}`;
};
