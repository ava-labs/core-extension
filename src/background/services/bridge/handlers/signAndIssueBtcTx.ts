import { getBtcTransaction } from '@avalabs/bridge-sdk';
import { ChainId } from '@avalabs/chains-sdk';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { ExtensionRequestHandler } from '@src/background/connections/models';
import { resolve } from '@src/utils/promiseResolver';
import { injectable } from 'tsyringe';
import { AccountsService } from '../../accounts/AccountsService';
import { BalanceAggregatorService } from '../../balances/BalanceAggregatorService';
import { NetworkService } from '../../network/NetworkService';
import { WalletService } from '../../wallet/WalletService';
import { BridgeService } from '../BridgeService';

/**
 * FYI: the input UTXOs to the unsignedTxHex must be owned by the wallet
 * (i.e. the C-chain derived bitcoin address)
 */
type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.BRIDGE_SIGN_ISSUE_BTC,
  { hash: string },
  [amountInSatoshis: number, feeRate: number]
>;

@injectable()
export class BridgeSignIssueBtcHandler implements HandlerType {
  method = ExtensionRequest.BRIDGE_SIGN_ISSUE_BTC as const;

  constructor(
    private bridgeService: BridgeService,
    private networkService: NetworkService,
    private accountsService: AccountsService,
    private balancesService: BalanceAggregatorService,
    private walletService: WalletService
  ) {}

  handle: HandlerType['handle'] = async (request) => {
    const { config } = await this.bridgeService.updateBridgeConfig();
    const bitcoinNetwork = await this.networkService.getBitcoinNetwork();

    if (!config || !bitcoinNetwork) {
      return {
        ...request,
        error: 'Not ready',
      };
    }

    const [amountInSatoshis, feeRate] = request.params;

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
