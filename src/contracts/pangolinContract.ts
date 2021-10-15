const pangolinAbi = require('./pangolin.abi.json');
import abiDecoder from 'abi-decoder';
import { KNownContractHelperMap } from './models';
import { dataParser } from './utils/dataParser';

export const pangolinContractHelper = {
  docs: 'https://docs.uniswap.org/protocol/V2/reference/smart-contracts/router-02#swapexactethfortokens',
  name: 'pangolin',
  abi: pangolinAbi,
  decoder: abiDecoder.decodeMethod.bind(abiDecoder),
  parser: dataParser,
};

export const PangolinContractHelperMap: KNownContractHelperMap = [
  '0xe54ca86531e17ef3616d22ca28b0d458b6c89106',
  pangolinContractHelper,
];
