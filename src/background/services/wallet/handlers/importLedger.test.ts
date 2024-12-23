import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { WalletService } from '../WalletService';
import { SecretsService } from '../../secrets/SecretsService';
import { AccountsService } from '../../accounts/AccountsService';
import { ImportLedgerHandler } from './importLedger';
import { SecretType } from '../../secrets/models';
import { DerivationPath } from '@avalabs/core-wallets-sdk';
import { buildRpcCall } from '@src/tests/test-utils';

describe('src/background/services/wallet/handlers/importLedger', () => {
  const walletService = {
    addPrimaryWallet: jest.fn(),
  } as unknown as jest.Mocked<WalletService>;

  const accountsService = {
    addPrimaryAccount: jest.fn(),
    activateAccount: jest.fn(),
  } as unknown as jest.Mocked<AccountsService>;

  const secretsService = {
    isKnownSecret: jest.fn(),
    getWalletAccountsSecretsById: jest.fn(),
  } as unknown as jest.Mocked<SecretsService>;

  beforeEach(() => {
    jest.resetAllMocks();
  });

  const handle = (params) => {
    const handler = new ImportLedgerHandler(
      walletService,
      accountsService,
      secretsService,
    );

    return handler.handle(
      buildRpcCall({
        id: '123',
        method: ExtensionRequest.WALLET_IMPORT_LEDGER,
        params: [params],
      }),
    );
  };

  it('returns an error if secret type is not ledger or ledger live', async () => {
    const { error } = await handle({ secretType: SecretType.Mnemonic });

    expect(error).toEqual(`Invalid type: ${SecretType.Mnemonic}`);
  });

  it('returns an error if Ledger is missing xpub', async () => {
    const { error } = await handle({ secretType: SecretType.Ledger });

    expect(error).toEqual('Missing required param: Need xpub or pubKeys');
  });
  it('returns an error if Ledger Live is missing pubKeys', async () => {
    const { error } = await handle({ secretType: SecretType.LedgerLive });

    expect(error).toEqual('Missing required param: Need xpub or pubKeys');
  });
  it('returns an error if the seed phrase is already imported', async () => {
    secretsService.isKnownSecret.mockResolvedValueOnce(true);

    const { error } = await handle({
      secretType: SecretType.Ledger,
      xpub: 'xpubValue',
    });

    expect(error).toEqual('This wallet already exists');
  });
  it('should return with the id as `0` and the given `SecretType` after it checked the wallet is exist', async () => {
    secretsService.isKnownSecret.mockResolvedValueOnce(false);

    const { result } = await handle({
      secretType: SecretType.Ledger,
      xpub: 'xpubValue',
      name: 'name',
      dryRun: true,
    });

    expect(result).toEqual({
      id: '0',
      name: 'name',
      type: SecretType.Ledger,
    });
  });

  it('returns an ImportWalletResult if Ledger import is successful', async () => {
    const walletId = crypto.randomUUID();
    const xpubValue = 'xpubValue';
    const xpubXPValue = 'xpubXPValue';
    const nameValue = 'walletName';
    secretsService.isKnownSecret.mockResolvedValueOnce(false);
    walletService.addPrimaryWallet.mockResolvedValue(walletId);
    secretsService.getWalletAccountsSecretsById.mockResolvedValue({
      secretType: SecretType.Ledger,
      xpub: xpubValue,
      xpubXP: xpubXPValue,
      derivationPath: DerivationPath.BIP44,
      id: walletId,
      name: nameValue,
    });

    const { result } = await handle({
      secretType: SecretType.Ledger,
      xpub: xpubValue,
      xpubXP: xpubXPValue,
      name: nameValue,
      numberOfAccountsToCreate: 1,
    });

    expect(walletService.addPrimaryWallet).toHaveBeenCalledWith({
      secretType: SecretType.Ledger,
      xpub: xpubValue,
      xpubXP: xpubXPValue,
      derivationPath: DerivationPath.BIP44,
      name: nameValue,
    });

    // correlate to numberOfAccountsToCreate
    expect(accountsService.addPrimaryAccount).toHaveBeenCalledTimes(1);

    expect(accountsService.activateAccount).toHaveBeenCalledTimes(1);

    expect(result).toEqual({
      type: SecretType.Ledger,
      name: nameValue,
      id: walletId,
    });
  });
  it('returns an ImportWalletResult if LedgerLive import is successful', async () => {
    const walletId = crypto.randomUUID();
    const pubKeysValue = [
      {
        evm: 'pubKeyEvm',
      },
    ];
    const nameValue = 'walletName';
    secretsService.isKnownSecret.mockResolvedValueOnce(false);
    walletService.addPrimaryWallet.mockResolvedValue(walletId);
    secretsService.getWalletAccountsSecretsById.mockResolvedValue({
      secretType: SecretType.LedgerLive,
      pubKeys: pubKeysValue,
      derivationPath: DerivationPath.LedgerLive,
      id: walletId,
      name: nameValue,
    });

    const { result } = await handle({
      secretType: SecretType.LedgerLive,
      pubKeys: pubKeysValue,
      name: nameValue,
      numberOfAccountsToCreate: 2,
    });

    expect(walletService.addPrimaryWallet).toHaveBeenCalledWith({
      secretType: SecretType.LedgerLive,
      pubKeys: pubKeysValue,
      derivationPath: DerivationPath.LedgerLive,
      name: nameValue,
    });

    // correlate to numberOfAccountsToCreate
    expect(accountsService.addPrimaryAccount).toHaveBeenCalledTimes(2);

    expect(accountsService.activateAccount).toHaveBeenCalledTimes(1);

    expect(result).toEqual({
      type: SecretType.LedgerLive,
      name: nameValue,
      id: walletId,
    });
  });
});
