import { ethErrors } from 'eth-rpc-errors';
import { injectable } from 'tsyringe';
import { DAppRequestHandler } from '@src/background/connections/dAppConnection/DAppRequestHandler';
import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import { Avalanche } from '@avalabs/wallets-sdk';
import { SecretsService } from '../../secrets/SecretsService';
import { NetworkService } from '../../network/NetworkService';

@injectable()
export class AvalancheGetAddressesInRangeHandler extends DAppRequestHandler {
  methods = [DAppProviderRequest.AVALANCHE_GET_ADDRESSES_IN_RANGE];

  constructor(
    private secretsService: SecretsService,
    private networkService: NetworkService
  ) {
    super();
  }

  handleAuthenticated = async ({ request }) => {
    const [externalStart, internalStart, externalLimit, internalLimit] =
      request.params;

    if (
      isNaN(externalStart) ||
      externalStart < 0 ||
      isNaN(internalStart) ||
      internalStart < 0
    ) {
      return {
        ...request,
        error: ethErrors.rpc.invalidParams({
          message: 'Invalid start index',
        }),
      };
    }

    const getCorrectedLimit = (limit?: number) => {
      const MAX_LIMIT = 100;

      if (limit === undefined || isNaN(limit)) {
        return 0;
      }

      return limit > MAX_LIMIT ? MAX_LIMIT : limit;
    };

    try {
      const correctedExternalLimit = getCorrectedLimit(externalLimit);
      const correctedInternalLimit = getCorrectedLimit(internalLimit);
      const provXP = await this.networkService.getAvalanceProviderXP();
      const secrets = await this.secretsService.getPrimaryAccountSecrets();

      const addresses: { external: string[]; internal: string[] } = {
        external: [],
        internal: [],
      };

      if (secrets?.xpubXP) {
        if (correctedExternalLimit > 0) {
          for (
            let index = externalStart;
            index < externalStart + correctedExternalLimit;
            index++
          ) {
            addresses.external.push(
              Avalanche.getAddressFromXpub(
                secrets.xpubXP,
                index,
                provXP,
                'X'
              ).split('-')[1] as string // since addresses are the same for X/P we return them without the chain alias prefix (e.g.: fuji1jsduya7thx2ayrawf9dnw7v9jz7vc6xjycra2m)
            );
          }
        }

        if (correctedInternalLimit > 0) {
          for (
            let index = internalStart;
            index < internalStart + correctedInternalLimit;
            index++
          ) {
            addresses.internal.push(
              Avalanche.getAddressFromXpub(
                secrets.xpubXP,
                index,
                provXP,
                'X',
                true
              ).split('-')[1] as string // only X has "internal" (change) addresses, but we remove the chain alias here as well to make it consistent with the external address list
            );
          }
        }
      }

      return {
        ...request,
        result: addresses,
      };
    } catch (err) {
      return {
        ...request,
        error: ethErrors.rpc.invalidParams({
          message: (err as unknown as Error).message,
        }),
      };
    }
  };

  handleUnauthenticated = async ({ request }) => {
    return {
      ...request,
      error: ethErrors.provider.unauthorized(),
    };
  };
}
