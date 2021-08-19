export const truncateAddress = (address: string): string => {
  const firstChunk = address.substring(0, 8);
  const lastChunk = address.substr(-4);

  return `${firstChunk}...${lastChunk}`;
};
