import * as ethers from 'ethers';
import { Interface } from 'ethers/lib/utils';
import {
  ContractSourceCodeResponse,
  getABIForContract,
  getSourceForContract,
} from '@avalabs/snowtrace-sdk';
import { NetworkService } from '../network/NetworkService';
import { ChainId } from '@avalabs/chains-sdk';
import ERC20 from '@openzeppelin/contracts/build/contracts/ERC20.json';

export function isTxDescriptionError(
  desc: ethers.utils.TransactionDescription | { error: string }
): desc is ethers.utils.TransactionDescription {
  // eslint-disable-next-line no-prototype-builtins
  return !!desc && !desc.hasOwnProperty('error');
}

function parseDataWithABI(
  data: string,
  value: string,
  contractInterface: ethers.ethers.utils.Interface
) {
  try {
    const finalResponse = contractInterface.parseTransaction({
      data: data,
      value: value,
    });

    return finalResponse;
  } catch (e) {
    return { error: 'error decoding with abi' };
  }
}

async function getAvalancheABIFromSource(address: string, isMainnet: boolean) {
  let contractSource: ContractSourceCodeResponse;
  try {
    const response = await getSourceForContract(address, isMainnet);
    if (!response.result[0])
      throw new Error('Missing ContractSourceCodeResponse');
    contractSource = response.result[0];
  } catch (e) {
    console.error(e);
    return { error: 'error decoding with abi' };
  }
  const response = await (contractSource.Proxy === '1' &&
  contractSource.Implementation.length > 0
    ? getABIForContract(contractSource.Implementation, isMainnet)
    : Promise.resolve(undefined));

  return { result: response?.result, contractSource };
}

export async function getTxInfo(
  address: string,
  data: string,
  value: string,
  networkService: NetworkService
) {
  const isMainnet = await networkService.isMainnet();
  const activeNetwork = await networkService.activeNetwork.promisify();

  /**
   * We already eliminate BTC as a tx requestor so we only need to verify if we are still on a
   * avalanche net. At this point anything else would be a subnet
   */
  if (
    activeNetwork?.chainId !== ChainId.AVALANCHE_TESTNET_ID &&
    activeNetwork?.chainId !== ChainId.AVALANCHE_MAINNET_ID
  ) {
    return parseDataWithABI(data, value, new Interface(ERC20.abi));
  }

  const { result, contractSource, error } = await getAvalancheABIFromSource(
    address,
    isMainnet
  );

  if (error) return { error };

  if (contractSource?.ABI === 'Contract source code not verified') {
    return { error: 'Contract source code not verified' };
  }

  const abi = result || contractSource?.ABI;
  if (!abi) return { error: 'unable to get abi' };
  return parseDataWithABI(data, value, new Interface(abi));
}