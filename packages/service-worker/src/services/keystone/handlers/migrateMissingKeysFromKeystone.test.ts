import { getAddressDerivationPath } from '@avalabs/core-wallets-sdk';
import { ExtensionRequest, SecretType } from '@core/types';
import type { ExtendedPublicKey, AddressPublicKeyJson } from '@core/types';
import { getAvalancheExtendedKeyPath } from '@core/common';
import { SecretsService } from '../../secrets/SecretsService';
import { AccountsService } from '../../accounts/AccountsService';
import { AddressPublicKey } from '~/services/secrets/AddressPublicKey';
import * as utils from '../../secrets/utils';
import { MigrateMissingPublicKeysFromKeystoneHandler } from './migrateMissingKeysFromKeystone';

import KeystoneUSBAvalancheSDK from '@keystonehq/hw-app-avalanche';
import { createKeystoneTransport } from '@keystonehq/hw-transport-webusb';
import {
  Curve as KeystoneCurve,
  DerivationAlgorithm,
} from '@keystonehq/bc-ur-registry';
import { fromPublicKey } from 'bip32';

jest.mock('@keystonehq/hw-app-avalanche');
jest.mock('@keystonehq/hw-transport-webusb');
jest.mock('@keystonehq/bc-ur-registry', () => ({
  ...jest.requireActual('@keystonehq/bc-ur-registry'),
}));
jest.mock('bip32');
jest.mock('../../secrets/SecretsService');
jest.mock('../../accounts/AccountsService');

const WALLET_ID = 'keystone-wallet-id';

const baseRequest = {
  id: '1',
  method: ExtensionRequest.KEYSTONE_MIGRATE_MISSING_PUBKEYS as const,
  params: undefined,
};

const makeXpub = (path: string, key = 'xpub-key'): ExtendedPublicKey => ({
  type: 'extended-pubkey',
  curve: 'secp256k1',
  derivationPath: path,
  key,
});

const makePubKey = (path: string, key = 'pub-key'): AddressPublicKeyJson => ({
  type: 'address-pubkey',
  curve: 'secp256k1',
  derivationPath: path,
  key,
});

describe('MigrateMissingPublicKeysFromKeystoneHandler', () => {
  let handler: MigrateMissingPublicKeysFromKeystoneHandler;
  let secretsService: jest.Mocked<SecretsService>;
  let accountsService: jest.Mocked<AccountsService>;

  beforeEach(() => {
    jest.resetAllMocks();

    const secretsServiceDependencies = [{}] as ConstructorParameters<
      typeof SecretsService
    >;
    const accountsServiceDependencies = Array(8).fill(
      {},
    ) as ConstructorParameters<typeof AccountsService>;

    secretsService = jest.mocked(
      new SecretsService(...secretsServiceDependencies),
    );
    accountsService = jest.mocked(
      new AccountsService(...accountsServiceDependencies),
    );

    handler = new MigrateMissingPublicKeysFromKeystoneHandler(
      secretsService,
      accountsService,
    );
  });

  it('has the correct method', () => {
    expect(handler.method).toBe(
      ExtensionRequest.KEYSTONE_MIGRATE_MISSING_PUBKEYS,
    );
  });

  it('returns error when there is no active account', async () => {
    accountsService.getActiveAccount.mockResolvedValue(undefined);

    const result = await handler.handle({
      request: baseRequest,
    } as never);

    expect(result.error).toBe('There is no active account');
  });

  it('returns true early when secret type is not Keystone3Pro', async () => {
    accountsService.getActiveAccount.mockResolvedValue({
      id: 'acc-1',
    } as never);
    secretsService.getAccountSecrets.mockResolvedValue({
      secretType: SecretType.Mnemonic,
    } as never);

    const result = await handler.handle({
      request: baseRequest,
    } as never);

    expect(result.result).toBe(true);
    expect(result.error).toBeUndefined();
    expect(secretsService.updateSecrets).not.toHaveBeenCalled();
  });

  it('returns error when wallet id is missing', async () => {
    accountsService.getActiveAccount.mockResolvedValue({
      id: 'acc-1',
    } as never);
    secretsService.getAccountSecrets.mockResolvedValue({
      secretType: SecretType.Keystone3Pro,
      id: undefined,
      extendedPublicKeys: [],
      publicKeys: [],
    } as never);

    const result = await handler.handle({
      request: baseRequest,
    } as never);

    expect(result.error).toBe('Wallet id is missing');
  });

  it('returns true when all keys are already present', async () => {
    const index = 0;
    const xpubPath = getAvalancheExtendedKeyPath(index);
    const avmPath = getAddressDerivationPath(index, 'AVM');

    const secrets = {
      secretType: SecretType.Keystone3Pro,
      id: WALLET_ID,
      extendedPublicKeys: [makeXpub(xpubPath)],
      publicKeys: [makePubKey(avmPath)],
    };

    accountsService.getActiveAccount.mockResolvedValue({
      id: 'acc-1',
    } as never);
    secretsService.getAccountSecrets.mockResolvedValue(secrets as never);
    accountsService.getPrimaryAccountsByWalletId.mockResolvedValue([
      { id: 'acc-1', index },
    ] as never);

    jest
      .spyOn(utils, 'getExtendedPublicKey')
      .mockReturnValue(makeXpub(xpubPath));
    jest.spyOn(utils, 'hasPublicKeyFor').mockReturnValue(true);

    const result = await handler.handle({
      request: baseRequest,
    } as never);

    expect(result.result).toBe(true);
    expect(secretsService.updateSecrets).not.toHaveBeenCalled();
  });

  describe('when XP extended public key is missing', () => {
    const index = 0;
    const xpubPath = getAvalancheExtendedKeyPath(index);
    const avmPath = getAddressDerivationPath(index, 'AVM');
    const fakeTransport = {} as never;
    const fakePubKey = 'aabbccdd';
    const fakeChainCode = Buffer.from(
      '00112233445566778899aabbccddeeff00112233445566778899aabbccddeeff',
      'hex',
    );
    const fakeBase58 = 'xpub-base58-key';
    const fakePubKeyJson: AddressPublicKeyJson = {
      type: 'address-pubkey',
      curve: 'secp256k1',
      derivationPath: avmPath,
      key: 'derived-pub-key',
    };

    let secrets: Record<string, unknown>;

    beforeEach(() => {
      secrets = {
        secretType: SecretType.Keystone3Pro,
        id: WALLET_ID,
        extendedPublicKeys: [],
        publicKeys: [],
      };

      accountsService.getActiveAccount.mockResolvedValue({
        id: 'acc-1',
      } as never);
      secretsService.getAccountSecrets.mockResolvedValue(secrets as never);
      accountsService.getPrimaryAccountsByWalletId.mockResolvedValue([
        { id: 'acc-1', index },
      ] as never);

      jest.spyOn(utils, 'getExtendedPublicKey').mockReturnValue(undefined);
      jest.spyOn(utils, 'hasPublicKeyFor').mockReturnValue(false);

      jest.mocked(createKeystoneTransport).mockResolvedValue(fakeTransport);

      const mockApp = {
        getPubkey: jest.fn().mockResolvedValue({
          publicKey: fakePubKey,
          chainCode: fakeChainCode,
        }),
      };
      jest
        .mocked(KeystoneUSBAvalancheSDK)
        .mockImplementation(() => mockApp as never);

      jest.mocked(fromPublicKey).mockReturnValue({
        toBase58: () => fakeBase58,
      } as never);

      jest.spyOn(AddressPublicKey, 'fromExtendedPublicKeys').mockReturnValue({
        toJSON: () => fakePubKeyJson,
      } as never);

      secretsService.updateSecrets.mockResolvedValue(WALLET_ID);
    });

    it('fetches the public key from the Keystone USB device', async () => {
      await handler.handle({ request: baseRequest } as never);

      expect(createKeystoneTransport).toHaveBeenCalled();
      expect(KeystoneUSBAvalancheSDK).toHaveBeenCalledWith(fakeTransport);
    });

    it('calls getPubkey with the correct derivation path and curve', async () => {
      await handler.handle({ request: baseRequest } as never);

      const mockApp = jest.mocked(KeystoneUSBAvalancheSDK).mock.results[0]
        ?.value;
      expect(mockApp.getPubkey).toHaveBeenCalledWith(
        xpubPath,
        KeystoneCurve.secp256k1,
        DerivationAlgorithm.slip10,
      );
    });

    it('builds the extended public key from the device response', async () => {
      await handler.handle({ request: baseRequest } as never);

      expect(fromPublicKey).toHaveBeenCalledWith(
        Buffer.from(fakePubKey, 'hex'),
        fakeChainCode,
      );
    });

    it('updates secrets with new keys and refreshes accounts', async () => {
      await handler.handle({ request: baseRequest } as never);

      expect(secretsService.updateSecrets).toHaveBeenCalledWith(
        {
          publicKeys: [fakePubKeyJson],
          extendedPublicKeys: [
            expect.objectContaining({
              type: 'extended-pubkey',
              curve: 'secp256k1',
              derivationPath: xpubPath,
              key: fakeBase58,
            }),
          ],
        },
        WALLET_ID,
      );
      expect(accountsService.refreshAddressesForAccount).toHaveBeenCalledWith(
        'acc-1',
      );
    });

    it('returns true on success', async () => {
      const result = await handler.handle({
        request: baseRequest,
      } as never);

      expect(result.result).toBe(true);
      expect(result.error).toBeUndefined();
    });
  });

  describe('when only AVM public key is missing (XP xpub exists)', () => {
    const index = 0;
    const xpubPath = getAvalancheExtendedKeyPath(index);
    const avmPath = getAddressDerivationPath(index, 'AVM');
    const existingXpub = makeXpub(xpubPath, 'existing-xpub');
    const fakePubKeyJson: AddressPublicKeyJson = {
      type: 'address-pubkey',
      curve: 'secp256k1',
      derivationPath: avmPath,
      key: 'derived-key',
    };

    beforeEach(() => {
      const secrets = {
        secretType: SecretType.Keystone3Pro,
        id: WALLET_ID,
        extendedPublicKeys: [existingXpub],
        publicKeys: [],
      };

      accountsService.getActiveAccount.mockResolvedValue({
        id: 'acc-1',
      } as never);
      secretsService.getAccountSecrets.mockResolvedValue(secrets as never);
      accountsService.getPrimaryAccountsByWalletId.mockResolvedValue([
        { id: 'acc-1', index },
      ] as never);

      jest.spyOn(utils, 'getExtendedPublicKey').mockReturnValue(existingXpub);
      jest.spyOn(utils, 'hasPublicKeyFor').mockReturnValue(false);

      jest.spyOn(AddressPublicKey, 'fromExtendedPublicKeys').mockReturnValue({
        toJSON: () => fakePubKeyJson,
      } as never);

      secretsService.updateSecrets.mockResolvedValue(WALLET_ID);
    });

    it('does not call Keystone USB transport', async () => {
      await handler.handle({ request: baseRequest } as never);

      expect(createKeystoneTransport).not.toHaveBeenCalled();
    });

    it('derives AVM public key from the existing xpub', async () => {
      await handler.handle({ request: baseRequest } as never);

      expect(AddressPublicKey.fromExtendedPublicKeys).toHaveBeenCalledWith(
        [existingXpub],
        'secp256k1',
        avmPath,
      );
    });

    it('updates secrets with derived public key and existing xpubs', async () => {
      await handler.handle({ request: baseRequest } as never);

      expect(secretsService.updateSecrets).toHaveBeenCalledWith(
        {
          publicKeys: [fakePubKeyJson],
          extendedPublicKeys: [existingXpub],
        },
        WALLET_ID,
      );
    });
  });

  describe('when AVM public key already exists but XP xpub is missing', () => {
    const index = 0;
    const xpubPath = getAvalancheExtendedKeyPath(index);
    const fakeTransport = {} as never;
    const fakePubKey = 'aabbccdd';
    const fakeChainCode = Buffer.from(
      '00112233445566778899aabbccddeeff00112233445566778899aabbccddeeff',
      'hex',
    );
    const fakeBase58 = 'xpub-base58-key';

    beforeEach(() => {
      const secrets = {
        secretType: SecretType.Keystone3Pro,
        id: WALLET_ID,
        extendedPublicKeys: [],
        publicKeys: [],
      };

      accountsService.getActiveAccount.mockResolvedValue({
        id: 'acc-1',
      } as never);
      secretsService.getAccountSecrets.mockResolvedValue(secrets as never);
      accountsService.getPrimaryAccountsByWalletId.mockResolvedValue([
        { id: 'acc-1', index },
      ] as never);

      jest.spyOn(utils, 'getExtendedPublicKey').mockReturnValue(undefined);
      jest.spyOn(utils, 'hasPublicKeyFor').mockReturnValueOnce(false);

      jest.mocked(createKeystoneTransport).mockResolvedValue(fakeTransport);

      const mockApp = {
        getPubkey: jest.fn().mockResolvedValue({
          publicKey: fakePubKey,
          chainCode: fakeChainCode,
        }),
      };
      jest
        .mocked(KeystoneUSBAvalancheSDK)
        .mockImplementation(() => mockApp as never);

      jest.mocked(fromPublicKey).mockReturnValue({
        toBase58: () => fakeBase58,
      } as never);

      jest
        .spyOn(utils, 'getExtendedPublicKey')
        .mockReturnValueOnce(undefined)
        .mockReturnValueOnce(undefined);

      jest
        .spyOn(utils, 'hasPublicKeyFor')
        .mockReturnValueOnce(false)
        .mockReturnValueOnce(true);

      jest.spyOn(AddressPublicKey, 'fromExtendedPublicKeys').mockReturnValue({
        toJSON: () => makePubKey('some-path'),
      } as never);

      secretsService.updateSecrets.mockResolvedValue(WALLET_ID);
    });

    it('fetches XP xpub from device but skips AVM derivation', async () => {
      await handler.handle({ request: baseRequest } as never);

      expect(createKeystoneTransport).toHaveBeenCalled();
      expect(secretsService.updateSecrets).toHaveBeenCalledWith(
        expect.objectContaining({
          extendedPublicKeys: [
            expect.objectContaining({
              derivationPath: xpubPath,
              key: fakeBase58,
            }),
          ],
        }),
        WALLET_ID,
      );
    });
  });

  describe('error handling during key fetch', () => {
    const index = 0;

    beforeEach(() => {
      const secrets = {
        secretType: SecretType.Keystone3Pro,
        id: WALLET_ID,
        extendedPublicKeys: [],
        publicKeys: [],
      };

      accountsService.getActiveAccount.mockResolvedValue({
        id: 'acc-1',
      } as never);
      secretsService.getAccountSecrets.mockResolvedValue(secrets as never);
      accountsService.getPrimaryAccountsByWalletId.mockResolvedValue([
        { id: 'acc-1', index },
        { id: 'acc-2', index: 1 },
      ] as never);

      jest.spyOn(utils, 'getExtendedPublicKey').mockReturnValue(undefined);
      jest.spyOn(utils, 'hasPublicKeyFor').mockReturnValue(false);

      jest
        .mocked(createKeystoneTransport)
        .mockRejectedValue(new Error('USB disconnected'));
    });

    it('returns error for incomplete migration', async () => {
      const result = await handler.handle({
        request: baseRequest,
      } as never);

      expect(result.error).toBe(
        'Error while searching for missing public keys: incomplete migration.',
      );
    });

    it('does not update secrets when error occurs on first account', async () => {
      await handler.handle({ request: baseRequest } as never);

      expect(secretsService.updateSecrets).not.toHaveBeenCalled();
    });
  });

  describe('multiple accounts migration', () => {
    const fakeTransport = {} as never;
    const fakePubKey = 'aabbccdd';
    const fakeChainCode = Buffer.from(
      '00112233445566778899aabbccddeeff00112233445566778899aabbccddeeff',
      'hex',
    );
    const fakeBase58 = 'xpub-base58-key';

    beforeEach(() => {
      const secrets = {
        secretType: SecretType.Keystone3Pro,
        id: WALLET_ID,
        extendedPublicKeys: [],
        publicKeys: [],
      };

      accountsService.getActiveAccount.mockResolvedValue({
        id: 'acc-1',
      } as never);
      secretsService.getAccountSecrets.mockResolvedValue(secrets as never);
      accountsService.getPrimaryAccountsByWalletId.mockResolvedValue([
        { id: 'acc-1', index: 0 },
        { id: 'acc-2', index: 1 },
      ] as never);

      jest.spyOn(utils, 'getExtendedPublicKey').mockReturnValue(undefined);
      jest.spyOn(utils, 'hasPublicKeyFor').mockReturnValue(false);

      jest.mocked(createKeystoneTransport).mockResolvedValue(fakeTransport);

      const mockApp = {
        getPubkey: jest.fn().mockResolvedValue({
          publicKey: fakePubKey,
          chainCode: fakeChainCode,
        }),
      };
      jest
        .mocked(KeystoneUSBAvalancheSDK)
        .mockImplementation(() => mockApp as never);

      jest.mocked(fromPublicKey).mockReturnValue({
        toBase58: () => fakeBase58,
      } as never);

      jest.spyOn(AddressPublicKey, 'fromExtendedPublicKeys').mockReturnValue({
        toJSON: () => makePubKey('derived-path'),
      } as never);

      secretsService.updateSecrets.mockResolvedValue(WALLET_ID);
    });

    it('refreshes addresses for all affected accounts', async () => {
      await handler.handle({ request: baseRequest } as never);

      expect(accountsService.refreshAddressesForAccount).toHaveBeenCalledWith(
        'acc-1',
      );
      expect(accountsService.refreshAddressesForAccount).toHaveBeenCalledWith(
        'acc-2',
      );
      expect(accountsService.refreshAddressesForAccount).toHaveBeenCalledTimes(
        2,
      );
    });
  });
});
