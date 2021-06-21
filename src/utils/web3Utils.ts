import { AVAX_FUJI_CHAIN_ID } from '@src/utils/constants';
import Web3 from 'web3';

// hardcoded testnet for now, get from network store later
const fujiprovider: any = {
  supportedChainIds: [AVAX_FUJI_CHAIN_ID],
  networkId: '1',
  networkUrl: 'https://api.avax-test.network/ext/bc/C/rpc',
  explorerUrl: 'https://cchain.explorer.avax-test.network/',
};

const web3 = new Web3(fujiprovider);
const { BN } = web3.utils;

export const hexToNumber = (value: string): number => {
  return web3.utils.hexToNumber(value);
};

export const numberToHex = (value: number): string => {
  return web3.utils.toHex(value);
};

// format to AVAX values
export const fromWei = (value: string): string => {
  return web3.utils.fromWei(value);
};

export default {
  hexToNumber,
  numberToHex,
};
