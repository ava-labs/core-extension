import {
  DerivationPath,
  getLedgerExtendedPublicKey,
  getPubKeyFromTransport,
} from '@avalabs/wallets-sdk';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { SecretType } from '../../secrets/models';
import { SecretsService } from '../../secrets/SecretsService';
import { LedgerTransport } from '../LedgerTransport';
import { MigrateMissingPublicKeysFromLedgerHandler } from './migrateMissingPublicKeysFromLedger';

jest.mock('../../secrets/SecretsService');
jest.mock('@avalabs/wallets-sdk');

describe('src/background/services/ledger/handlers/migrateMissingPublicKeysFromLedger.ts', () => {
  const request = {
    id: '123',
    method: ExtensionRequest.LEDGER_MIGRATE_MISSING_PUBKEYS,
  } as any;

  const secretsService = jest.mocked(new SecretsService({} as any));
  const ledgerService = {} as any;
  const handleRequest = async () => {
    const handler = new MigrateMissingPublicKeysFromLedgerHandler(
      secretsService,
      ledgerService
    );
    return handler.handle(request);
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
      type: SecretType.Mnemonic,
    } as any);
    const result = await handleRequest();

    expect(secretsService.updateSecrets).not.toHaveBeenCalled();
    expect(result).toEqual({ ...request, result: true });
  });

  it('returns error if transport is missing', async () => {
    (ledgerService as any).recentTransport = undefined;
    secretsService.getActiveAccountSecrets.mockResolvedValue({
      type: SecretType.Ledger,
    } as any);

    const { error } = await handleRequest();

    expect(error).toEqual('Ledger transport not available');
  });

  describe('Derivation path: BIP44', () => {
    it('terminates early if there is nothing to update', async () => {
      secretsService.getActiveAccountSecrets.mockResolvedValue({
        type: SecretType.Ledger,
        xpub: 'xpub',
        xpubXP: 'xpubXP',
        derivationPath: DerivationPath.BIP44,
      } as any);

      const { result } = await handleRequest();

      expect(result).toBe(true);
      expect(secretsService.updateSecrets).not.toHaveBeenCalled();
    });

    it('updates the extended public key correctly', async () => {
      secretsService.getActiveAccountSecrets.mockResolvedValue({
        type: SecretType.Ledger,
        xpub: 'xpub',
        derivationPath: DerivationPath.BIP44,
      } as any);

      jest.mocked(getLedgerExtendedPublicKey).mockResolvedValueOnce('xpubXP');

      const { result } = await handleRequest();
      expect(result).toBe(true);
      expect(secretsService.updateSecrets).toHaveBeenCalledWith({
        xpubXP: 'xpubXP',
      });
    });
  });

  describe('Derivation path: Ledger Live', () => {
    it('terminates early if there is nothing to update', async () => {
      secretsService.getActiveAccountSecrets.mockResolvedValue({
        type: SecretType.LedgerLive,
        pubKeys: [],
        derivationPath: DerivationPath.LedgerLive,
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
        type: SecretType.LedgerLive,
        pubKeys,
        derivationPath: DerivationPath.LedgerLive,
      } as any);

      jest
        .mocked(getPubKeyFromTransport)
        .mockResolvedValueOnce(Buffer.from('1234', 'hex'))
        .mockRejectedValueOnce('some error');

      const { error } = await handleRequest();
      expect(error).toEqual(
        'Error while searching for missing public keys: incomplete migration.'
      );

      expect(secretsService.updateSecrets).toHaveBeenCalledWith({
        pubKeys: [
          { evm: 'evm', xp: 'xp' },
          {
            evm: 'evm2',
            xp: '1234',
          },
          { evm: 'evm3', xp: '' },
        ],
      });

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
        type: SecretType.LedgerLive,
        pubKeys,
        derivationPath: DerivationPath.LedgerLive,
      } as any);
      jest
        .mocked(getPubKeyFromTransport)
        .mockResolvedValueOnce(Buffer.from('1234', 'hex'))
        .mockResolvedValueOnce(Buffer.from('5678', 'hex'));

      const { result } = await handleRequest();

      expect(result).toBe(true);
      expect(secretsService.updateSecrets).toHaveBeenCalledWith({
        pubKeys: [
          { evm: 'evm', xp: 'xp' },
          {
            evm: 'evm2',
            xp: '1234',
          },
          { evm: 'evm3', xp: '5678' },
        ],
      });

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
