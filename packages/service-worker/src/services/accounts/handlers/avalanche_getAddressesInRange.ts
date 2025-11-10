import {
  canSkipApproval,
  getAddressesInRange,
  KNOWN_CORE_DOMAINS,
} from '@core/common';
import {
  Action,
  AVALANCHE_BASE_DERIVATION_PATH,
  DAppProviderRequest,
  DAppRequestHandler,
  DEFERRED_RESPONSE,
  GetAddressesInRangeDisplayData,
  GetAddressesInRangeResponse,
} from '@core/types';
import { ethErrors } from 'eth-rpc-errors';
import { injectable } from 'tsyringe';
import { openApprovalWindow } from '~/runtime/openApprovalWindow';
import { NetworkService } from '../../network/NetworkService';
import { SecretsService } from '../../secrets/SecretsService';
import { getExtendedPublicKey } from '../../secrets/utils';
import { AccountsService } from '../AccountsService';

type Params = [
  externalStart: number,
  internalStart: number,
  externalLimit: number,
  internalLimit: number,
];

const EXPOSED_DOMAINS = [
  'develop.avacloud-app.pages.dev',
  'avacloud.io',
  'staging--ava-cloud.avacloud-app.pages.dev',
  ...KNOWN_CORE_DOMAINS,
];

@injectable()
export class AvalancheGetAddressesInRangeHandler extends DAppRequestHandler<
  Params,
  GetAddressesInRangeResponse
> {
  methods = [DAppProviderRequest.AVALANCHE_GET_ADDRESSES_IN_RANGE];

  constructor(
    private secretsService: SecretsService,
    private networkService: NetworkService,
    private accountsService: AccountsService,
  ) {
    super();
  }

  #removePrefixedAddress = (address: string) => {
    return address.replace('P-', '');
  };

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
    const activeAccount = await this.accountsService.getActiveAccount();
    const secrets =
      await this.secretsService.getPrimaryAccountSecrets(activeAccount);

    const addresses: { external: string[]; internal: string[] } = {
      external: [],
      internal: [],
    };

    if (!secrets) {
      return addresses;
    }

    if ('extendedPublicKeys' in secrets) {
      const extendedPublicKey = getExtendedPublicKey(
        secrets.extendedPublicKeys,
        AVALANCHE_BASE_DERIVATION_PATH,
        'secp256k1',
      );
      if (extendedPublicKey) {
        if (externalLimit > 0) {
          addresses.external = getAddressesInRange(
            extendedPublicKey.key,
            provXP,
            false,
            externalStart,
            externalLimit,
          );
        }

        if (internalLimit > 0) {
          addresses.internal = getAddressesInRange(
            extendedPublicKey.key,
            provXP,
            true,
            internalStart,
            internalLimit,
          );
        }
      }
    } else {
      const walletId =
        activeAccount && 'walletId' in activeAccount
          ? activeAccount.walletId
          : undefined;
      if (walletId) {
        const accountsInWallet =
          await this.accountsService.getPrimaryAccountsByWalletId(walletId);

        addresses.external = accountsInWallet
          .map((account) =>
            this.#removePrefixedAddress(account.addressPVM ?? ''),
          )
          .filter(Boolean);
      } else {
        const xpAddress = this.#removePrefixedAddress(
          activeAccount?.addressPVM ?? '',
        );
        addresses.external = xpAddress ? [xpAddress] : [];
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

      if (
        await canSkipApproval(request.site.domain, request.site.tabId, {
          domainWhitelist: EXPOSED_DOMAINS,
          allowInactiveTabs: true,
        })
      ) {
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
    onSuccess,
  ) => {
    onSuccess(pendingAction.displayData.addresses);
  };
}
