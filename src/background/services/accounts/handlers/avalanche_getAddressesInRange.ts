import { ethErrors } from 'eth-rpc-errors';
import { injectable } from 'tsyringe';
import { DAppRequestHandler } from '@src/background/connections/dAppConnection/DAppRequestHandler';
import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import { Avalanche } from '@avalabs/core-wallets-sdk';
import { SecretsService } from '../../secrets/SecretsService';
import { NetworkService } from '../../network/NetworkService';
import { canSkipApproval } from '@src/utils/canSkipApproval';
import { Action } from '../../actions/models';
import { openApprovalWindow } from '@src/background/runtime/openApprovalWindow';
import { DEFERRED_RESPONSE } from '@src/background/connections/middlewares/models';
import {
  GetAddressesInRangeDisplayData,
  GetAddressesInRangeResponse,
} from '../models';

type Params = [
  externalStart: number,
  internalStart: number,
  externalLimit: number,
  internalLimit: number
];
import { AccountsService } from '../AccountsService';

@injectable()
export class AvalancheGetAddressesInRangeHandler extends DAppRequestHandler<
  Params,
  GetAddressesInRangeResponse
> {
  methods = [DAppProviderRequest.AVALANCHE_GET_ADDRESSES_IN_RANGE];

  constructor(
    private secretsService: SecretsService,
    private networkService: NetworkService,
    private accountsService: AccountsService
  ) {
    super();
  }

  #getCorrectedLimit = (limit?: number) => {
    const MAX_LIMIT = 100;

    if (limit === undefined || isNaN(limit)) {
      return 0;
    }

    return limit > MAX_LIMIT ? MAX_LIMIT : limit;
  };

  #getAddresses = async ({
    internalStart,
    internalLimit,
    externalStart,
    externalLimit,
  }) => {
    const provXP = await this.networkService.getAvalanceProviderXP();
    const secrets = await this.secretsService.getPrimaryAccountSecrets(
      this.accountsService.activeAccount
    );

    const addresses: { external: string[]; internal: string[] } = {
      external: [],
      internal: [],
    };

    if (secrets?.xpubXP) {
      if (externalLimit > 0) {
        for (
          let index = externalStart;
          index < externalStart + externalLimit;
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

      if (internalLimit > 0) {
        for (
          let index = internalStart;
          index < internalStart + internalLimit;
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

    return addresses;
  };

  handleAuthenticated = async ({ request, scope }) => {
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

    if (!request.site?.domain || !request.site?.tabId) {
      return {
        ...request,
        error: ethErrors.rpc.invalidRequest({
          message: 'Missing dApp domain information',
        }),
      };
    }

    try {
      const correctedInternalLimit = this.#getCorrectedLimit(internalLimit);
      const correctedExternalLimit = this.#getCorrectedLimit(externalLimit);
      const addresses = await this.#getAddresses({
        internalStart,
        internalLimit: correctedInternalLimit,
        externalStart,
        externalLimit: correctedExternalLimit,
      });

      if (await canSkipApproval(request.site.domain, request.site.tabId)) {
        return {
          ...request,
          result: addresses,
        };
      }

      const actionData: Action<GetAddressesInRangeDisplayData> = {
        ...request,
        scope,
        displayData: {
          indices: {
            internalStart,
            internalLimit: correctedInternalLimit,
            externalStart,
            externalLimit: correctedExternalLimit,
          },
          addresses,
        },
      };

      await openApprovalWindow(actionData, 'getAddressesInRange');

      return {
        ...request,
        result: DEFERRED_RESPONSE,
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

  onActionApproved = async (
    pendingAction: Action<GetAddressesInRangeDisplayData>,
    _,
    onSuccess
  ) => {
    onSuccess(pendingAction.displayData.addresses);
  };
}
