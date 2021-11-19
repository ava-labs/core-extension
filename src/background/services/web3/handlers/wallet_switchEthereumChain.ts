import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import {
  ConnectionRequestHandler,
  ExtensionConnectionMessage,
} from '@src/background/connections/models';
import { AddEthChainParams } from '@src/background/models';
import { supportedNetworks } from '../../network/models';

/**
 * @link https://eips.ethereum.org/EIPS/eip-3326
 * @param data
 */
export async function wallet_switchEthereumChain(
  data: ExtensionConnectionMessage
) {
  const params = data.params;
  const supportedChainIds = Array.from(supportedNetworks.values()).map(
    (network) => network.chainId
  );
  const chainsRequestedIsSupported = params?.every((chainRequested) =>
    supportedChainIds.includes(chainRequested.chainId)
  );
  return {
    ...data,
    ...(chainsRequestedIsSupported
      ? { result: null }
      : {
          error: {
            code: 0,
            message:
              'One or more chains requested are not supported by this extension',
          } as any,
        }),
  };
}

export const WalletSwitchEthereumChain: [
  DAppProviderRequest,
  ConnectionRequestHandler
] = [
  DAppProviderRequest.WALLET_SWITCH_ETHEREUM_CHAIN,
  wallet_switchEthereumChain,
];
