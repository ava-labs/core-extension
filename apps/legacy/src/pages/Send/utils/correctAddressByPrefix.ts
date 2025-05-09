export const correctAddressByPrefix = (address: string, prefix: string) => {
  return !address.startsWith(prefix) ? `${prefix}${address}` : address;
};
