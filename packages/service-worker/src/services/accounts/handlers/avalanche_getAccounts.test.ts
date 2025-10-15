import {
  AccountType,
  SecretType,
  DAppProviderRequest,
  AVALANCHE_BASE_DERIVATION_PATH,
} from '@core/types';
import { AvalancheGetAccountsHandler } from './avalanche_getAccounts';
import { buildRpcCall } from '@shared/tests/test-utils';
import { SecretsService } from '../../secrets/SecretsService';
import { AccountsService } from '../AccountsService';

jest.mock('../../secrets/SecretsService');
jest.mock('../AccountsService');

describe('background/services/accounts/handlers/avalanche_getAccounts.ts', () => {
  const accounts = {
    active: {
      index: 2,
      id: 'uuid2',
      addressC: '0x11111eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
      type: AccountType.PRIMARY,
    },
    primary: {
      ['walletId1']: [
        {
          index: 1,
          id: 'uuid1',
          addressC: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
          type: AccountType.PRIMARY,
        },
        {
          index: 2,
          id: 'uuid2',
          addressC: '0x11111eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
          type: AccountType.PRIMARY,
        },
        {
          id: 'uuid3',
          addressC: '0x222222eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
          type: AccountType.PRIMARY,
        },
      ],
      ['walletId2']: [
        {
          index: 1,
          id: 'walletId2-uuid1',
          addressC: '0xwalletId2-eeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
          type: AccountType.PRIMARY,
        },
      ],
    },
    imported: {
      'imported-uuid3': {
        id: 'imported-uuid3',
        addressC: '0ximportedeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
        type: AccountType.IMPORTED,
      },
    },
  };

  const accountsService = new AccountsService(
    {} as any,
    {} as any,
    {} as any,
    {} as any,
    {} as any,
    {} as any,
    {} as any,
    {} as any,
  );

  const secretsService = new SecretsService({} as any);
  const request = {
    id: '123',
    method: DAppProviderRequest.AVALANCHE_GET_ACCOUNTS,
  } as const;

  beforeEach(() => {
    jest.resetAllMocks();
    jest
      .mocked(secretsService.getSecretsById)
      .mockResolvedValueOnce({
        secretType: SecretType.Mnemonic,
        name: 'Mnemonic Wallet',
        extendedPublicKeys: [
          {
            key: 'xpubXP',
            derivationPath: AVALANCHE_BASE_DERIVATION_PATH,
            curve: 'secp256k1',
            type: 'extended-pubkey',
          },
        ],
      } as any)
      .mockResolvedValue({
        secretType: SecretType.LedgerLive,
        name: 'My Ledger Wallet',
      } as any);
    jest.mocked(secretsService.getImportedAccountSecrets).mockResolvedValue({
      secretType: SecretType.PrivateKey,
    } as any);
    jest.mocked(accountsService.getAccounts).mockResolvedValue(accounts as any);
  });

  it('handleAuthenticated', async () => {
    const handler = new AvalancheGetAccountsHandler(
      accountsService,
      secretsService,
    );
    const result = await handler.handleAuthenticated(buildRpcCall(request));

    expect(result).toEqual({
      ...request,
      result: [
        {
          index: 1,
          id: 'uuid1',
          addressC: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
          type: AccountType.PRIMARY,
          walletType: SecretType.Mnemonic,
          walletName: 'Mnemonic Wallet',
          active: false,
          xpubXP: 'xpubXP',
        },
        {
          index: 2,
          id: 'uuid2',
          addressC: '0x11111eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
          type: AccountType.PRIMARY,
          walletType: SecretType.Mnemonic,
          walletName: 'Mnemonic Wallet',
          active: true,
          xpubXP: 'xpubXP',
        },
        {
          id: 'uuid3',
          addressC: '0x222222eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
          type: AccountType.PRIMARY,
          walletType: SecretType.Mnemonic,
          walletName: 'Mnemonic Wallet',
          active: false,
          xpubXP: 'xpubXP',
        },
        {
          active: false,
          addressC: '0xwalletId2-eeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
          id: 'walletId2-uuid1',
          index: 1,
          type: AccountType.PRIMARY,
          walletName: 'My Ledger Wallet',
          walletType: SecretType.LedgerLive,
          xpubXP: undefined,
        },
        {
          active: false,
          addressC: '0ximportedeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
          id: 'imported-uuid3',
          type: 'imported',
          walletName: undefined,
          walletType: 'private-key',
          xpubXP: undefined,
        },
      ],
    });
  });

  it('handleUnauthenticated', async () => {
    const handler = new AvalancheGetAccountsHandler(
      accountsService,
      secretsService,
    );
    const result = await handler.handleUnauthenticated(buildRpcCall(request));

    expect(result).toEqual({
      ...request,
      error: 'account not connected',
    });
  });
});
