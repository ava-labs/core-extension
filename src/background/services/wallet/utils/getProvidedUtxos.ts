import { Utxo, VM, utils } from '@avalabs/avalanchejs';

type Param = {
  utxoHexes?: string[];
  vm: VM;
};

const getProvidedUtxos = ({ utxoHexes = [], vm }: Param) => {
  try {
    const codec = utils.getManagerForVM(vm).getDefaultCodec();
    return utxoHexes.map((utxoHex) => {
      const utxoBytes = utils.hexToBuffer(utxoHex);
      return Utxo.fromBytes(utxoBytes, codec)[0];
    });
  } catch (err) {
    return [];
  }
};

export default getProvidedUtxos;
