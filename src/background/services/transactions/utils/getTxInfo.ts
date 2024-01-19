import { Interface, TransactionDescription } from 'ethers';
import {
  getABIForContract,
  getSourceForContract,
} from '@avalabs/snowtrace-sdk';
import { ChainId, Network } from '@avalabs/chains-sdk';
import ERC20 from '@openzeppelin/contracts/build/contracts/ERC20.json';

function parseDataWithABI(
  data: string,
  value: string,
  contractInterface: Interface
): TransactionDescription {
  const finalResponse = contractInterface.parseTransaction({
    data: data,
    value: value ? value : undefined,
  });

  if (!finalResponse) {
    throw new Error('no matching function found');
  }

  return finalResponse;
}

async function getAvalancheABIFromSource(address: string, isMainnet: boolean) {
  const contractSourceResponse = await getSourceForContract(
    address,
    isMainnet,
    process.env.GLACIER_API_KEY
  );

  if (!contractSourceResponse.result[0]) {
    throw new Error('Missing ContractSourceCodeResponse');
  }

  const contractSource = contractSourceResponse.result[0];

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
): Promise<TransactionDescription> {
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

  const { result, contractSource } = await getAvalancheABIFromSource(
    address,
    !network.isTestnet
  );

  if (contractSource?.ABI === 'Contract source code not verified') {
    throw new Error('Contract source code not verified');
  }

  const abi = result || contractSource?.ABI;
  if (!abi) {
    throw new Error('unable to get abi');
  }
  return parseDataWithABI(data, value, new Interface(abi));
}
