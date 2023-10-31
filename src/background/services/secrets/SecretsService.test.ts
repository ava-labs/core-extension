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
jest.mock('../accounts/AccountsService');
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
    jest.mocked(container.resolve).mockReturnValue({ activeAccount });
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
      jest
        .mocked(container.resolve)
        .mockReturnValue({ activeAccount: account });
    }
    const data = {
      mnemonic: 'mnemonic',
      xpub: 'xpub',
      xpubXP: 'xpubXP',
      derivationPath: DerivationPath.BIP44,
      ...additionalData,
    };
    jest.spyOn(storageService, 'load').mockResolvedValue(data);

    return data;
  };

  const mockKeystoneWallet = (
    additionalData = {},
    account?: Partial<Account>
  ) => {
    if (account) {
      jest
        .mocked(container.resolve)
        .mockReturnValueOnce({ activeAccount: account });
    }

    const data = {
      masterFingerprint: 'masterFingerprint',
      xpub: 'xpub',
      derivationPath: DerivationPath.BIP44,
      ...additionalData,
    };
    jest.spyOn(storageService, 'load').mockResolvedValue(data);

    return data;
  };

  const mockLedgerWallet = (
    additionalData = {},
    account?: Partial<Account>
  ) => {
    if (account) {
      jest
        .mocked(container.resolve)
        .mockReturnValueOnce({ activeAccount: account });
    }

    const data = {
      xpub: 'xpub',
      xpubXP: 'xpubXP',
      derivationPath: DerivationPath.BIP44,
      ...additionalData,
    };
    jest.spyOn(storageService, 'load').mockResolvedValue(data);

    return data;
  };

  const mockLedgerLiveWallet = (
    additionalData = {},
    account?: Partial<Account>
  ) => {
    if (account) {
      jest
        .mocked(container.resolve)
        .mockReturnValue({ activeAccount: account });
    }

    const data = {
      derivationPath: DerivationPath.LedgerLive,
      pubKeys: [{ evm: 'evm', xp: 'xp' }],
      ...additionalData,
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

    it('throws error if secrets cannot be resolved', async () => {
      storageService.load.mockResolvedValue({ key: 'some-unknown-secret' });

      await expect(
        secretsService.getPrimaryAccountSecrets()
      ).rejects.toThrowError('Unknown secrets found for primary account');
    });
  });

  describe('updateSecrets', () => {
    it('throws if is used with `imported` key', async () => {
      await expect(
        secretsService.updateSecrets({ imported: {} })
      ).rejects.toThrowError(
        'Please use designated methods to manage imported wallets'
      );
    });

    it('does not implicitly remove existing secrets in storage', async () => {
      storageService.load.mockResolvedValue({
        xpub: 'xpub',
      });

      await secretsService.updateSecrets({ xpubXP: 'xpubXP' });

      expect(storageService.save).toHaveBeenCalledWith(WALLET_STORAGE_KEY, {
        xpub: 'xpub',
        xpubXP: 'xpubXP',
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
        });
      });

      it('returns the primary secrets with no account attached', async () => {
        const result = await secretsService.getActiveAccountSecrets();

        expect('account' in result).toBe(false);
        expect(result.type).toBe(SecretType.LedgerLive);
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

        expect(result).toEqual({
          type: SecretType.Mnemonic,
          account,
          ...secrets,
        });
      });

      it('recognizes Ledger + BIP44 wallets', async () => {
        const secrets = mockLedgerWallet();
        const result = await secretsService.getActiveAccountSecrets();

        expect(result).toEqual({
          type: SecretType.Ledger,
          account,
          ...secrets,
        });
      });

      it('recognizes Ledger + LedgerLive wallets', async () => {
        const secrets = mockLedgerLiveWallet();
        const result = await secretsService.getActiveAccountSecrets();

        expect(result).toEqual({
          type: SecretType.LedgerLive,
          account,
          ...secrets,
        });
      });

      it('recognizes Keystone wallets', async () => {
        const secrets = mockKeystoneWallet();
        const result = await secretsService.getActiveAccountSecrets();

        expect(result).toEqual({
          type: SecretType.Keystone,
          account,
          ...secrets,
        });
      });
    });

    describe('when a PrivateKey-imported account is active', () => {
      const secrets = {
        type: ImportType.PRIVATE_KEY,
        secret: 'secret',
      };
      const account = {
        type: AccountType.IMPORTED,
        id: 'abcd1234',
      };

      beforeEach(() => {
        jest.mocked(container.resolve).mockReturnValue({
          activeAccount: account,
        });
        mockMnemonicWallet({
          imported: {
            [account.id]: secrets,
          },
        });
      });

      it(`returns the imported account's secrets along with the account`, async () => {
        const result = await secretsService.getActiveAccountSecrets();

        expect(result).toEqual({
          ...secrets,
          type: SecretType.PrivateKey,
          account,
        });
      });
    });
  });

  describe('getImportedAccountSecrets', () => {
    it('recognizes PrivateKey imports', async () => {
      mockMnemonicWallet({
        imported: {
          pk1: {
            type: ImportType.PRIVATE_KEY,
            secret: 'secret',
          },
        },
      });

      expect(await secretsService.getImportedAccountSecrets('pk1')).toEqual({
        type: SecretType.PrivateKey,
        secret: 'secret',
      });
    });

    it('recognizes WalletConnect imports', async () => {
      const wcData = {
        type: ImportType.WALLET_CONNECT,
        pubKey: { evm: 'evm', xp: 'xp' },
        addresses: { addressC: 'addressC' },
      };
      mockMnemonicWallet({
        imported: {
          wc1: wcData,
        },
      });

      expect(await secretsService.getImportedAccountSecrets('wc1')).toEqual({
        ...wcData,
        type: SecretType.WalletConnect,
      });
    });

    it('recognizes Fireblocks imports', async () => {
      const fbData = {
        type: ImportType.FIREBLOCKS,
        api: {
          key: 'key',
          secret: 'secret',
        },
        addresses: { addressC: 'addressC' },
      };
      mockMnemonicWallet({
        imported: {
          fb1: fbData,
        },
      });

      expect(await secretsService.getImportedAccountSecrets('fb1')).toEqual({
        ...fbData,
        type: SecretType.Fireblocks,
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
        imported: {
          fbAcc,
        },
      });
    });

    it('adds new wallet data to storage', async () => {
      const pkAcc = {
        type: ImportType.PRIVATE_KEY,
        secret: 'secret',
      } as const;

      await secretsService.saveImportedWallet('pkAcc', pkAcc);

      expect(storageService.save).toHaveBeenCalledWith(WALLET_STORAGE_KEY, {
        ...secrets,
        imported: {
          fbAcc,
          pkAcc,
        },
      });
    });
  });

  describe('deleteImportedWallets', () => {
    const pkAcc = {
      type: ImportType.PRIVATE_KEY,
      secret: 'secret',
    };
    const wcAcc = {
      type: ImportType.WALLET_CONNECT,
      pubKey: { evm: 'evm', xp: 'xp' },
      addresses: { addressC: 'addressC' },
    };
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
        imported: {
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
      expect(storageService.save).toHaveBeenCalledWith(WALLET_STORAGE_KEY, {
        ...secrets,
        imported: {
          wcAcc,
        },
      });
    });
  });

  describe('when a WalletConnect-imported account is active', () => {
    const secrets = {
      type: ImportType.WALLET_CONNECT,
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
      });
      mockMnemonicWallet({
        imported: {
          [account.id]: secrets,
        },
      });
    });

    it(`returns the imported account's secrets along with the account`, async () => {
      const result = await secretsService.getActiveAccountSecrets();

      expect(result).toEqual({
        ...secrets,
        type: SecretType.WalletConnect,
        account,
      });
    });
  });

  describe('when a Fireblocks-imported account is active', () => {
    const secrets = {
      type: ImportType.FIREBLOCKS,
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
      });
      mockMnemonicWallet({
        imported: {
          [account.id]: secrets,
        },
      });
    });

    it(`returns the imported account's secrets along with the account`, async () => {
      const result = await secretsService.getActiveAccountSecrets();

      expect(result).toEqual({
        ...secrets,
        type: SecretType.Fireblocks,
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

  describe('storeBtcWalletPolicyDetails', () => {
    const hmacHex = '0x1';
    const xpub = '0x2';
    const masterFingerprint = '1234';
    const name = 'policy';

    beforeEach(() => {
      jest.mocked(container.resolve).mockReturnValue({
        activeAccount: { type: AccountType.PRIMARY, index: 0 },
      });
    });

    const storeBtcWalletPolicyDetails = async () =>
      secretsService.storeBtcWalletPolicyDetails(
        xpub,
        masterFingerprint,
        hmacHex,
        name
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
          ...existingSecrets,
          pubKeys: [
            {
              evm: '0x1',
              xp: '0x2',
              btcWalletPolicyDetails: {
                xpub,
                masterFingerprint,
                hmacHex,
                name,
              },
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
          ...existingSecrets,
          btcWalletPolicyDetails: {
            xpub,
            masterFingerprint,
            hmacHex,
            name,
          },
        });
      });
    });
  });
});
