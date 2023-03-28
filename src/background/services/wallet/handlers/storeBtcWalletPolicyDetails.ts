import { DerivationPath, getBech32AddressFromXPub } from '@avalabs/wallets-sdk';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { ExtensionRequestHandler } from '@src/background/connections/models';
import { networks } from 'bitcoinjs-lib';
import { injectable } from 'tsyringe';
import { AccountsService } from '../../accounts/AccountsService';
import { AccountType } from '../../accounts/models';
import { NetworkService } from '../../network/NetworkService';
import { WalletService } from '../WalletService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.WALLET_STORE_BTC_WALLET_POLICY_DETAILS,
  { isCorrectDevice: boolean },
  [xpub: string, masterFingerprint: string, hmacHex: string, name: string]
>;

@injectable()
export class StoreBtcWalletPolicyDetails implements HandlerType {
  method = ExtensionRequest.WALLET_STORE_BTC_WALLET_POLICY_DETAILS as const;

  constructor(
    private walletService: WalletService,
    private accountService: AccountsService,
    private networkService: NetworkService
  ) {}

  handle: HandlerType['handle'] = async (request) => {
    const activeAccount = this.accountService.activeAccount;
    const [xpub, masterFingerPrint, hmacHex, name] = request.params;
    const isMainnet = this.networkService.isMainnet();

    if (!activeAccount) {
      throw new Error('no account selected');
    }

    if (activeAccount.type !== AccountType.PRIMARY) {
      throw new Error('incorrect account type');
    }

    const derivationPath = this.walletService.derivationPath;

    if (!derivationPath) {
      throw new Error('unknown derivation path');
    }

    const accountIndex =
      derivationPath === DerivationPath.BIP44 ? activeAccount.index : 0;

    const derivedAddressBtc = getBech32AddressFromXPub(
      xpub,
      accountIndex,
      isMainnet ? networks.bitcoin : networks.testnet
    );

    const isCorrectDevice = activeAccount.addressBTC === derivedAddressBtc;

    if (isCorrectDevice) {
      await this.walletService.storeBtcWalletPolicyDetails(
        activeAccount.index,
        xpub,
        masterFingerPrint,
        hmacHex,
        name
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
