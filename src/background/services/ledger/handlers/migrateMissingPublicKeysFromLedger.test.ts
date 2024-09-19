import {
  DerivationPath,
  getLedgerExtendedPublicKey,
  getPubKeyFromTransport,
} from '@avalabs/core-wallets-sdk';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { SecretType } from '../../secrets/models';
import { SecretsService } from '../../secrets/SecretsService';
import { LedgerTransport } from '../LedgerTransport';
import { MigrateMissingPublicKeysFromLedgerHandler } from './migrateMissingPublicKeysFromLedger';
import { buildRpcCall } from '@src/tests/test-utils';
import { AccountsService } from '../../accounts/AccountsService';

jest.mock('../../secrets/SecretsService');
jest.mock('@avalabs/core-wallets-sdk');

const WALLET_ID = 'wallet_id';
describe('src/background/services/ledger/handlers/migrateMissingPublicKeysFromLedger.ts', () => {
  const request = {
    id: '123',
    method: ExtensionRequest.LEDGER_MIGRATE_MISSING_PUBKEYS,
  } as any;
  const accountsService = new AccountsService(
    {} as any,
    {} as any,
    {} as any,
    {} as any,
    {} as any,
    {} as any,
    {} as any
  );

  const secretsService = jest.mocked(new SecretsService({} as any));
  const ledgerService = {} as any;
  const handleRequest = async () => {
    const handler = new MigrateMissingPublicKeysFromLedgerHandler(
      secretsService,
      ledgerService,
      accountsService
    );
    return handler.handle(buildRpcCall(request));
  };

  beforeEach(() => {
    jest.resetAllMocks();
    (ledgerService as any).recentTransport = {} as LedgerTransport;
  });

  it('returns error if storage is empty', async () => {
    secretsService.getActiveAccountSecrets.mockRejectedValue(
      new Error('Wallet is not initialized')
    );

    const result = await handleRequest();

    expect(result.error).toEqual('Wallet is not initialized');
  });

  it('does nothing if wallet type is incorrect', async () => {
    secretsService.getActiveAccountSecrets.mockResolvedValue({
      secretType: SecretType.Mnemonic,
    } as any);
    const result = await handleRequest();

    expect(secretsService.updateSecrets).not.toHaveBeenCalled();
    expect(result).toEqual({ ...request, result: true });
  });

  it('returns error if transport is missing', async () => {
    (ledgerService as any).recentTransport = undefined;
    secretsService.getActiveAccountSecrets.mockResolvedValue({
      secretType: SecretType.Ledger,
      id: WALLET_ID,
    } as any);

    const { error } = await handleRequest();

    expect(error).toEqual('Ledger transport not available');
  });

  describe('Derivation path: BIP44', () => {
    it('terminates early if there is nothing to update', async () => {
      secretsService.getActiveAccountSecrets.mockResolvedValue({
        secretType: SecretType.Ledger,
        xpub: 'xpub',
        xpubXP: 'xpubXP',
        derivationPath: DerivationPath.BIP44,
        id: WALLET_ID,
      } as any);

      const { result } = await handleRequest();

      expect(result).toBe(true);
      expect(secretsService.updateSecrets).not.toHaveBeenCalled();
    });

    it('updates the extended public key correctly', async () => {
      secretsService.getActiveAccountSecrets.mockResolvedValue({
        secretType: SecretType.Ledger,
        xpub: 'xpub',
        derivationPath: DerivationPath.BIP44,
        id: WALLET_ID,
      } as any);

      jest.mocked(getLedgerExtendedPublicKey).mockResolvedValueOnce('xpubXP');

      const { result } = await handleRequest();
      expect(result).toBe(true);
      expect(secretsService.updateSecrets).toHaveBeenCalledWith(
        {
          xpubXP: 'xpubXP',
        },
        WALLET_ID
      );
    });
  });

  describe('Derivation path: Ledger Live', () => {
    it('terminates early if there is nothing to update', async () => {
      secretsService.getActiveAccountSecrets.mockResolvedValue({
        secretType: SecretType.LedgerLive,
        pubKeys: [],
        derivationPath: DerivationPath.LedgerLive,
        id: WALLET_ID,
      } as any);

      const { result } = await handleRequest();
      expect(result).toBe(true);
      expect(secretsService.updateSecrets).not.toHaveBeenCalled();
    });

    it('updates the pubkeys and throws if an error happened', async () => {
      const pubKeys = [
        { evm: 'evm', xp: 'xp' },
        { evm: 'evm2', xp: '' },
        { evm: 'evm3', xp: '' },
      ];
      secretsService.getActiveAccountSecrets.mockResolvedValue({
        secretType: SecretType.LedgerLive,
        pubKeys,
        derivationPath: DerivationPath.LedgerLive,
        id: WALLET_ID,
      } as any);

      jest
        .mocked(getPubKeyFromTransport)
        .mockResolvedValueOnce(Buffer.from('1234', 'hex'))
        .mockRejectedValueOnce('some error');

      const { error } = await handleRequest();
      expect(error).toEqual(
        'Error while searching for missing public keys: incomplete migration.'
      );

      expect(secretsService.updateSecrets).toHaveBeenCalledWith(
        {
          pubKeys: [
            { evm: 'evm', xp: 'xp' },
            {
              evm: 'evm2',
              xp: '1234',
            },
            { evm: 'evm3', xp: '' },
          ],
        },
        WALLET_ID
      );

      expect(getPubKeyFromTransport).toHaveBeenNthCalledWith(
        1,
        {},
        1,
        DerivationPath.LedgerLive,
        'AVM'
      );
      expect(getPubKeyFromTransport).toHaveBeenNthCalledWith(
        2,
        {},
        2,
        DerivationPath.LedgerLive,
        'AVM'
      );
    });

    it('updates the pubkeys correctly', async () => {
      const pubKeys = [
        { evm: 'evm', xp: 'xp' },
        { evm: 'evm2', xp: '' },
        { evm: 'evm3', xp: '' },
      ];

      secretsService.getActiveAccountSecrets.mockResolvedValue({
        secretType: SecretType.LedgerLive,
        pubKeys,
        derivationPath: DerivationPath.LedgerLive,
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
          pubKeys: [
            { evm: 'evm', xp: 'xp' },
            {
              evm: 'evm2',
              xp: '1234',
            },
            { evm: 'evm3', xp: '5678' },
          ],
        },
        WALLET_ID
      );

      expect(getPubKeyFromTransport).toHaveBeenNthCalledWith(
        1,
        {},
        1,
        DerivationPath.LedgerLive,
        'AVM'
      );
      expect(getPubKeyFromTransport).toHaveBeenNthCalledWith(
        2,
        {},
        2,
        DerivationPath.LedgerLive,
        'AVM'
      );
    });
  });
});
