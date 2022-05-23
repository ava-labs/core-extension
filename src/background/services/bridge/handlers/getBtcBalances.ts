import {
  Blockchain,
  btcToSatoshi,
  fetchTokenBalances,
  getBtcAsset,
} from '@avalabs/bridge-sdk';
import { BIG_ZERO } from '@avalabs/utils-sdk';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import {
  ExtensionConnectionMessage,
  ExtensionConnectionMessageResponse,
  ExtensionRequestHandler,
} from '@src/background/connections/models';
import { BN } from 'bn.js';
import { injectable } from 'tsyringe';
import { AccountsService } from '../../accounts/AccountsService';
import { BalancesService } from '../../balances/BalancesService';
import { getAvalancheProvider } from '../../network/getAvalancheProvider';
import { NetworkService } from '../../network/NetworkService';
import { BridgeService } from '../BridgeService';

@injectable()
export class BridgeGetBtcBalancesHandler implements ExtensionRequestHandler {
  methods = [ExtensionRequest.BRIDGE_GET_BTC_BALANCES];

  constructor(
    private networkService: NetworkService,
    private bridgeService: BridgeService,
    private balancesService: BalancesService,
    private accountsService: AccountsService
  ) {}

  private async getBtcBalanceAvalanche(): Promise<number> {
    const { config } = this.bridgeService.bridgeConfig;
    if (!config || !this.accountsService.activeAccount) {
      throw new Error('Not ready');
    }
    const btcAsset = getBtcAsset(config);
    if (!btcAsset) throw new Error('Not ready');

    const provider = getAvalancheProvider(this.networkService.activeNetwork);

    const balancesBySymbol = await fetchTokenBalances(
      { [btcAsset.symbol]: btcAsset },
      Blockchain.AVALANCHE,
      provider,
      this.accountsService.activeAccount.addressC
    );

    return btcToSatoshi(balancesBySymbol?.[btcAsset.symbol] || BIG_ZERO);
  }

  handle = async (
    request: ExtensionConnectionMessage
  ): Promise<ExtensionConnectionMessageResponse> => {
    const bitcoin = this.bitcoinBalance;

    const btcBalanceAvalanche =
      this.avalancheBalance || (await this.getBtcBalanceAvalanche());

    return {
      ...request,
      result: {
        bitcoinUtxos: bitcoin.utxos,
        btcAddress: this.addressBTC,
        btcBalanceAvalanche,
        btcBalanceBitcoin: bitcoin.balance,
      },
    };
  };

  private get addressBTC() {
    if (!this.accountsService.activeAccount) throw new Error('Not ready');
    return this.accountsService.activeAccount.addressBTC;
  }

  private get addressC() {
    if (!this.accountsService.activeAccount) throw new Error('Not ready');
    return this.accountsService.activeAccount.addressC;
  }

  private get avalancheBalance() {
    const token = this.balancesService.balances[this.addressC]?.find(
      (token) => token.symbol === 'BTC.b'
    );
    return token?.balance ? token.balance.toNumber() : undefined;
  }

  private get bitcoinBalance() {
    const token = this.balancesService.balances[this.addressBTC]?.[0];
    return {
      balance: (token?.balance || new BN(0)).toNumber(),
      utxos: token?.utxos || [],
    };
  }
}
