import {
  DerivationPath,
  getBech32AddressFromXPub,
} from '@avalabs/core-wallets-sdk';
import {
  ExtensionRequest,
  ExtensionRequestHandler,
  AccountType,
  SecretType,
} from '@core/types';
import { networks } from 'bitcoinjs-lib';
import { injectable } from 'tsyringe';
import { NetworkService } from '../../network/NetworkService';
import { SecretsService } from '../../secrets/SecretsService';
import { AccountsService } from '../../accounts/AccountsService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.WALLET_STORE_BTC_WALLET_POLICY_DETAILS,
  { isCorrectDevice: boolean },
  [xpub: string, masterFingerprint: string, hmacHex: string, name: string]
>;

@injectable()
export class StoreBtcWalletPolicyDetails implements HandlerType {
  method = ExtensionRequest.WALLET_STORE_BTC_WALLET_POLICY_DETAILS as const;

  constructor(
    private secretsService: SecretsService,
    private networkService: NetworkService,
    private accountsService: AccountsService,
  ) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    const activeAccount = await this.accountsService.getActiveAccount();
    if (!activeAccount) {
      throw new Error('there is no active account');
    }
    const secrets = await this.secretsService.getAccountSecrets(activeAccount);

    if (
      secrets.secretType !== SecretType.Ledger &&
      secrets.secretType !== SecretType.LedgerLive
    ) {
      throw new Error('incorrect account type');
    }

    const { account } = secrets;

    if (!account) {
      throw new Error('no account selected');
    }
    if (account.type !== AccountType.PRIMARY) {
      throw new Error('incorrect account type');
    }

    const [xpub, masterFingerPrint, hmacHex, name] = request.params;
    const isMainnet = this.networkService.isMainnet();

    if (!secrets.derivationPathSpec) {
      throw new Error('unknown derivation path');
    }

    const accountIndex =
      secrets.derivationPathSpec === DerivationPath.BIP44 ? account.index : 0;

    const derivedAddressBtc = getBech32AddressFromXPub(
      xpub,
      accountIndex,
      isMainnet ? networks.bitcoin : networks.testnet,
    );
    const isCorrectDevice = account.addressBTC === derivedAddressBtc;

    if (isCorrectDevice) {
      await this.secretsService.storeBtcWalletPolicyDetails(
        xpub,
        masterFingerPrint,
        hmacHex,
        name,
        secrets.id,
        activeAccount,
      );
    }

    return {
      ...request,
      result: {
        isCorrectDevice,
      },
    };
  };
}
