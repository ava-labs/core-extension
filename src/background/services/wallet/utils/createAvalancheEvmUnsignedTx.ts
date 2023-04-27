import {
  VM,
  utils,
  Common,
  Utxo,
  evmSerial,
  EVMUnsignedTx,
  avaxSerial,
  UnsignedTx,
  TransferableOutput,
} from '@avalabs/avalanchejs-v2';
import { Avalanche } from '@avalabs/wallets-sdk';
import getApiBySourceTx from './getApiBySourceTx';

type Params = {
  txBytes: Uint8Array;
  fromAddress: string;
  vm: VM;
  provider: Avalanche.JsonRpcProvider;
};

const createAvalancheEvmUnsignedTx = async ({
  txBytes,
  fromAddress,
  vm,
  provider,
}: Params) => {
  const tx = utils.unpackWithManager(vm, txBytes) as avaxSerial.AvaxTx;
  const api = getApiBySourceTx(tx, provider, vm);
  const fromAddressBytes = utils.parse(fromAddress)[2];
  const fromAddressHex = utils.bufferToHex(fromAddressBytes);

  if (evmSerial.isExportTx(tx)) {
    return new EVMUnsignedTx(
      tx,
      [],
      new utils.AddressMaps([utils.AddressMap.fromJSON([[fromAddressHex, 0]])])
    );
  }

  if (evmSerial.isImportTx(tx)) {
    const utxos = await tx.importedInputs.reduce<Promise<Utxo[]>>(
      async (acc, input) => {
        const utxos = await acc;
        const outputEmitterTxId = input.utxoID.txID;
        const outputEmitterSignedTx = await (
          api as unknown as Common.AvaxApi
        ).getTx({
          txID: outputEmitterTxId.toString(),
        });

        const transferableOutputs = utils.getTransferableOutputsByTx(
          outputEmitterSignedTx.unsignedTx as avaxSerial.AvaxTx
        );

        const transferableOutput =
          transferableOutputs[input.utxoID.outputIdx.value()];

        if (!transferableOutput) {
          throw new Error(
            `Unable to find UTXO "${input.utxoID.outputIdx.value()}"`
          );
        }

        const utxo = new Utxo(
          input.utxoID,
          input.assetId,
          transferableOutput instanceof TransferableOutput
            ? transferableOutput.output
            : transferableOutput
        );

        utxos.push(utxo);

        return utxos;
      },
      Promise.resolve([])
    );

    const addressMaps = utils.AddressMaps.fromTransferableInputs(
      tx.importedInputs,
      utxos,
      BigInt(Math.floor(new Date().getTime() / 1000)),
      [fromAddressBytes]
    );

    return new UnsignedTx(tx, utxos, addressMaps);
  }

  throw new Error(`Unsupported transaction type`);
};

export default createAvalancheEvmUnsignedTx;
