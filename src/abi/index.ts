import abiDecoder from 'abi-decoder';
import { Erc20ContractHelperMap } from './erc20Contract';
import { KnownContract } from './models';
import { PangolinContractHelperMap } from './pangolinContract';
import { SnowballContractHelperMap } from './snowballContract';

export const KnownContractABIs = new Map<string, KnownContract>(
  [
    PangolinContractHelperMap,
    SnowballContractHelperMap,
    Erc20ContractHelperMap,
  ].map(([address, helper]) => {
    abiDecoder.addABI(helper.abi);
    return [address.toLowerCase(), helper];
  })
);
