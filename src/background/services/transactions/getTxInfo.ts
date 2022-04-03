import { isMainnetNetwork } from '@avalabs/avalanche-wallet-sdk';
import { network$ } from '@avalabs/wallet-react-components';
import { firstValueFrom } from 'rxjs';
import * as ethers from 'ethers';
import { Interface } from 'ethers/lib/utils';
import {
  ContractSourceCodeResponse,
  getABIForContract,
  getSourceForContract,
} from '@avalabs/snowtrace-sdk';

export function isTxDescriptionError(
  desc: ethers.utils.TransactionDescription | { error: string }
): desc is ethers.utils.TransactionDescription {
  // eslint-disable-next-line no-prototype-builtins
  return !!desc && !desc.hasOwnProperty('error');
}

export async function getTxInfo(address: string, data: string, value: string) {
  const network = await firstValueFrom(network$);
  const isMainnet = network?.config && isMainnetNetwork(network.config);
  let contractSource: ContractSourceCodeResponse;
  try {
    const response = await getSourceForContract(address, isMainnet);
    contractSource = response.result[0];
  } catch (e) {
    console.error(e);
    return { error: 'error decoding with abi' };
  }

  let contractInterface: Interface;
  if (
    contractSource.Proxy === '1' &&
    contractSource.Implementation.length > 0
  ) {
    // get the real contract's ABI since it's a proxy
    try {
      const response = await getABIForContract(
        contractSource.Implementation,
        isMainnet
      );
      contractInterface = new Interface(response.result);
    } catch (e) {
      console.error(e);
      return { error: 'error decoding with abi' };
    }
  } else {
    contractInterface = new Interface(contractSource.ABI);
  }

  return contractInterface.parseTransaction({
    data: data,
    value: value,
  });
}
