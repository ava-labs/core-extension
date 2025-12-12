import { AccountType, SecretType, DAppProviderRequest } from '@core/types';
import { AvalancheGetAccountsHandler } from './avalanche_getAccounts';
import { buildRpcCall } from '@shared/tests/test-utils';
import { SecretsService } from '../../secrets/SecretsService';
import { AccountsService } from '../AccountsService';
import { getAvalancheExtendedKeyPath } from '@core/common';

jest.mock('../../secrets/SecretsService');
jest.mock('../../network/NetworkService');
jest.mock('../AccountsService');

describe('background/services/accounts/handlers/avalanche_getAccounts.ts', () => {
  const accounts = {
    active: {
      index: 1,
      id: 'uuid2',
      addressC: '0x11111eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
      addressCoreEth: 'C-11111eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
      type: AccountType.PRIMARY,
    },
    primary: {
      ['walletId1']: [
        {
          index: 0,
          id: 'uuid1',
          addressC: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
          addressCoreEth: 'C-eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
          addressAVM: 'X-eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
          addressPVM: 'P-eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
          type: AccountType.PRIMARY,
        },
        {
          index: 1,
          id: 'uuid2',
          addressC: '0x11111eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
          addressCoreEth: 'C-11111eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
          addressAVM: 'X-11111eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
          addressPVM: 'P-11111eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
          type: AccountType.PRIMARY,
        },
        {
          index: 2,
          id: 'uuid3',
          addressC: '0x222222eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
          addressCoreEth: 'C-222222eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
          addressAVM: 'X-222222eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
          addressPVM: 'P-222222eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
          type: AccountType.PRIMARY,
        },
      ],
      ['walletId2']: [
        {
          index: 1,
          id: 'walletId2-uuid1',
          addressC: '0xwalletId2-eeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
          addressCoreEth: 'C-walletId2-eeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
          addressAVM: 'X-walletId2-eeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
          addressPVM: 'P-walletId2-eeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
          type: AccountType.PRIMARY,
        },
      ],
      ['walletId3']: [
        {
          index: 0,
          id: 'walletId3-uuid1',
          addressC: '0xwalletId3-eeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
          addressPVM: 'P-seedless',
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
  const addressResolver = {
    getXPAddressesForAccountIndex: jest.fn(),
  } as any;
  const request = {
    id: '123',
    method: DAppProviderRequest.AVALANCHE_GET_ACCOUNTS,
  } as const;

  beforeEach(() => {
    jest.resetAllMocks();
    jest
      .mocked(addressResolver.getXPAddressesForAccountIndex)
      .mockImplementation((walletId) =>
        walletId === 'walletId3'
          ? Promise.resolve({
              externalAddresses: [
                {
                  address: 'seedless1',
                  index: 0,
                },
                {
                  address: 'seedless2',
                  index: 1,
                },
              ],
              internalAddresses: [],
            })
          : Promise.resolve({
              externalAddresses: [],
              internalAddresses: [],
            }),
      );
    jest
      .mocked(secretsService.getSecretsById)
      .mockResolvedValueOnce({
        id: 'walletId1',
        secretType: SecretType.Mnemonic,
        name: 'Mnemonic Wallet',
        extendedPublicKeys: [
          {
            key: 'xpubXP0',
            derivationPath: getAvalancheExtendedKeyPath(0),
            curve: 'secp256k1',
            type: 'extended-pubkey',
          },
          {
            key: 'xpubXP1',
            derivationPath: getAvalancheExtendedKeyPath(1),
            curve: 'secp256k1',
            type: 'extended-pubkey',
          },
          {
            key: 'xpubXP2',
            derivationPath: getAvalancheExtendedKeyPath(2),
            curve: 'secp256k1',
            type: 'extended-pubkey',
          },
        ],
        publicKeys: [],
      } as any)
      .mockResolvedValueOnce({
        id: 'walletId2',
        secretType: SecretType.LedgerLive,
        name: 'My Ledger Wallet',
        publicKeys: [],
        extendedPublicKeys: [],
      } as any)
      .mockResolvedValueOnce({
        id: 'walletId3',
        secretType: SecretType.Seedless,
        name: 'My Seedless Wallet',
        publicKeys: [
          {
            curve: 'secp256k1',
            derivationPath: `m/44'/9000'/0'/0/0`,
            key: 'abcdef01',
          },
          {
            curve: 'secp256k1',
            derivationPath: `m/44'/9000'/0'/0/1`,
            key: 'abcdef02',
          },
        ],
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
      addressResolver,
    );
    const result = await handler.handleAuthenticated(buildRpcCall(request));

    expect(result).toEqual({
      ...request,
      result: [
        {
          index: 0,
          id: 'uuid1',
          addressC: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
          addressAVM: 'X-eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
          addressPVM: 'P-eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
          addressBTC: undefined,
          addressCoreEth: 'C-eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
          addressSVM: undefined,
          type: AccountType.PRIMARY,
          name: undefined,
          walletId: 'walletId1',
          xpAddresses: [],
          walletType: SecretType.Mnemonic,
          walletName: 'Mnemonic Wallet',
          active: false,
          xpubXP: 'xpubXP0',
        },
        {
          index: 1,
          id: 'uuid2',
          addressC: '0x11111eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
          addressAVM: 'X-11111eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
          addressPVM: 'P-11111eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
          addressBTC: undefined,
          addressCoreEth: 'C-11111eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
          addressSVM: undefined,
          type: AccountType.PRIMARY,
          name: undefined,
          walletId: 'walletId1',
          xpAddresses: [],
          walletType: SecretType.Mnemonic,
          walletName: 'Mnemonic Wallet',
          active: true,
          xpubXP: 'xpubXP1',
        },
        {
          index: 2,
          id: 'uuid3',
          addressC: '0x222222eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
          addressAVM: 'X-222222eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
          addressPVM: 'P-222222eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
          addressBTC: undefined,
          addressCoreEth: 'C-222222eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
          addressSVM: undefined,
          type: AccountType.PRIMARY,
          name: undefined,
          walletId: 'walletId1',
          xpAddresses: [],
          walletType: SecretType.Mnemonic,
          walletName: 'Mnemonic Wallet',
          active: false,
          xpubXP: 'xpubXP2',
        },
        {
          active: false,
          addressC: '0xwalletId2-eeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
          addressAVM: 'X-walletId2-eeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
          addressPVM: 'P-walletId2-eeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
          addressBTC: undefined,
          addressCoreEth: 'C-walletId2-eeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
          addressSVM: undefined,
          id: 'walletId2-uuid1',
          walletId: 'walletId2',
          xpAddresses: [],
          index: 1,
          name: undefined,
          type: AccountType.PRIMARY,
          walletName: 'My Ledger Wallet',
          walletType: SecretType.LedgerLive,
          xpubXP: undefined,
        },
        {
          index: 0,
          active: false,
          addressC: '0xwalletId3-eeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
          addressPVM: 'P-seedless',
          addressAVM: undefined,
          addressBTC: undefined,
          addressCoreEth: undefined,
          addressSVM: undefined,
          id: 'walletId3-uuid1',
          walletId: 'walletId3',
          type: AccountType.PRIMARY,
          walletName: 'My Seedless Wallet',
          walletType: SecretType.Seedless,
          xpubXP: undefined,
          xpAddresses: [
            {
              address: 'seedless1',
              index: 0,
            },
            {
              address: 'seedless2',
              index: 1,
            },
          ],
        },
        {
          active: false,
          addressC: '0ximportedeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
          addressAVM: undefined,
          addressPVM: undefined,
          addressBTC: '',
          addressCoreEth: '',
          addressSVM: undefined,
          name: undefined,
          id: 'imported-uuid3',
          type: 'imported',
          xpubXP: undefined,
          xpAddresses: [],
        },
      ],
    });
  });

  it('handleUnauthenticated', async () => {
    const handler = new AvalancheGetAccountsHandler(
      accountsService,
      secretsService,
      addressResolver,
    );
    const result = await handler.handleUnauthenticated(buildRpcCall(request));

    expect(result).toEqual({
      ...request,
      error: 'account not connected',
    });
  });
});
