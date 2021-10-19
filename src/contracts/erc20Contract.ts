const erc20Abi = require('./erc20.abi.json');
import abiDecoder from 'abi-decoder';
import { KNownContractHelperMap } from './models';
import { dataParser } from './utils/dataParser';

export const erc20ContractHelper = {
  docs: 'https://docs.uniswap.org/protocol/V2/reference/smart-contracts/router-02#swapexactethfortokens',
  name: 'erc20',
  abi: erc20Abi,
  decoder: abiDecoder.decodeMethod.bind(abiDecoder),
  parser: dataParser,
};

export const Erc20ContractHelperMap: KNownContractHelperMap = [
  'erc20',
  erc20ContractHelper,
];
