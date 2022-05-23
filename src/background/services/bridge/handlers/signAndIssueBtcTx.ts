import {
  ExtensionConnectionMessage,
  ExtensionConnectionMessageResponse,
  ExtensionRequestHandler,
} from '@src/background/connections/models';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { BridgeService } from '../BridgeService';
import { WalletService } from '../../wallet/WalletService';
import { resolve } from '@src/utils/promiseResolver';
import { injectable } from 'tsyringe';
import { NetworkService } from '../../network/NetworkService';
import { AccountsService } from '../../accounts/AccountsService';
import { BalancesService } from '../../balances/BalancesService';
import { getBtcTransaction } from '@avalabs/bridge-sdk';

/**
 * FYI: the input UTXOs to the unsignedTxHex must be owned by the wallet
 * (i.e. the C-chain derived bitcoin address)
 */
@injectable()
export class BridgeSignIssueBtcHandler implements ExtensionRequestHandler {
  methods = [ExtensionRequest.BRIDGE_SIGN_ISSUE_BTC];

  constructor(
    private bridgeService: BridgeService,
    private networkService: NetworkService,
    private accountsService: AccountsService,
    private balancesService: BalancesService,
    private walletService: WalletService
  ) {}

  handle = async (
    request: ExtensionConnectionMessage
  ): Promise<ExtensionConnectionMessageResponse<{ hash: string }>> => {
    const { config } = await this.bridgeService.updateBridgeConfig();

    if (!config) {
      return {
        ...request,
        error: 'Not ready',
      };
    }

    const [amountInSatoshis] = request.params || [];

    const { inputs, outputs } = getBtcTransaction(
      config,
      this.addressBTC,
      this.utxos,
      amountInSatoshis
    );
    const [signedTx, error] = await resolve(
      this.walletService.sign({
        ins: inputs,
        outs: outputs,
      })
    );

    if (error) {
      return {
        ...request,
        error: error.toString(),
      };
    }

    const hash = await this.networkService.sendTransaction(signedTx);

    return {
      ...request,
      result: { hash },
    };
  };

  private get addressBTC() {
    if (!this.accountsService.activeAccount) throw new Error('Not ready');
    return this.accountsService.activeAccount.addressBTC;
  }

  private get utxos() {
    const token = this.balancesService.balances[this.addressBTC]?.[0];
    return token?.utxos || [];
  }
}
