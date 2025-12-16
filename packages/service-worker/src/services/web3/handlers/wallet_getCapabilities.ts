import { injectable } from 'tsyringe';

import { DAppProviderRequest, DAppRequestHandler } from '@core/types';

/**
 * Capabilities returned by wallet_getCapabilities (EIP-5792)
 * Each capability is keyed by chain ID (hex string)
 */
type WalletCapabilities = Record<
  string,
  {
    [capability: string]: {
      supported: boolean;
    };
  }
>;

/**
 * Handler for the wallet_getCapabilities RPC method (EIP-5792)
 *
 * This method allows dApps to query the wallet's supported capabilities
 * for specific chains. Capabilities are returned as key/value pairs,
 * organized by chain ID.
 *
 * @see https://eips.ethereum.org/EIPS/eip-5792
 */
@injectable()
export class WalletGetCapabilitiesHandler extends DAppRequestHandler<
  [string] | undefined,
  WalletCapabilities
> {
  methods = [DAppProviderRequest.WALLET_GET_CAPABILITIES];

  handleAuthenticated = async ({ request }) => {
    // Currently, we don't support any EIP-5792 capabilities
    return {
      ...request,
      result: {},
    };
  };

  handleUnauthenticated = async ({ request }) => {
    // Currently, we don't support any EIP-5792 capabilities
    return {
      ...request,
      result: {},
    };
  };
}
