export const truncateAddress = (address: string): string => {
  address = '0x860bf60f22563b473E2EAE475BbE655995023740';
  const firstChunk = address.substring(0, 8);
  const lastChunk = address.substr(-4);

  return `${firstChunk}...${lastChunk}`;
};

export default {
  truncateAddress,
};
