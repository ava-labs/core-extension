import {
  avaxSerial,
  avmSerial,
  Common,
  evm,
  pvmSerial,
  VM,
} from '@avalabs/avalanchejs-v2';
import { Avalanche } from '@avalabs/wallets-sdk';
import getApiBySourceTx from './getApiBySourceTx';

const getOutputEmitterTx = async (
  tx: avaxSerial.AvaxTx,
  provider: Avalanche.AbstractProvider,
  vm: VM,
  outputEmitterTxId: string
) => {
  const api = getApiBySourceTx(tx, provider, vm);

  try {
    if (avmSerial.isImportTx(tx) || pvmSerial.isImportTx(tx)) {
      // importing from C is done via atomic transactions
      if (tx.sourceChain.toString() === provider.getContext().cBlockchainID) {
        return await (api as evm.EVMApi).getAtomicTx({
          txID: outputEmitterTxId,
        });
      }
    }

    // importing from X/P (and all the other X/P transactions) works with "regular" transactions
    return await (api as Common.AvaxApi).getTx({
      txID: outputEmitterTxId,
    });
  } catch (err) {
    throw new Error(
      `Error while fetching source transaction: "${
        (err as unknown as Error).message
      }"`
    );
  }
};

export default getOutputEmitterTx;
