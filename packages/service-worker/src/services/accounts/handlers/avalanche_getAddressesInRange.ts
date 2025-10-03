import {
  canSkipApproval,
  getAddressesInRange,
  getAddressesInRangeForSeedless,
  KNOWN_CORE_DOMAINS,
} from '@core/common';
import {
  AccountType,
  Action,
  AVALANCHE_BASE_DERIVATION_PATH,
  DAppProviderRequest,
  DAppRequestHandler,
  DEFERRED_RESPONSE,
  GetAddressesInRangeDisplayData,
  GetAddressesInRangeResponse,
  SecretType,
} from '@core/types';
import { ethErrors } from 'eth-rpc-errors';
import { injectable } from 'tsyringe';
import { openApprovalWindow } from '~/runtime/openApprovalWindow';
import { NetworkService } from '../../network/NetworkService';
import { SecretsService } from '../../secrets/SecretsService';
import { getExtendedPublicKey } from '../../secrets/utils';
import { AccountsService } from '../AccountsService';
import { SeedlessTokenStorage } from '../../seedless/SeedlessTokenStorage';

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
    console.log('🔍 #getAddresses called with:', {
      internalStart,
      internalLimit,
      externalStart,
      externalLimit,
    });
    const provXP = await this.networkService.getAvalanceProviderXP();
    const activeAccount = await this.accountsService.getActiveAccount();
    console.log('🔍 activeAccount:', activeAccount);
    const secrets =
      await this.secretsService.getPrimaryAccountSecrets(activeAccount);
    console.log('🔍 secrets:', secrets);

    const addresses: { external: string[]; internal: string[] } = {
      external: [],
      internal: [],
    };

    if (!secrets) {
      console.log('🔍 No secrets, returning empty addresses');
      return addresses;
    }

    if ('extendedPublicKeys' in secrets) {
      const extendedPublicKey = getExtendedPublicKey(
        secrets.extendedPublicKeys,
        AVALANCHE_BASE_DERIVATION_PATH,
        'secp256k1',
      );
      console.log('extendedPublicKey', extendedPublicKey);
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
        activeAccount?.type === AccountType.PRIMARY
          ? activeAccount.walletId
          : undefined;
      console.log('walletId', walletId);
      if (walletId) {
        const walletSecrets =
          await this.secretsService.getSecretsById(walletId);
        console.log('walletSecrets', walletSecrets);
        if (walletSecrets?.secretType === SecretType.Seedless) {
          const storage = new SeedlessTokenStorage(this.secretsService);

          addresses.external = await getAddressesInRangeForSeedless(
            storage,
            !this.networkService.isMainnet(),
            externalStart,
            externalLimit,
          );
        }
      }
    }

    return addresses;
  };

  handleAuthenticated = async ({ request, scope }) => {
    console.log('🔍 handleAuthenticated called with request:', request);
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
