import { getPublicKeyFromPrivateKey } from '@avalabs/core-wallets-sdk';
import { hex } from '@scure/base';
import { fromBase58, fromSeed } from 'bip32';
import slip10 from 'micro-key-producer/slip10.js';

import { expectToThrowErrorCode } from '@shared/tests/test-utils';
import { Curve, EVM_BASE_DERIVATION_PATH, SecretType, SecretsError } from '@core/types';

import { AddressPublicKey } from './AddressPublicKey';
import { buildExtendedPublicKey } from './utils';
import { ed25519 } from '@noble/curves/ed25519';

jest.mock('@avalabs/core-wallets-sdk');
jest.mock('bip32');
jest.mock('micro-key-producer/slip10.js');

describe('AddressPublicKey', () => {
  it('should create an instance from JSON', () => {
    const json = {
      key: 'testKey',
      curve: 'secp256k1' as Curve,
      derivationPath: "m/44'/60'/0'/0/0",
    };

    const addressPublicKey = AddressPublicKey.fromJSON(json);

    expect(addressPublicKey.key).toBe(json.key);
    expect(addressPublicKey.curve).toBe(json.curve);
    expect(addressPublicKey.derivationPath).toBe(json.derivationPath);
  });

  it('should convert an instance to JSON', () => {
    const addressPublicKey = new AddressPublicKey(
      'testKey',
      'secp256k1' as Curve,
      "m/44'/60'/0'/0/0",
    );

    const json = addressPublicKey.toJSON();

    expect(json.key).toBe(addressPublicKey.key);
    expect(json.curve).toBe(addressPublicKey.curve);
    expect(json.derivationPath).toBe(addressPublicKey.derivationPath);
  });

  describe('.fromSecrets()', () => {
    it.each([SecretType.Ledger, SecretType.Keystone])(
      'should use .fromExtendedPublicKeys() for %s',
      async (secretType) => {
        const extendedPublicKeys = [
          buildExtendedPublicKey('xpub', EVM_BASE_DERIVATION_PATH),
        ];
        const secrets = {
          secretType,
          extendedPublicKeys,
        } as any;

        const derivationPath = `${EVM_BASE_DERIVATION_PATH}/0/0`;
        const expectedKey = AddressPublicKey.fromJSON({
          curve: 'secp256k1',
          derivationPath,
          key: 'testKey',
        });

        jest
          .spyOn(AddressPublicKey, 'fromExtendedPublicKeys')
          .mockReturnValueOnce(expectedKey);

        expect(
          await AddressPublicKey.fromSecrets(
            secrets,
            'secp256k1',
            derivationPath,
          ),
        ).toEqual(expectedKey);

        expect(AddressPublicKey.fromExtendedPublicKeys).toHaveBeenCalledWith(
          extendedPublicKeys,
          'secp256k1',
          derivationPath,
        );
      },
    );

    it.each([SecretType.Seedless, SecretType.LedgerLive])(
      'should use .fromJSON() for %s',
      async (secretType) => {
        const derivationPath = `${EVM_BASE_DERIVATION_PATH}/0/0`;
        const expectedKey = AddressPublicKey.fromJSON({
          curve: 'secp256k1',
          derivationPath,
          key: 'testKey',
        });
        const publicKeys = [expectedKey.toJSON()];
        const secrets = {
          secretType,
          publicKeys,
        } as any;

        jest
          .spyOn(AddressPublicKey, 'fromJSON')
          .mockReturnValueOnce(expectedKey);

        expect(
          await AddressPublicKey.fromSecrets(
            secrets,
            'secp256k1',
            derivationPath,
          ),
        ).toEqual(expectedKey);

        expect(AddressPublicKey.fromJSON).toHaveBeenCalledWith(publicKeys[0]);
      },
    );

    it.each([SecretType.Mnemonic])(
      'should use .fromSeedphrase() for %s',
      async (secretType) => {
        const derivationPath = `${EVM_BASE_DERIVATION_PATH}/0/0`;
        const publicKey = hex.decode('0123456789abcdef');
        const secrets = {
          secretType,
          mnemonic: 'testMnemonic',
        } as any;

        const seedNode = {
          derivePath: jest.fn().mockReturnValue({ publicKey }),
        } as any;

        jest.spyOn(AddressPublicKey, 'fromSeedphrase');
        jest.mocked(fromSeed).mockReturnValue(seedNode);

        expect(
          await AddressPublicKey.fromSecrets(
            secrets,
            'secp256k1',
            derivationPath,
          ),
        ).toEqual(
          AddressPublicKey.fromJSON({
            key: hex.encode(publicKey),
            curve: 'secp256k1',
            derivationPath,
          }),
        );
        expect(AddressPublicKey.fromSeedphrase).toHaveBeenCalledWith(
          secrets.mnemonic,
          'secp256k1',
          derivationPath,
        );
      },
    );
  });

  describe('.fromPrivateKey()', () => {
    it('works with "ed25519" curve', () => {
      const privateKey = 'privatekey';
      const publicKey = '0123456789abcdef';

      jest
        .spyOn(ed25519, 'getPublicKey')
        .mockReturnValueOnce(hex.decode(publicKey) as Buffer);

      const addressPublicKey = AddressPublicKey.fromPrivateKey(
        privateKey,
        'ed25519',
      );

      expect(ed25519.getPublicKey).toHaveBeenCalledWith(privateKey);
      expect(addressPublicKey.key).toBe(publicKey);
      expect(addressPublicKey.curve).toBe('ed25519');
      expect(addressPublicKey.derivationPath).toBeNull();
    });

    it('works with "ed25519" curve', () => {
      const privateKey = 'privatekey';
      const publicKey = '0123456789abcdef';

      jest
        .mocked(getPublicKeyFromPrivateKey)
        .mockReturnValueOnce(hex.decode(publicKey) as Buffer);

      const addressPublicKey = AddressPublicKey.fromPrivateKey(
        privateKey,
        'secp256k1',
      );

      expect(getPublicKeyFromPrivateKey).toHaveBeenCalledWith(privateKey);
      expect(addressPublicKey.key).toBe(publicKey);
      expect(addressPublicKey.curve).toBe('secp256k1');
      expect(addressPublicKey.derivationPath).toBeNull();
    });

    it('throws an error for unsupported curve', async () => {
      const privateKey = 'privatekey';
      const curve = 'unsupportedCurve' as Curve;

      await expectToThrowErrorCode(
        () => AddressPublicKey.fromPrivateKey(privateKey, curve),
        SecretsError.UnsupportedCurve,
      );
    });
  });

  describe('.fromSeedphrase()', () => {
    it('throws an error for unsupported curve', async () => {
      const seedphrase = 'test seed phrase';
      const curve = 'unsupportedCurve' as Curve;
      const derivationPath = "m/44'/60'/0'/0/0";

      await expectToThrowErrorCode(
        AddressPublicKey.fromSeedphrase(seedphrase, curve, derivationPath),
        SecretsError.UnsupportedCurve,
      );
    });

    it('works with "secp256k1" curve', async () => {
      const derivationPath = `${EVM_BASE_DERIVATION_PATH}/0/0`;
      const publicKey = hex.decode('0123456789abcdef');
      const secrets = {
        secretType: SecretType.Mnemonic,
        mnemonic: 'testMnemonic',
      } as any;

      const seedNode = {
        derivePath: jest.fn().mockReturnValue({ publicKey }),
      } as any;

      jest.spyOn(AddressPublicKey, 'fromSeedphrase');
      jest.mocked(fromSeed).mockReturnValue(seedNode);

      expect(
        await AddressPublicKey.fromSecrets(
          secrets,
          'secp256k1',
          derivationPath,
        ),
      ).toEqual(
        AddressPublicKey.fromJSON({
          key: hex.encode(publicKey),
          curve: 'secp256k1',
          derivationPath,
        }),
      );
      expect(AddressPublicKey.fromSeedphrase).toHaveBeenCalledWith(
        secrets.mnemonic,
        'secp256k1',
        derivationPath,
      );
    });

    it('works with "ed25519" curve', async () => {
      const derivationPath = `${EVM_BASE_DERIVATION_PATH}/0/0`;
      const publicKeyRaw = hex.decode('0123456789abcdef');
      const secrets = {
        secretType: SecretType.Mnemonic,
        mnemonic: 'testMnemonic',
      } as any;

      const seedNode = {
        derive: jest.fn().mockReturnValue({ publicKeyRaw }),
      } as any;

      jest.spyOn(slip10, 'fromMasterSeed').mockReturnValue(seedNode);
      jest.mocked(fromSeed).mockReturnValue(seedNode);

      expect(
        await AddressPublicKey.fromSecrets(secrets, 'ed25519', derivationPath),
      ).toEqual(
        AddressPublicKey.fromJSON({
          key: hex.encode(publicKeyRaw),
          curve: 'ed25519',
          derivationPath,
        }),
      );
      expect(AddressPublicKey.fromSeedphrase).toHaveBeenCalledWith(
        secrets.mnemonic,
        'ed25519',
        derivationPath,
      );
    });
  });

  describe('.fromExtendedPublicKeys()', () => {
    it('throws an error for unsupported curve', () => {
      const derivationPath = "m/44'/60'/0'/0/0";

      expectToThrowErrorCode(
        () =>
          AddressPublicKey.fromExtendedPublicKeys(
            [] as any,
            'ed25519',
            derivationPath,
          ),
        SecretsError.UnsupportedCurve,
      );
    });

    it('works with "secp256k1" curve', async () => {
      const extendedPublicKeys = [
        buildExtendedPublicKey('xpub', EVM_BASE_DERIVATION_PATH),
      ];

      const publicKey = '0123456789abcdef';
      const derivationPath = `${EVM_BASE_DERIVATION_PATH}/0/0`;
      const mockedNode = {
        derivePath: jest
          .fn()
          .mockReturnValue({ publicKey: hex.decode(publicKey) }),
      } as any;

      jest.mocked(fromBase58).mockReturnValue(mockedNode);

      expect(
        AddressPublicKey.fromExtendedPublicKeys(
          extendedPublicKeys,
          'secp256k1',
          derivationPath,
        ),
      ).toEqual(
        AddressPublicKey.fromJSON({
          key: publicKey,
          curve: 'secp256k1',
          derivationPath,
        }),
      );
    });
  });

  describe('.fromSecrets()', () => {
    it('should throw an error for unsupported secret type', async () => {
      const secrets = {
        secretType: 'unsupportedSecretType',
      } as any;
      const curve = 'secp256k1' as Curve;
      const derivationPath = "m/44'/60'/0'/0/0";

      await expectToThrowErrorCode(
        AddressPublicKey.fromSecrets(secrets, curve, derivationPath),
        SecretsError.UnsupportedSecretType,
      );
    });
  });
});
