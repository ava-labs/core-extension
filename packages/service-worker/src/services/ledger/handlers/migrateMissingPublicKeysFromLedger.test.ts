import {
  DerivationPath,
  getLedgerExtendedPublicKey,
  getAddressDerivationPath,
} from '@avalabs/core-wallets-sdk';
import {
  ExtensionRequest,
  AddressPublicKeyJson,
  EVM_BASE_DERIVATION_PATH,
  SecretType,
} from '@core/types';
import { SecretsService } from '../../secrets/SecretsService';
import { LedgerTransport } from '../LedgerTransport';
import { MigrateMissingPublicKeysFromLedgerHandler } from './migrateMissingPublicKeysFromLedger';
import { buildRpcCall } from '@shared/tests/test-utils';
import { AccountsService } from '../../accounts/AccountsService';
import { AddressPublicKey } from '../../secrets/AddressPublicKey';
import { buildExtendedPublicKey } from '../../secrets/utils';
import {
  getAvalancheExtendedKeyPath,
  getXPAccountIndexFromPath,
} from '@core/common';

jest.mock('../../secrets/SecretsService');
jest.mock('@avalabs/core-wallets-sdk', () => ({
  ...jest.requireActual('@avalabs/core-wallets-sdk'),
  getLedgerExtendedPublicKey: jest.fn(),
  getPubKeyFromTransport: jest.fn(),
}));

const WALLET_ID = 'wallet_id';

const getEvmPublicKey = (
  index: number,
  pathSpec: DerivationPath,
): AddressPublicKeyJson =>
  AddressPublicKey.fromJSON({
    key: `evmpub${index}`,
    curve: 'secp256k1',
    derivationPath: getAddressDerivationPath(index, 'EVM', {
      pathSpec,
    }),
  }).toJSON();

const getXPPublicKey = (index: number): AddressPublicKeyJson =>
  AddressPublicKey.fromJSON({
    key: `xppub${index}`,
    curve: 'secp256k1',
    derivationPath: getAddressDerivationPath(index, 'AVM'),
  }).toJSON();

describe('src/background/services/ledger/handlers/migrateMissingPublicKeysFromLedger.ts', () => {
  const request = {
    id: '123',
    method: ExtensionRequest.LEDGER_MIGRATE_MISSING_PUBKEYS,
  } as any;
  const accountsService: jest.Mocked<AccountsService> = {
    getActiveAccount: async () => ({}),
    getPrimaryAccountsByWalletId: jest.fn(),
    refreshAddressesForAccount: jest.fn(),
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

  it('terminates early if there is nothing to update', async () => {
    accountsService.getPrimaryAccountsByWalletId.mockReturnValueOnce([
      {
        index: 0,
      },
    ] as any);
    secretsService.getAccountSecrets.mockResolvedValue({
      secretType: SecretType.LedgerLive,
      extendedPublicKeys: [
        buildExtendedPublicKey('xpub', EVM_BASE_DERIVATION_PATH),
        buildExtendedPublicKey('xpubXP', getAvalancheExtendedKeyPath(0)),
      ],
      publicKeys: [
        getEvmPublicKey(0, DerivationPath.LedgerLive),
        getXPPublicKey(0),
      ],
      derivationPathSpec: DerivationPath.LedgerLive,
      id: WALLET_ID,
    } as any);

    const { result } = await handleRequest();
    expect(result).toBe(true);
    expect(secretsService.updateSecrets).not.toHaveBeenCalled();
  });

  it('updates the secrets and returns an error if migration was not fully successful', async () => {
    accountsService.getPrimaryAccountsByWalletId.mockReturnValueOnce([
      { index: 0 },
      { index: 1 },
      { index: 2 },
    ] as any);

    const extendedPublicKeys = [
      buildExtendedPublicKey('xpub', EVM_BASE_DERIVATION_PATH),
      buildExtendedPublicKey('xpubXP', getAvalancheExtendedKeyPath(0)),
    ];
    const publicKeys = [
      getEvmPublicKey(0, DerivationPath.BIP44),
      getXPPublicKey(0),
      getEvmPublicKey(1, DerivationPath.BIP44),
      getEvmPublicKey(2, DerivationPath.BIP44),
    ];
    secretsService.getAccountSecrets.mockResolvedValue({
      secretType: SecretType.Ledger,
      extendedPublicKeys,
      publicKeys,
      derivationPathSpec: DerivationPath.BIP44,
      id: WALLET_ID,
    } as any);

    jest
      .spyOn(AddressPublicKey, 'fromExtendedPublicKeys')
      .mockImplementation((_, __, path) =>
        AddressPublicKey.fromJSON(
          getXPPublicKey(getXPAccountIndexFromPath(path)),
        ),
      );

    jest
      .mocked(getLedgerExtendedPublicKey)
      .mockResolvedValueOnce('xpubXP1')
      .mockRejectedValueOnce('some error');

    const { error } = await handleRequest();
    expect(error).toEqual(
      'Error while searching for missing public keys: incomplete migration.',
    );

    expect(secretsService.updateSecrets).toHaveBeenCalledWith(
      {
        publicKeys: expect.arrayContaining([...publicKeys, getXPPublicKey(1)]),
        extendedPublicKeys: expect.arrayContaining([
          ...extendedPublicKeys,
          buildExtendedPublicKey('xpubXP1', getAvalancheExtendedKeyPath(1)),
        ]),
      },
      WALLET_ID,
    );
  });

  it('updates the secrets and returns true if migration was successful', async () => {
    accountsService.getPrimaryAccountsByWalletId.mockReturnValueOnce([
      { index: 0 },
      { index: 1 },
      { index: 2 },
    ] as any);

    const extendedPublicKeys = [
      buildExtendedPublicKey('xpub', EVM_BASE_DERIVATION_PATH),
      buildExtendedPublicKey('xpubXP', getAvalancheExtendedKeyPath(0)),
    ];
    const publicKeys = [
      getEvmPublicKey(0, DerivationPath.BIP44),
      getXPPublicKey(0),
      getEvmPublicKey(1, DerivationPath.BIP44),
      getEvmPublicKey(2, DerivationPath.BIP44),
    ];
    secretsService.getAccountSecrets.mockResolvedValue({
      secretType: SecretType.Ledger,
      extendedPublicKeys,
      publicKeys,
      derivationPathSpec: DerivationPath.BIP44,
      id: WALLET_ID,
    } as any);

    jest
      .spyOn(AddressPublicKey, 'fromExtendedPublicKeys')
      .mockImplementation((_, __, path) =>
        AddressPublicKey.fromJSON(
          getXPPublicKey(getXPAccountIndexFromPath(path)),
        ),
      );

    jest
      .mocked(getLedgerExtendedPublicKey)
      .mockResolvedValueOnce('xpubXP1')
      .mockResolvedValueOnce('xpubXP2');

    const { error, result } = await handleRequest();
    expect(result).toBe(true);
    expect(error).toBeUndefined();

    expect(secretsService.updateSecrets).toHaveBeenCalledWith(
      {
        publicKeys: expect.arrayContaining([
          ...publicKeys,
          getXPPublicKey(1),
          getXPPublicKey(2),
        ]),
        extendedPublicKeys: expect.arrayContaining([
          ...extendedPublicKeys,
          buildExtendedPublicKey('xpubXP1', getAvalancheExtendedKeyPath(1)),
          buildExtendedPublicKey('xpubXP2', getAvalancheExtendedKeyPath(2)),
        ]),
      },
      WALLET_ID,
    );
  });
});
