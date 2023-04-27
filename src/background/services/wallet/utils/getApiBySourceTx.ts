import {
  avaxSerial,
  avmSerial,
  evmSerial,
  pvmSerial,
  VM,
} from '@avalabs/avalanchejs-v2';
import { Avalanche } from '@avalabs/wallets-sdk';

const getApiBySourceTx = (
  tx: avaxSerial.AvaxTx,
  provider: Avalanche.JsonRpcProvider,
  vm: VM
) => {
  if (
    avmSerial.isImportTx(tx) ||
    pvmSerial.isImportTx(tx) ||
    evmSerial.isImportTx(tx)
  ) {
    return provider.getApiByChainID(tx.sourceChain.toString());
  }

  return provider.getApiByVM(vm);
};

export default getApiBySourceTx;
