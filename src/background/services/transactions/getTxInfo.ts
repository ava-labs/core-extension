import {
  NetworkConfig,
  getABIForContract,
} from '@avalabs/avalanche-wallet-sdk/dist/index';
import { network$ } from '@avalabs/wallet-react-components';
import { firstValueFrom } from 'rxjs';
import * as ethers from 'ethers';
import hstABI from 'human-standard-token-abi';
import { resolve } from '@src/utils/promiseResolver';

const hstInterface = new ethers.utils.Interface(hstABI);

export function isTxDescriptionError(
  desc: ethers.utils.TransactionDescription | { error: string }
): desc is ethers.utils.TransactionDescription {
  // eslint-disable-next-line no-prototype-builtins
  return !!desc && !desc.hasOwnProperty('error');
}

export async function getTxInfo(address: string, data: string) {
  const network = await firstValueFrom(network$);
  const [contractABIResult] = await resolve(
    getABIForContract(address, network?.config as NetworkConfig)
  );

  try {
    const contractInterface = new ethers.utils.Interface(
      contractABIResult.data.result
    );
    const contractDecoding = contractInterface.parseTransaction({
      data,
    });

    if (contractDecoding) return contractDecoding;

    return hstInterface.parseTransaction({
      data,
    });
  } catch (err) {
    return { error: 'error decoding with abi' };
  }
}
