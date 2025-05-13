/**
 * Removes the C-, P- and X- prefix from the provided address.
 */
export const stripAddressPrefix = (address: string) =>
  address.replace(/^[XPC]-/, '');
