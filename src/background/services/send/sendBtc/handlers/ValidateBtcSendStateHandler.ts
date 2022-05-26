import { ChainId } from '@avalabs/chains-sdk';
import { resolve } from '@avalabs/utils-sdk';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import {
  ExtensionConnectionMessage,
  ExtensionConnectionMessageResponse,
  ExtensionRequestHandler,
} from '@src/background/connections/models';
import { AccountsService } from '@src/background/services/accounts/AccountsService';
import { TokenWithBalance } from '@src/background/services/balances/models';
import { NetworkBalanceAggregatorService } from '@src/background/services/balances/NetworkBalanceAggregatorService';
import { NetworkService } from '@src/background/services/network/NetworkService';
import { NetworkFeeService } from '@src/background/services/networkFee/NetworkFeeService';
import { injectable } from 'tsyringe';
import { validateSendBtcValues } from '../validateSendBtcValues';

@injectable()
export class ValidateBtcSendStateHandler implements ExtensionRequestHandler {
  methods = [ExtensionRequest.SEND_BTC_VALIDATE];

  constructor(
    private accountsService: AccountsService,
    private networkService: NetworkService,
    private networkBalanceAggregator: NetworkBalanceAggregatorService,
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

    // TODO get from UI
    const fee = await this.networkFeeService.getNetworkFee();

    if (!fee || !this.accountsService.activeAccount?.addressBTC) {
      return {
        ...request,
        error: 'Wallet not ready',
      };
    }

    const isMainnet = await this.networkService.isMainnet();
    const tokenWithBalance: TokenWithBalance =
      this.networkBalanceAggregator.balances[
        isMainnet ? ChainId.BITCOIN : ChainId.BITCOIN_TESTNET
      ]?.[this.accountsService.activeAccount?.addressBTC || '']?.[0];
    if (!tokenWithBalance) throw new Error('No btc token with balance');

    return await resolve(
      validateSendBtcValues(
        this.accountsService.activeAccount.addressBTC,
        values,
        tokenWithBalance.balance.toNumber(),
        tokenWithBalance.utxos || [],
        fee?.medium.toNumber(),
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
