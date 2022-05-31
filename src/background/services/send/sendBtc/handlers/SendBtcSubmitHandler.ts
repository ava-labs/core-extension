import { ChainId } from '@avalabs/chains-sdk';
import { resolve } from '@avalabs/utils-sdk';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import {
  ExtensionConnectionMessage,
  ExtensionConnectionMessageResponse,
  ExtensionRequestHandler,
} from '@src/background/connections/models';
import { AccountsService } from '@src/background/services/accounts/AccountsService';
import { NetworkBalanceAggregatorService } from '@src/background/services/balances/NetworkBalanceAggregatorService';
import { NetworkService } from '@src/background/services/network/NetworkService';
import { NetworkFeeService } from '@src/background/services/networkFee/NetworkFeeService';
import { WalletService } from '@src/background/services/wallet/WalletService';
import { injectable } from 'tsyringe';
import { sendBtcSubmit } from '../sendBtcSubmit';

@injectable()
export class SendBtcSubmitHandler implements ExtensionRequestHandler {
  methods = [ExtensionRequest.SEND_BTC_SUBMIT];

  constructor(
    private accountsService: AccountsService,
    private networkService: NetworkService,
    private walletService: WalletService,
    private networkBalanceAggregator: NetworkBalanceAggregatorService,
    private networkFeeService: NetworkFeeService
  ) {}

  handle = async (
    request: ExtensionConnectionMessage
  ): Promise<ExtensionConnectionMessageResponse> => {
    const [amount, address, token] = request.params || [];

    if (!amount) {
      return {
        ...request,
        error: 'no amount in params',
      };
    }

    if (!address) {
      return {
        ...request,
        error: 'no address in params',
      };
    }

    if (!this.accountsService.activeAccount?.addressBTC) {
      return {
        ...request,
        error: 'Wallet not ready',
      };
    }

    const isMainnet = await this.networkService.isMainnet();
    const tokenWithBalance =
      this.networkBalanceAggregator.balances[
        isMainnet ? ChainId.BITCOIN : ChainId.BITCOIN_TESTNET
      ]?.[this.accountsService.activeAccount?.addressBTC || '']?.[0];

    if (!tokenWithBalance) throw new Error('No btc token with balance');

    // TODO get from UI
    const fee = await this.networkFeeService.getNetworkFee();

    if (!fee) {
      return {
        ...request,
        error: 'Network fee unknown',
      };
    }

    return await resolve(
      sendBtcSubmit(
        address,
        this.accountsService.activeAccount.addressBTC,
        amount,
        tokenWithBalance.balance.toNumber(),
        tokenWithBalance.utxos || [],
        fee.medium.toNumber(),
        token,
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
