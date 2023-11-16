import {
  Utxo,
  VM,
  getManagerForVM,
  hexToBuffer,
} from '@avalabs/avalanchejs-v2';

type Param = {
  utxoHexes?: string[];
  vm: VM;
};

const getProvidedUtxos = ({ utxoHexes = [], vm }: Param) => {
  try {
    const codec = getManagerForVM(vm).getDefaultCodec();
    return utxoHexes.map((utxoHex) => {
      const utxoBytes = hexToBuffer(utxoHex);
      return Utxo.fromBytes(utxoBytes, codec)[0];
    });
  } catch (err) {
    return [];
  }
};

export default getProvidedUtxos;
