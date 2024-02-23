import { container } from 'tsyringe';
import { Avalanche, DerivationPath } from '@avalabs/wallets-sdk';

import { CallbackManager } from '@src/background/runtime/CallbackManager';

import {
  Account,
  AccountType,
  ImportType,
  PrimaryAccount,
} from '../accounts/models';
import { NetworkService } from '../network/NetworkService';
import { StorageService } from '../storage/StorageService';
import { PubKeyType, WALLET_STORAGE_KEY } from '../wallet/models';

import { SecretType } from './models';
import { SecretsService } from './SecretsService';

jest.mock('../storage/StorageService');
jest.mock('../network/NetworkService');
jest.mock('@avalabs/wallets-sdk');
jest.mock('tsyringe', () => {
  const tsyringe = jest.requireActual('tsyringe');

  return {
    ...tsyringe,
    container: {
      ...tsyringe.container,
      resolve: jest.fn(),
    },
  };
});

const ACTIVE_WALLET_ID = 'active-wallet-id';
describe('src/background/services/secrets/SecretsService.ts', () => {
  const storageService = jest.mocked(new StorageService({} as CallbackManager));
  const networkService = jest.mocked(new NetworkService(storageService));
  const activeAccount = {
    type: AccountType.PRIMARY,
  } as PrimaryAccount;

  let secretsService: SecretsService;
  let getDefaultFujiProviderMock: jest.Mock;
  let getAddressMock: jest.Mock;

  beforeEach(() => {
    jest.resetAllMocks();
    jest.mocked(container.resolve).mockReturnValue({
      activeAccount,
      getActiveWalletId: jest.fn().mockReturnValue(ACTIVE_WALLET_ID),
    });
    getAddressMock = jest.fn().mockImplementation((pubkey, chain) => {
      return `${chain}-`;
    });

    getDefaultFujiProviderMock = jest.fn().mockReturnValue({
      getAddress: getAddressMock,
    });

    Avalanche.JsonRpcProvider = {
      getDefaultFujiProvider: getDefaultFujiProviderMock,
    } as any;

    networkService.getAvalanceProviderXP.mockReturnValue(
      getDefaultFujiProviderMock()
    );

    secretsService = new SecretsService(storageService);
  });

  const mockMnemonicWallet = (
    additionalData = {},
    account?: Partial<Account>
  ) => {
    if (account) {
      jest.mocked(container.resolve).mockReturnValue({
        activeAccount: account,
        getActiveWalletId: jest.fn().mockReturnValue(ACTIVE_WALLET_ID),
      });
    }
    const data = {
      wallets: [
        {
          secretType: SecretType.Mnemonic,
          mnemonic: 'mnemonic',
          xpub: 'xpub',
          xpubXP: 'xpubXP',
          derivationPath: DerivationPath.BIP44,
          id: ACTIVE_WALLET_ID,
        },
      ],
      ...additionalData,
    };
    //as Wallet
    jest.spyOn(storageService, 'load').mockResolvedValue(data);

    return data;
  };

  const mockKeystoneWallet = (
    additionalData = {},
    account?: Partial<Account>
  ) => {
    if (account) {
      jest.mocked(container.resolve).mockReturnValueOnce({
        activeAccount: account,
        getActiveWalletId: jest.fn().mockReturnValue(ACTIVE_WALLET_ID),
      });
    }

    const data = {
      wallets: [
        {
          secretType: SecretType.Keystone,
          masterFingerprint: 'masterFingerprint',
          xpub: 'xpub',
          derivationPath: DerivationPath.BIP44,
          id: ACTIVE_WALLET_ID,
          ...additionalData,
        },
      ],
    };
    jest.spyOn(storageService, 'load').mockResolvedValue(data);

    return data;
  };

  const mockLedgerWallet = (
    additionalData = {},
    account?: Partial<Account>
  ) => {
    if (account) {
      jest.mocked(container.resolve).mockReturnValueOnce({
        activeAccount: account,
        getActiveWalletId: jest.fn().mockReturnValue(ACTIVE_WALLET_ID),
      });
    }

    const data = {
      wallets: [
        {
          xpub: 'xpub',
          xpubXP: 'xpubXP',
          derivationPath: DerivationPath.BIP44,
          id: ACTIVE_WALLET_ID,
          secretType: SecretType.Ledger,
          ...additionalData,
        },
      ],
    };
    jest.spyOn(storageService, 'load').mockResolvedValue(data);

    return data;
  };

  const mockLedgerLiveWallet = (
    additionalData = {},
    account?: Partial<Account>
  ) => {
    if (account) {
      jest.mocked(container.resolve).mockReturnValue({
        activeAccount: account,
        getActiveWalletId: jest.fn().mockReturnValue(ACTIVE_WALLET_ID),
      });
    }

    const data = {
      wallets: [
        {
          derivationPath: DerivationPath.LedgerLive,
          pubKeys: [{ evm: 'evm', xp: 'xp' }],
          id: ACTIVE_WALLET_ID,
          secretType: SecretType.LedgerLive,
          ...additionalData,
        },
      ],
    };

    jest.spyOn(storageService, 'load').mockResolvedValue(data);

    return data;
  };

  describe('getPrimaryAccountSecrets', () => {
    it('returns null if no secrets are saved', async () => {
      storageService.load.mockResolvedValue(null);

      await expect(secretsService.getPrimaryAccountSecrets()).resolves.toBe(
        null
      );
    });

    it('should return the wallet object', async () => {
      storageService.load.mockResolvedValue({
        wallets: [{ key: 'some-unknown-secret' }],
      });

      await expect(secretsService.getPrimaryAccountSecrets()).resolves.toEqual({
        key: 'some-unknown-secret',
      });
    });
  });

  describe('addSecrets()', () => {
    it('should save a new wallet to the `wallets` array', async () => {
      const uuid = 'uuid';
      (crypto.randomUUID as jest.Mock).mockReturnValueOnce(uuid);
      const existingWallets = [
        {
          isActive: true,
        },
      ];
      const existingSecrets = {
        xpub: 'xpub',
        wallets: existingWallets,
      };
      storageService.load.mockResolvedValue(existingSecrets);
      await secretsService.addSecrets({
        mnemonic: 'mnemonic',
        secretType: SecretType.Mnemonic,
        derivationPath: DerivationPath.BIP44,
        xpub: 'xpib',
        xpubXP: 'xpubXP',
      });
      expect(storageService.save).toHaveBeenCalledWith(WALLET_STORAGE_KEY, {
        ...existingSecrets,
        wallets: [
          { ...existingSecrets.wallets[0] },
          {
            id: uuid,
            mnemonic: 'mnemonic',
            secretType: SecretType.Mnemonic,
            derivationPath: DerivationPath.BIP44,
            xpub: 'xpib',
            xpubXP: 'xpubXP',
          },
        ],
      });
    });
  });
  describe('updateSecrets', () => {
    it('does not implicitly remove existing secrets in storage', async () => {
      const existingSecrets = {
        xpub: 'xpub',
        wallets: [
          {
            id: ACTIVE_WALLET_ID,
          },
        ],
      };
      storageService.load.mockResolvedValue(existingSecrets);

      await secretsService.updateSecrets(
        { xpubXP: 'xpubXP' },
        ACTIVE_WALLET_ID
      );

      expect(storageService.save).toHaveBeenCalledWith(WALLET_STORAGE_KEY, {
        ...existingSecrets,
        wallets: [{ ...existingSecrets.wallets[0], xpubXP: 'xpubXP' }],
      });
    });
  });

  describe('deleteSecrets()', () => {
    it('should remove the secrets from the storage', async () => {
      const tempWalletId = 'removable-wallet-id';
      const existingSecrets = {
        wallets: [
          {
            id: ACTIVE_WALLET_ID,
          },
          {
            id: tempWalletId,
          },
        ],
      };
      storageService.load.mockResolvedValue(existingSecrets);
      await secretsService.deleteSecrets(tempWalletId);

      expect(storageService.save).toHaveBeenCalledWith(WALLET_STORAGE_KEY, {
        ...existingSecrets,
        wallets: [{ ...existingSecrets.wallets[0] }],
      });
    });
  });

  describe('getActiveAccountSecrets', () => {
    it('throws error if no secrets are saved', async () => {
      storageService.load.mockResolvedValue(null);

      await expect(
        secretsService.getActiveAccountSecrets()
      ).rejects.toThrowError('Wallet is not initialized');
    });

    describe('when no account is active', () => {
      beforeEach(() => {
        mockLedgerLiveWallet();

        jest.mocked(container.resolve).mockReturnValue({
          activeAccount: undefined,
          getActiveWalletId: jest.fn().mockReturnValue(ACTIVE_WALLET_ID),
        });
      });

      it('returns the primary secrets with no account attached', async () => {
        const result = await secretsService.getActiveAccountSecrets();

        expect('account' in result).toBe(false);
        expect(result.secretType).toBe(SecretType.LedgerLive);
      });
    });

    describe('when a primary account is active', () => {
      const account = {
        type: AccountType.PRIMARY,
        index: 0,
      };

      beforeEach(() => {
        jest.mocked(container.resolve).mockReturnValue({
          activeAccount: account,
          getActiveWalletId: jest.fn().mockReturnValue(ACTIVE_WALLET_ID),
        });
      });

      it('attaches the account object to the result', async () => {
        mockMnemonicWallet();
        const result = await secretsService.getActiveAccountSecrets();

        expect(result.account).toBe(account);
      });

      it('recognizes mnemonic wallets', async () => {
        const secrets = mockMnemonicWallet();
        const result = await secretsService.getActiveAccountSecrets();
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { ...rest } = secrets.wallets[0];
        expect(result).toEqual({
          account,
          ...rest,
          id: ACTIVE_WALLET_ID,
        });
      });

      it('recognizes Ledger + BIP44 wallets', async () => {
        const secrets = mockLedgerWallet();
        const result = await secretsService.getActiveAccountSecrets();

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { ...rest } = secrets.wallets[0];
        expect(result).toEqual({
          account,
          btcWalletPolicyDetails: undefined,
          ...rest,
          secretType: SecretType.Ledger,
          id: ACTIVE_WALLET_ID,
        });
      });

      it('recognizes Ledger + LedgerLive wallets', async () => {
        const secrets = mockLedgerLiveWallet();
        const result = await secretsService.getActiveAccountSecrets();

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { ...rest } = secrets.wallets[0];
        expect(result).toEqual({
          account,
          ...rest,
          secretType: SecretType.LedgerLive,
          id: ACTIVE_WALLET_ID,
        });
      });

      it('recognizes Keystone wallets', async () => {
        const secrets = mockKeystoneWallet();
        const result = await secretsService.getActiveAccountSecrets();

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { ...rest } = secrets.wallets[0];
        expect(result).toEqual({
          account,
          ...rest,
          id: ACTIVE_WALLET_ID,
        });
      });
    });

    describe('when a PrivateKey-imported account is active', () => {
      const secrets = {
        secretType: SecretType.PrivateKey,
        secret: 'secret',
      };
      const account = {
        type: AccountType.IMPORTED,
        id: 'abcd1234',
      };

      beforeEach(() => {
        jest.mocked(container.resolve).mockReturnValue({
          activeAccount: account,
          getActiveWalletId: jest.fn().mockReturnValue(ACTIVE_WALLET_ID),
        });
        mockMnemonicWallet({
          importedAccounts: {
            [account.id]: secrets,
          },
        });
      });

      it(`returns the imported account's secrets along with the account`, async () => {
        const result = await secretsService.getActiveAccountSecrets();

        expect(result).toEqual({
          secret: 'secret',
          secretType: SecretType.PrivateKey,
          account,
        });
      });
    });
  });

  describe('getImportedAccountSecrets', () => {
    it('recognizes PrivateKey imports', async () => {
      mockMnemonicWallet({
        importedAccounts: {
          pk1: {
            secretType: SecretType.PrivateKey,
            secret: 'secret',
          },
        },
      });

      expect(await secretsService.getImportedAccountSecrets('pk1')).toEqual({
        secretType: SecretType.PrivateKey,
        secret: 'secret',
      });
    });

    it('recognizes WalletConnect imports', async () => {
      const wcData = {
        secretType: SecretType.WalletConnect,
        pubKey: { evm: 'evm', xp: 'xp' },
        addresses: { addressC: 'addressC' },
      };
      mockMnemonicWallet({
        importedAccounts: {
          wc1: wcData,
        },
      });

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { secretType, ...rest } = wcData;
      expect(await secretsService.getImportedAccountSecrets('wc1')).toEqual({
        ...rest,
        secretType: SecretType.WalletConnect,
      });
    });

    it('recognizes Fireblocks imports', async () => {
      const fbData = {
        secretType: SecretType.Fireblocks,
        api: {
          key: 'key',
          secret: 'secret',
        },
        addresses: { addressC: 'addressC' },
      };
      mockMnemonicWallet({
        importedAccounts: {
          fb1: fbData,
        },
      });

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { secretType, ...rest } = fbData;
      expect(await secretsService.getImportedAccountSecrets('fb1')).toEqual({
        ...rest,
        secretType: SecretType.Fireblocks,
      });
    });
  });

  describe('saveImportedWallet', () => {
    const fbAcc = {
      type: ImportType.FIREBLOCKS,
      api: {
        key: 'key',
        secret: 'secret',
      },
      addresses: { addressC: 'addressC' },
    };
    let secrets;

    beforeEach(() => {
      secrets = mockMnemonicWallet({
        importedAccounts: {
          fbAcc,
        },
      });
    });

    it('adds new wallet data to storage', async () => {
      const pkAcc = {
        secretType: SecretType.PrivateKey,
        secret: 'secret',
      } as const;

      await secretsService.saveImportedWallet('pkAcc', pkAcc);

      secrets;

      expect(storageService.save).toHaveBeenCalledWith(WALLET_STORAGE_KEY, {
        wallets: [
          {
            ...secrets.wallets[0],
          },
        ],
        importedAccounts: {
          ...secrets.importedAccounts,
          pkAcc,
        },
      });
    });
  });

  describe('deleteImportedWallets', () => {
    const pkAcc = {
      secretType: SecretType.PrivateKey,
      secret: 'secret',
    };
    const wcAcc = {
      secretType: SecretType.WalletConnect,
      pubKey: { evm: 'evm', xp: 'xp' },
      addresses: { addressC: 'addressC' },
    };
    const fbAcc = {
      secretType: SecretType.Fireblocks,
      api: {
        key: 'key',
        secret: 'secret',
      },
      addresses: { addressC: 'addressC' },
    };
    let secrets;

    beforeEach(() => {
      secrets = mockMnemonicWallet({
        importedAccounts: {
          pkAcc,
          wcAcc,
          fbAcc,
        },
      });
    });

    it('removes specified wallet data from storage', async () => {
      const result = await secretsService.deleteImportedWallets([
        'pkAcc',
        'fbAcc',
      ]);

      expect(result).toEqual({
        pkAcc,
        fbAcc,
      });
      const { mnemonic, xpub, xpubXP, derivationPath, id } = secrets.wallets[0];
      expect(storageService.save).toHaveBeenCalledWith(WALLET_STORAGE_KEY, {
        wallets: [
          {
            derivationPath,
            mnemonic,
            secretType: SecretType.Mnemonic,
            xpub,
            xpubXP,
            id,
          },
        ],
        importedAccounts: {
          wcAcc,
        },
      });
    });
  });

  describe('when a WalletConnect-imported account is active', () => {
    const secrets = {
      secretType: SecretType.WalletConnect,
      addresses: {
        addressC: 'addressC',
        addressBTC: 'addressBTC',
      },
      pubKey: {
        evm: 'evm',
        xp: 'xp',
      },
    };
    const account = {
      type: AccountType.WALLET_CONNECT,
      id: 'wc-1234',
    };

    beforeEach(() => {
      jest.mocked(container.resolve).mockReturnValue({
        activeAccount: account,
        getActiveWalletId: jest.fn().mockReturnValue(ACTIVE_WALLET_ID),
      });
      mockMnemonicWallet({
        importedAccounts: {
          [account.id]: secrets,
        },
      });
    });

    it(`returns the imported account's secrets along with the account`, async () => {
      const result = await secretsService.getActiveAccountSecrets();

      expect(result).toEqual({
        addresses: { ...secrets.addresses },
        pubKey: { ...secrets.pubKey },
        secretType: SecretType.WalletConnect,
        account,
      });
    });
  });

  describe('when a Fireblocks-imported account is active', () => {
    const secrets = {
      secretType: SecretType.Fireblocks,
      addresses: {
        addressC: 'addressC',
        addressBTC: 'addressBTC',
      },
      api: {
        key: 'key',
        secret: 'secret',
      },
    };
    const account = {
      type: AccountType.FIREBLOCKS,
      id: 'fb-1234',
    };

    beforeEach(() => {
      jest.mocked(container.resolve).mockReturnValue({
        activeAccount: account,
        getActiveWalletId: jest.fn().mockReturnValue(ACTIVE_WALLET_ID),
      });
      mockMnemonicWallet({
        importedAccounts: {
          [account.id]: secrets,
        },
      });
    });

    it(`returns the imported account's secrets along with the account`, async () => {
      const result = await secretsService.getActiveAccountSecrets();

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { secretType, ...rest } = secrets;
      expect(result).toEqual({
        ...rest,
        secretType: SecretType.Fireblocks,
        account,
      });
    });
  });

  describe('getBtcWalletPolicyDetails', () => {
    const btcWalletPolicyDetails = {
      hmacHex: '0x1',
      xpub: '0x2',
      masterFingerprint: '1234',
      name: 'policy',
    };

    it('returns undefined if wallet type is not Ledger', async () => {
      mockMnemonicWallet();

      await expect(
        secretsService.getBtcWalletPolicyDetails()
      ).resolves.toBeUndefined();
    });

    it('returns the policy details correctly for Ledger Live', async () => {
      mockLedgerLiveWallet(
        {
          pubKeys: [
            null,
            {
              btcWalletPolicyDetails,
            } as PubKeyType,
          ],
        },
        { type: AccountType.PRIMARY, index: 1 }
      );

      await expect(secretsService.getBtcWalletPolicyDetails()).resolves.toEqual(
        {
          accountIndex: 1,
          details: btcWalletPolicyDetails,
        }
      );
    });

    it('returns the policy details correctly for Ledger + BIP44', async () => {
      mockLedgerWallet({
        btcWalletPolicyDetails,
      });

      await expect(secretsService.getBtcWalletPolicyDetails()).resolves.toEqual(
        {
          accountIndex: 0,
          details: btcWalletPolicyDetails,
        }
      );
    });
  });

  describe('isKnownSecret', () => {
    it('returns true when seed phrase is already stored', async () => {
      mockMnemonicWallet();

      expect(
        await secretsService.isKnownSecret(SecretType.Mnemonic, 'mnemonic')
      ).toBe(true);

      expect(
        await secretsService.isKnownSecret(SecretType.Mnemonic, 'cinomenm')
      ).toBe(false);
    });
  });

  describe('storeBtcWalletPolicyDetails', () => {
    const hmacHex = '0x1';
    const xpub = '0x2';
    const masterFingerprint = '1234';
    const name = 'policy';

    beforeEach(() => {
      jest.mocked(container.resolve).mockReturnValue({
        activeAccount: { type: AccountType.PRIMARY, index: 0 },
        getActiveWalletId: jest.fn().mockReturnValue(ACTIVE_WALLET_ID),
      });
    });

    const storeBtcWalletPolicyDetails = async () =>
      secretsService.storeBtcWalletPolicyDetails(
        xpub,
        masterFingerprint,
        hmacHex,
        name,
        ACTIVE_WALLET_ID
      );

    it('throws if wallet type is not Ledger', async () => {
      mockMnemonicWallet();

      await expect(storeBtcWalletPolicyDetails()).rejects.toThrowError(
        'Error while saving wallet policy details: incorrect wallet type.'
      );
    });

    it('throws if storage is empty', async () => {
      await expect(storeBtcWalletPolicyDetails()).rejects.toThrowError(
        'Wallet is not initialized'
      );
    });

    describe('Derivation path: Ledger Live', () => {
      it('throws if storage is empty for the given index', async () => {
        mockLedgerLiveWallet({
          pubKeys: [],
        });

        await expect(storeBtcWalletPolicyDetails()).rejects.toThrowError(
          'Error while saving wallet policy details: missing record for the provided index.'
        );
      });

      it('throws if storage already contains policy info for the given index', async () => {
        mockLedgerLiveWallet({
          pubKeys: [
            {
              btcWalletPolicyDetails: {},
            },
          ],
        });

        await expect(storeBtcWalletPolicyDetails()).rejects.toThrowError(
          'Error while saving wallet policy details: policy details already stored.'
        );
      });

      it('stores the policy details correctly', async () => {
        const existingSecrets = mockLedgerLiveWallet({
          pubKeys: [
            {
              evm: '0x1',
              xp: '0x2',
            },
          ],
        });

        await storeBtcWalletPolicyDetails();

        expect(storageService.save).toHaveBeenCalledWith(WALLET_STORAGE_KEY, {
          wallets: [
            {
              derivationPath: existingSecrets.wallets[0]?.derivationPath,
              id: ACTIVE_WALLET_ID,
              secretType: SecretType.LedgerLive,
              pubKeys: [
                {
                  ...existingSecrets.wallets[0]?.pubKeys[0],
                  btcWalletPolicyDetails: {
                    xpub,
                    masterFingerprint,
                    hmacHex,
                    name,
                  },
                },
              ],
            },
          ],
        });
      });
    });

    describe('Derivation path: BIP44', () => {
      it('throws if storage is already contains policy', async () => {
        mockLedgerWallet({
          btcWalletPolicyDetails: {},
        });

        await expect(storeBtcWalletPolicyDetails()).rejects.toThrowError(
          'Error while saving wallet policy details: policy details already stored.'
        );
      });

      it('stores the policy details correctly', async () => {
        const existingSecrets = mockLedgerWallet();

        await storeBtcWalletPolicyDetails();

        expect(storageService.save).toHaveBeenCalledWith(WALLET_STORAGE_KEY, {
          wallets: [
            {
              id: ACTIVE_WALLET_ID,
              derivationPath: existingSecrets.wallets[0]?.derivationPath,
              btcWalletPolicyDetails: {
                xpub,
                masterFingerprint,
                hmacHex,
                name,
              },
              xpub: existingSecrets.wallets[0]?.xpub,
              xpubXP: existingSecrets.wallets[0]?.xpubXP,
              secretType: SecretType.Ledger,
            },
          ],
        });
      });
    });
  });
});
