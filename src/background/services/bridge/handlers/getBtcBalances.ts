import {
  ExtensionConnectionMessage,
  ExtensionConnectionMessageResponse,
  ExtensionRequestHandler,
} from '@src/background/connections/models';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import {
  AppConfig,
  Blockchain,
  fetchTokenBalances,
  getBtcAsset,
  getUTXOs,
} from '@avalabs/bridge-sdk';
import { NetworkService } from '../../network/NetworkService';
import { Big } from '@avalabs/avalanche-wallet-sdk';
import { BridgeService } from '../BridgeService';
import { AccountsService } from '../../accounts/AccountsService';
import { getAvalancheProvider } from '../../network/getAvalancheProvider';
import { injectable } from 'tsyringe';

@injectable()
export class BridgeGetBtcBalancesHandler implements ExtensionRequestHandler {
  methods = [ExtensionRequest.BRIDGE_GET_BTC_BALANCES];

  constructor(
    private networkService: NetworkService,
    private bridgeService: BridgeService,
    private accountsService: AccountsService
  ) {}

  private async getBtcBalanceAvalanche(
    config: AppConfig
  ): Promise<Big | undefined> {
    const btcAsset = getBtcAsset(config);
    if (!btcAsset || !this.accountsService.activeAccount?.addressC) {
      return;
    }

    const provider = getAvalancheProvider(this.networkService.activeNetwork);

    const balancesBySymbol = await fetchTokenBalances(
      { [btcAsset.symbol]: btcAsset },
      Blockchain.AVALANCHE,
      provider,
      this.accountsService.activeAccount.addressC
    );

    return balancesBySymbol?.[btcAsset.symbol];
  }

  handle = async (
    request: ExtensionConnectionMessage
  ): Promise<ExtensionConnectionMessageResponse> => {
    const { config } = await this.bridgeService.updateBridgeConfig();
    if (!config || !this.accountsService.activeAccount)
      throw new Error('Not ready');

    const btcAddress = this.accountsService.activeAccount.addressBTC;

    const btcBalanceAvalanche = (
      await this.getBtcBalanceAvalanche(config)
    ).toNumber();
    const { balance: btcBalanceBitcoin, utxos: bitcoinUtxos } = await getUTXOs(
      config,
      btcAddress
    );

    return {
      ...request,
      result: {
        bitcoinUtxos,
        btcAddress,
        btcBalanceAvalanche,
        btcBalanceBitcoin,
      },
    };
  };
}
