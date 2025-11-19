import { Chain } from '@avalabs/bridge-unified';
import { assert, getProviderForNetwork, SupportedProvider } from '@core/common';
import { Account, CommonError, NetworkWithCaipId } from '@core/types';
import { buildChain } from './buildChain';
import { getAddresses } from './getAddresses';

export async function buildParams(
  activeAccount: Account | undefined,
  sourceNetwork: NetworkWithCaipId | undefined,
  targetNetwork: NetworkWithCaipId | undefined,
): Promise<{
  sourceChain: Chain;
  sourceChainId: string;
  targetChain: Chain;
  provider: SupportedProvider;
  fromAddress: string;
  toAddress: string;
}> {
  assert(sourceNetwork, CommonError.NoActiveNetwork);
  assert(activeAccount, CommonError.NoActiveAccount);
  assert(targetNetwork, CommonError.UnknownNetwork);

  const sourceChain = buildChain(sourceNetwork);
  const targetChain = buildChain(targetNetwork);

  const provider = await getProviderForNetwork(sourceNetwork);

  const { fromAddress, toAddress } = getAddresses(
    activeAccount,
    sourceChain,
    targetChain,
  );

  return {
    sourceChain,
    sourceChainId: sourceNetwork.caipId,
    targetChain,
    provider,
    fromAddress,
    toAddress,
  };
}
