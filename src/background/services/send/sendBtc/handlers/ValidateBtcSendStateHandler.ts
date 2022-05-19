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
import { NetworkFeeService } from '@src/background/services/networkFee/NetworkFeeService';
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
    private walletService: WalletService,
    private networkFeeService: NetworkFeeService
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
    // TODO get from UI
    const fee = await this.networkFeeService.getNetworkFee();

    if (
      !wallet ||
      !fee ||
      !this.walletService.walletState ||
      isWalletLocked(this.walletService.walletState) ||
      !this.accountsService.activeAccount?.addressBTC
    ) {
      return {
        ...request,
        error: 'Wallet not ready',
      };
    }

    const tokenWithBalance =
      this.balancesService.balances[
        this.accountsService.activeAccount.addressBTC
      ]?.[0];

    return await resolve(
      validateSendBtcValues(
        this.accountsService.activeAccount.addressBTC,
        values,
        tokenWithBalance.balance.toNumber(),
        tokenWithBalance.utxos || [],
        fee?.medium.toNumber(),
        this.walletService,
        this.networkService
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
