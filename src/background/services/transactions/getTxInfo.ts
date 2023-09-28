import { Interface, TransactionDescription } from 'ethers';
import {
  ContractSourceCodeResponse,
  getABIForContract,
  getSourceForContract,
} from '@avalabs/snowtrace-sdk';
import { ChainId, Network } from '@avalabs/chains-sdk';
import ERC20 from '@openzeppelin/contracts/build/contracts/ERC20.json';

export function isTxDescriptionError(
  desc: TransactionDescription | { error: string }
): desc is TransactionDescription {
  // eslint-disable-next-line no-prototype-builtins
  return !!desc && !desc.hasOwnProperty('error');
}

function parseDataWithABI(
  data: string,
  value: string,
  contractInterface: Interface
) {
  try {
    const finalResponse = contractInterface.parseTransaction({
      data: data,
      value: value,
    });

    if (!finalResponse) {
      return { error: 'no matching function found' };
    }

    return finalResponse;
  } catch (e) {
    return { error: 'error decoding with abi' };
  }
}

async function getAvalancheABIFromSource(address: string, isMainnet: boolean) {
  let contractSource: ContractSourceCodeResponse;
  try {
    const response = await getSourceForContract(
      address,
      isMainnet,
      process.env.GLACIER_API_KEY
    );
    if (!response.result[0])
      throw new Error('Missing ContractSourceCodeResponse');
    contractSource = response.result[0];
  } catch (e) {
    console.error(e);
    return { error: 'error decoding with abi' };
  }
  const response = await (contractSource.Proxy === '1' &&
  contractSource.Implementation.length > 0
    ? getABIForContract(
        contractSource.Implementation,
        isMainnet,
        process.env.GLACIER_API_KEY
      )
    : Promise.resolve(undefined));

  return { result: response?.result, contractSource };
}

export async function getTxInfo(
  address: string,
  data: string,
  value: string,
  network: Network
) {
  /**
   * We already eliminate BTC as a tx requestor so we only need to verify if we are still on a
   * avalanche net. At this point anything else would be a subnet
   */
  if (
    network?.chainId !== ChainId.AVALANCHE_TESTNET_ID &&
    network?.chainId !== ChainId.AVALANCHE_MAINNET_ID
  ) {
    return parseDataWithABI(data, value, new Interface(ERC20.abi));
  }

  const { result, contractSource, error } = await getAvalancheABIFromSource(
    address,
    !network.isTestnet
  );

  if (error) return { error };

  if (contractSource?.ABI === 'Contract source code not verified') {
    return { error: 'Contract source code not verified' };
  }

  const abi = result || contractSource?.ABI;
  if (!abi) return { error: 'unable to get abi' };
  return parseDataWithABI(data, value, new Interface(abi));
}
