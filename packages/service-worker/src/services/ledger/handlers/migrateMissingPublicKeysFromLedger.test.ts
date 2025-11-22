import {
  DerivationPath,
  getLedgerExtendedPublicKey,
  getPubKeyFromTransport,
  getAddressDerivationPath,
} from '@avalabs/core-wallets-sdk';
import {
  ExtensionRequest,
  AVALANCHE_BASE_DERIVATION_PATH,
  AddressPublicKeyJson,
  EVM_BASE_DERIVATION_PATH,
  SecretType,
  PubKeyType,
} from '@core/types';
import { SecretsService } from '../../secrets/SecretsService';
import { LedgerTransport } from '../LedgerTransport';
import { MigrateMissingPublicKeysFromLedgerHandler } from './migrateMissingPublicKeysFromLedger';
import { buildRpcCall } from '@shared/tests/test-utils';
import { AccountsService } from '../../accounts/AccountsService';
import { AddressPublicKey } from '../../secrets/AddressPublicKey';
import { buildExtendedPublicKey } from '../../secrets/utils';

jest.mock('../../secrets/SecretsService');
jest.mock('@avalabs/core-wallets-sdk', () => ({
  ...jest.requireActual('@avalabs/core-wallets-sdk'),
  getLedgerExtendedPublicKey: jest.fn(),
  getPubKeyFromTransport: jest.fn(),
}));

const WALLET_ID = 'wallet_id';

const mapLegacyPubKeys = (pubKeys: PubKeyType[]): AddressPublicKeyJson[] =>
  pubKeys
    .flatMap(({ evm, xp }, index) => [
      AddressPublicKey.fromJSON({
        key: evm,
        curve: 'secp256k1',
        derivationPath: getAddressDerivationPath(index, 'EVM', {
          pathSpec: DerivationPath.LedgerLive,
        }),
      }).toJSON(),
      xp
        ? AddressPublicKey.fromJSON({
            key: xp,
            curve: 'secp256k1',
            derivationPath: getAddressDerivationPath(index, 'AVM', {
              pathSpec: DerivationPath.LedgerLive,
            }),
          }).toJSON()
        : undefined,
    ])
    .filter<AddressPublicKeyJson>(
      (key): key is AddressPublicKeyJson => key !== undefined,
    );

describe('src/background/services/ledger/handlers/migrateMissingPublicKeysFromLedger.ts', () => {
  const request = {
    id: '123',
    method: ExtensionRequest.LEDGER_MIGRATE_MISSING_PUBKEYS,
  } as any;
  const accountsService: jest.Mocked<AccountsService> = {
    getActiveAccount: async () => ({}),
    getPrimaryAccountsByWalletId: jest.fn(),
  } as any;

  const secretsService = jest.mocked(new SecretsService({} as any));
  const ledgerService = {} as any;
  const handleRequest = async () => {
    const handler = new MigrateMissingPublicKeysFromLedgerHandler(
      secretsService,
      ledgerService,
      accountsService,
    );
    return handler.handle(buildRpcCall(request));
  };

  beforeEach(() => {
    jest.resetAllMocks();
    (ledgerService as any).recentTransport = {} as LedgerTransport;
  });

  it('returns error if storage is empty', async () => {
    secretsService.getAccountSecrets.mockRejectedValue(
      new Error('Wallet is not initialized'),
    );

    const result = await handleRequest();

    expect(result.error).toEqual('Wallet is not initialized');
  });

  it('does nothing if wallet type is incorrect', async () => {
    secretsService.getAccountSecrets.mockResolvedValue({
      secretType: SecretType.Mnemonic,
    } as any);
    const result = await handleRequest();

    expect(secretsService.updateSecrets).not.toHaveBeenCalled();
    expect(result).toEqual({ ...request, result: true });
  });

  it('returns error if transport is missing', async () => {
    (ledgerService as any).recentTransport = undefined;
    secretsService.getAccountSecrets.mockResolvedValue({
      secretType: SecretType.Ledger,
      id: WALLET_ID,
    } as any);

    const { error } = await handleRequest();

    expect(error).toEqual('Ledger transport not available');
  });

  describe('Derivation path: BIP44', () => {
    it('terminates early if there is nothing to update', async () => {
      secretsService.getAccountSecrets.mockResolvedValue({
        secretType: SecretType.Ledger,
        extendedPublicKeys: [
          buildExtendedPublicKey('xpub', EVM_BASE_DERIVATION_PATH),
          buildExtendedPublicKey('xpubXP', AVALANCHE_BASE_DERIVATION_PATH),
        ],
        publicKeys: [],
        derivationPathSpec: DerivationPath.BIP44,
        id: WALLET_ID,
      } as any);

      const { result } = await handleRequest();

      expect(result).toBe(true);
      expect(secretsService.updateSecrets).not.toHaveBeenCalled();
    });

    it('updates the extended public key correctly', async () => {
      secretsService.getAccountSecrets.mockResolvedValue({
        secretType: SecretType.Ledger,
        extendedPublicKeys: [
          buildExtendedPublicKey('xpub', EVM_BASE_DERIVATION_PATH),
        ],
        publicKeys: [],
        derivationPathSpec: DerivationPath.BIP44,
        id: WALLET_ID,
      } as any);

      jest.mocked(getLedgerExtendedPublicKey).mockResolvedValueOnce('xpubXP');

      const { result } = await handleRequest();
      expect(result).toBe(true);
      expect(secretsService.updateSecrets).toHaveBeenCalledWith(
        {
          extendedPublicKeys: [
            buildExtendedPublicKey('xpub', EVM_BASE_DERIVATION_PATH),
            buildExtendedPublicKey('xpubXP', AVALANCHE_BASE_DERIVATION_PATH),
          ],
        },
        WALLET_ID,
      );
    });
  });

  describe('Derivation path: Ledger Live', () => {
    it('terminates early if there is nothing to update', async () => {
      accountsService.getPrimaryAccountsByWalletId.mockReturnValueOnce([
        {
          index: 0,
        },
      ] as any);
      secretsService.getAccountSecrets.mockResolvedValue({
        secretType: SecretType.LedgerLive,
        publicKeys: mapLegacyPubKeys([{ evm: 'evm', xp: 'xp' }]),
        derivationPathSpec: DerivationPath.LedgerLive,
        id: WALLET_ID,
      } as any);

      const { result } = await handleRequest();
      expect(result).toBe(true);
      expect(secretsService.updateSecrets).not.toHaveBeenCalled();
    });

    it('updates the pubkeys and throws if an error happened', async () => {
      accountsService.getPrimaryAccountsByWalletId.mockReturnValueOnce([
        { index: 0 },
        { index: 1 },
        { index: 2 },
      ] as any);
      const pubKeys = [
        { evm: 'evm', xp: 'xp' },
        { evm: 'evm2', xp: '' },
        { evm: 'evm3', xp: '' },
      ];
      secretsService.getAccountSecrets.mockResolvedValue({
        secretType: SecretType.LedgerLive,
        publicKeys: mapLegacyPubKeys(pubKeys),
        derivationPathSpec: DerivationPath.LedgerLive,
        id: WALLET_ID,
      } as any);

      jest
        .mocked(getPubKeyFromTransport)
        .mockResolvedValueOnce(Buffer.from('1234', 'hex'))
        .mockRejectedValueOnce('some error');

      const { error } = await handleRequest();
      expect(error).toEqual(
        'Error while searching for missing public keys: incomplete migration.',
      );

      expect(secretsService.updateSecrets).toHaveBeenCalledWith(
        {
          publicKeys: expect.arrayContaining(
            mapLegacyPubKeys([
              { evm: 'evm', xp: 'xp' },
              {
                evm: 'evm2',
                xp: '1234',
              },
              { evm: 'evm3', xp: '' },
            ]),
          ),
        },
        WALLET_ID,
      );

      expect(getPubKeyFromTransport).toHaveBeenNthCalledWith(
        1,
        {},
        1,
        DerivationPath.LedgerLive,
        'AVM',
      );
      expect(getPubKeyFromTransport).toHaveBeenNthCalledWith(
        2,
        {},
        2,
        DerivationPath.LedgerLive,
        'AVM',
      );
    });

    it('updates the pubkeys correctly', async () => {
      accountsService.getPrimaryAccountsByWalletId.mockReturnValueOnce([
        { index: 0 },
        { index: 1 },
        { index: 2 },
      ] as any);
      const pubKeys = [
        { evm: 'evm', xp: 'xp' },
        { evm: 'evm2', xp: '' },
        { evm: 'evm3', xp: '' },
      ];

      secretsService.getAccountSecrets.mockResolvedValue({
        secretType: SecretType.LedgerLive,
        publicKeys: mapLegacyPubKeys(pubKeys),
        derivationPathSpec: DerivationPath.LedgerLive,
        id: WALLET_ID,
      } as any);
      jest
        .mocked(getPubKeyFromTransport)
        .mockResolvedValueOnce(Buffer.from('1234', 'hex'))
        .mockResolvedValueOnce(Buffer.from('5678', 'hex'));

      const { result } = await handleRequest();

      expect(result).toBe(true);
      expect(secretsService.updateSecrets).toHaveBeenCalledWith(
        {
          publicKeys: expect.arrayContaining(
            mapLegacyPubKeys([
              { evm: 'evm', xp: 'xp' },
              { evm: 'evm2', xp: '1234' },
              { evm: 'evm3', xp: '5678' },
            ]),
          ),
        },
        WALLET_ID,
      );

      expect(getPubKeyFromTransport).toHaveBeenNthCalledWith(
        1,
        {},
        1,
        DerivationPath.LedgerLive,
        'AVM',
      );
      expect(getPubKeyFromTransport).toHaveBeenNthCalledWith(
        2,
        {},
        2,
        DerivationPath.LedgerLive,
        'AVM',
      );
    });
  });
});
