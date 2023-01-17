import { ethErrors } from 'eth-rpc-errors';
import { injectable } from 'tsyringe';
import { DAppRequestHandler } from '@src/background/connections/dAppConnection/DAppRequestHandler';
import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import { WalletService } from '../../wallet/WalletService';

@injectable()
export class AvalancheGetAddressesInRangeHandler extends DAppRequestHandler {
  methods = [DAppProviderRequest.AVALANCHE_GET_ADDRESSES_IN_RANGE];

  constructor(private walletService: WalletService) {
    super();
  }

  handleAuthenticated = async (request) => {
    const [externalStart, internalStart, externalLimit, internalLimit] =
      request.params;

    try {
      const result = await this.walletService.getAddressesInRange(
        externalStart,
        internalStart,
        externalLimit,
        internalLimit
      );

      return { ...request, result };
    } catch (err) {
      return {
        ...request,
        error: ethErrors.rpc.invalidParams({
          message: (err as unknown as Error).message,
        }),
      };
    }
  };

  handleUnauthenticated = async (request) => {
    return {
      ...request,
      error: ethErrors.provider.unauthorized(),
    };
  };
}
