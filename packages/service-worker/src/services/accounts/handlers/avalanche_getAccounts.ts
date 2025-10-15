import {
  DAppRequestHandler,
  DAppProviderRequest,
  AVALANCHE_BASE_DERIVATION_PATH,
} from '@core/types';
import { injectable } from 'tsyringe';
import { AccountsService } from '../AccountsService';
import { SecretsService } from '../../secrets/SecretsService';
import { getExtendedPublicKey } from '~/services/secrets/utils';

@injectable()
export class AvalancheGetAccountsHandler extends DAppRequestHandler {
  methods = [DAppProviderRequest.AVALANCHE_GET_ACCOUNTS];

  constructor(
    private accountsService: AccountsService,
    private secretsService: SecretsService,
  ) {
    super();
  }

  handleAuthenticated = async ({ request }) => {
    const accounts = await this.accountsService.getAccounts();

    const mappedPrimaryAccounts = await Promise.all(
      Object.keys(accounts.primary).map(async (walletId) => {
        const walletAccounts = accounts.primary[walletId];
        if (!walletAccounts) {
          return [];
        }

        const secrets = await this.secretsService.getSecretsById(walletId);
        const xpubXP =
          'extendedPublicKeys' in secrets
            ? getExtendedPublicKey(
                secrets.extendedPublicKeys,
                AVALANCHE_BASE_DERIVATION_PATH,
                'secp256k1',
              )
            : null;

        return walletAccounts.map((acc) => {
          const active = accounts.active?.id === acc.id;
          return {
            ...acc,
            walletType: secrets.secretType,
            walletName: secrets?.name,
            xpubXP: xpubXP?.key,
            active,
          };
        });
      }),
    );

    const mappedImportedAccounts = await Promise.all(
      Object.values(accounts.imported).map(async (importedAccount) => {
        const secrets = await this.secretsService.getImportedAccountSecrets(
          importedAccount.id,
        );
        const active = accounts.active?.id === importedAccount.id;
        return {
          ...importedAccount,
          walletType: secrets.secretType,
          walletName: undefined,
          xpubXP: undefined,
          active,
        };
      }),
    );

    return {
      ...request,
      result: [...mappedPrimaryAccounts.flat(), ...mappedImportedAccounts],
    };
  };

  handleUnauthenticated = ({ request }) => {
    return {
      ...request,
      error: 'account not connected',
    };
  };
}
