import { resolve } from '@avalabs/utils-sdk';
import { wallet$ } from '@avalabs/wallet-react-components';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import {
  ExtensionConnectionMessage,
  ExtensionConnectionMessageResponse,
  ExtensionRequestHandler,
} from '@src/background/connections/models';
import { AccountsService } from '@src/background/services/accounts/AccountsService';
import { BalancesService } from '@src/background/services/balances/BalancesService';
import { NetworkService } from '@src/background/services/network/NetworkService';
import { isWalletLocked } from '@src/background/services/wallet/models';
import { WalletService } from '@src/background/services/wallet/WalletService';
import { firstValueFrom } from 'rxjs';
import { injectable } from 'tsyringe';
import { validateSendBtcValues } from '../validateSendBtcValues';

@injectable()
export class ValidateBtcSendStateHandler implements ExtensionRequestHandler {
  methods = [ExtensionRequest.SEND_BTC_VALIDATE];

  constructor(
    private accountsService: AccountsService,
    private balancesService: BalancesService,
    private networkService: NetworkService,
    private walletService: WalletService
  ) {}

  handle = async (
    request: ExtensionConnectionMessage
  ): Promise<ExtensionConnectionMessageResponse> => {
    const [values] = request.params || [];

    if (!values) {
      return {
        ...request,
        error: 'no values in params',
      };
    }

    const wallet = await firstValueFrom(wallet$);

    if (
      !wallet ||
      !this.walletService.walletState ||
      isWalletLocked(this.walletService.walletState)
    ) {
      return {
        ...request,
        error: 'Wallet not ready',
      };
    }

    const bitcoinWallet = await this.walletService.getBitcoinWallet();
    const tokenWithBalance =
      this.balancesService.balances[
        this.accountsService.activeAccount?.addressBTC || ''
      ]?.[0];
    // TODO get from UI
    const { medium: feeRate } = await bitcoinWallet.getProvider().getFeeRates();

    return await resolve(
      validateSendBtcValues(
        values,
        tokenWithBalance.balance.toNumber(),
        tokenWithBalance.utxos || [],
        feeRate,
        bitcoinWallet,
        this.networkService.isMainnet
      )
    ).then(([result, error]) => {
      return {
        ...request,
        result: result || undefined,
        error: error as any,
      };
    });
  };
}
