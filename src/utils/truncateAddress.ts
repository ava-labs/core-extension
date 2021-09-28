export const truncateAddress = (address: string): string => {
  const firstChunk = address.substring(0, 6);
  const lastChunk = address.substr(-3);

  return `${firstChunk}..${lastChunk}`;
};
