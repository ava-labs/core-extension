import { Utxo, VM, utils } from '@avalabs/avalanchejs';

type Param = {
  utxoHexes?: string[];
  vm: VM;
};

const getProvidedUtxos = ({ utxoHexes = [], vm }: Param) => {
  const codec = utils.getManagerForVM(vm).getDefaultCodec();

  return utxoHexes.map((utxoHex) => {
    const utxoBytes = utils.hexToBuffer(utxoHex);
    const utxo = Utxo.fromBytes(utxoBytes, codec)[0];

    if (!utxo) {
      throw new Error('Failed to decode provided UTXO');
    }

    return utxo;
  });
};

export default getProvidedUtxos;
