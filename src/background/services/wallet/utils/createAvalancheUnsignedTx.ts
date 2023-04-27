import {
  UnsignedTx,
  avaxSerial,
  VM,
  utils,
  Utxo,
  Credential,
  TransferableOutput,
  pvmSerial,
} from '@avalabs/avalanchejs-v2';
import { Avalanche } from '@avalabs/wallets-sdk';
import getOutputEmitterTx from './getOutputEmitterTx';
import { handleSubnetAuth, isSubnetTx } from './handleSubnetAuth';

type Params = {
  tx: avaxSerial.AvaxTx;
  fromAddressBytes?: Uint8Array[];
  vm: VM;
  provider: Avalanche.JsonRpcProvider;
  credentials?: Credential[];
  utxos?: Utxo[];
};

const createAvalancheUnsignedTx = async ({
  tx,
  fromAddressBytes,
  vm,
  provider,
  credentials,
  utxos,
}: Params) => {
  const inputs = utils.getTransferableInputsByTx(tx);

  // fetch only if UTXOs were not provided
  const utxoList =
    utxos ??
    (await inputs.reduce<Promise<Utxo[]>>(async (acc, input) => {
      const utxos = await acc;
      const outputEmitterTxId = input.utxoID.txID;
      const outputEmitterSignedTx = await getOutputEmitterTx(
        tx,
        provider,
        vm,
        outputEmitterTxId.toString()
      );
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
    }, Promise.resolve([])));

  const addressMaps = utils.AddressMaps.fromTransferableInputs(
    inputs,
    utxoList,
    BigInt(Math.floor(new Date().getTime() / 1000)),
    fromAddressBytes
  );

  // if the transaction wants to interact with a subnet
  // let's extend the address maps with the addresses and indices needed for subnet authorization
  if (isSubnetTx(tx)) {
    try {
      const addressMapsWithSubnetAuth = await handleSubnetAuth({
        tx: tx as pvmSerial.AbstractSubnetTx,
        provider,
        addressMaps,
      });

      return new UnsignedTx(
        tx,
        utxoList,
        addressMapsWithSubnetAuth,
        credentials
      );
    } catch (err) {
      throw new Error(
        `Error while preparing subnet authorization data: ${
          (err as unknown as Error).message
        }`
      );
    }
  }

  return new UnsignedTx(tx, utxoList, addressMaps, credentials);
};

export default createAvalancheUnsignedTx;
