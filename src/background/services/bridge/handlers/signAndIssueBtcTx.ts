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
import { getBtcTransaction } from '@avalabs/bridge-sdk';
import { NetworkBalanceAggregatorService } from '../../balances/NetworkBalanceAggregatorService';
import { ChainId } from '@avalabs/chains-sdk';

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
    private balancesService: NetworkBalanceAggregatorService,
    private walletService: WalletService
  ) {}

  handle = async (
    request: ExtensionConnectionMessage
  ): Promise<ExtensionConnectionMessageResponse<{ hash: string }>> => {
    const { config } = await this.bridgeService.updateBridgeConfig();
    const bitcoinNetwork = await this.networkService.getBitcoinNetwork();

    if (!config || !bitcoinNetwork) {
      return {
        ...request,
        error: 'Not ready',
      };
    }

    const [amountInSatoshis, feeRate] = request.params || [];

    if (typeof amountInSatoshis !== 'number')
      return { ...request, error: 'Missing amountInSatoshis' };
    if (typeof feeRate !== 'number')
      return { ...request, error: 'Missing feeRate' };

    const { inputs, outputs } = getBtcTransaction(
      config,
      this.addressBTC,
      await this.utxos(),
      amountInSatoshis,
      feeRate
    );

    const [signedTx, error] = await resolve(
      this.walletService.sign({ inputs, outputs }, bitcoinNetwork)
    );

    if (error) {
      return {
        ...request,
        error: error.toString(),
      };
    }

    const hash = await this.networkService.sendTransaction(
      signedTx,
      bitcoinNetwork
    );

    return {
      ...request,
      result: { hash },
    };
  };

  private get addressBTC() {
    if (!this.accountsService.activeAccount) throw new Error('Not ready');
    return this.accountsService.activeAccount.addressBTC;
  }

  private async utxos() {
    const token =
      this.balancesService.balances[
        (await this.networkService.isMainnet())
          ? ChainId.BITCOIN
          : ChainId.BITCOIN_TESTNET
      ]?.[this.addressBTC]?.[0];
    return token?.utxos || [];
  }
}
