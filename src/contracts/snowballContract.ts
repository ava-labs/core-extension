const snowballAbi = require('./snowball.abi.json');
import abiDecoder from 'abi-decoder';
import { KNownContractHelperMap } from './models';
import { dataParser } from './utils/dataParser';

export const snowballContractHelper = {
  docs: 'https://help.uniswap.org/en/articles/5392390-what-is-an-approve',
  name: 'snowball',
  abi: snowballAbi,
  decoder: abiDecoder.decodeMethod.bind(abiDecoder),
  parser: dataParser,
};

export const SnowballContractHelperMap: KNownContractHelperMap = [
  '0xC38f41A296A4493Ff429F1238e030924A1542e50',
  snowballContractHelper,
];
