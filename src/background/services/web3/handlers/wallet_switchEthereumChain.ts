import { network$ } from '@avalabs/wallet-react-components';
import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import {
  ConnectionRequestHandler,
  ExtensionConnectionMessage,
} from '@src/background/connections/models';
import { supportedNetworksByChainID } from './../../network/models';

/**
 * @link https://eips.ethereum.org/EIPS/eip-3326
 * @param data
 */
export async function wallet_switchEthereumChain(
  data: ExtensionConnectionMessage
) {
  const params = data.params;

  const targetChainID = params?.[0]?.chainId;
  const targetNetwork = supportedNetworksByChainID.get(targetChainID);
  if (!targetNetwork) {
    return {
      ...data,
      error: {
        code: 0,
        message:
          'One or more chains requested are not supported by this extension',
      } as any,
    };
  }
  network$.next(targetNetwork);
  return {
    ...data,
    result: null,
  };
}

export const WalletSwitchEthereumChain: [
  DAppProviderRequest,
  ConnectionRequestHandler
] = [
  DAppProviderRequest.WALLET_SWITCH_ETHEREUM_CHAIN,
  wallet_switchEthereumChain,
];
