import { isBech32Address } from '@avalabs/bridge-sdk';
import { isAddress } from 'ethers';

export const isValidAddress = (address: string) => {
  return !!address.length && isAddress(address);
};

export const isValidBtcAddress = (address: string) => {
  return !!address.length && isBech32Address(address);
};
