import { EVMBalancesService } from '@src/background/services/balances/EVMBalancesService';
import { NetworkService } from '@src/background/services/network/NetworkService';
import { BTCBalancesService } from '@src/background/services/balances/BTCBalancesService';
import { singleton } from 'tsyringe';
import { TokenWithBalance } from '@src/background/services/balances/models';
import { Network, ChainId, NetworkVMType } from '@avalabs/chains-sdk';

@singleton()
export class BalancesService {
  constructor(
    private evmBalancesService: EVMBalancesService,
    private btcBalancesService: BTCBalancesService,
    private networkService: NetworkService
  ) {}

  private getBalanceServiceByProvider(provider: any) {
    const balanceService = [
      this.evmBalancesService,
      this.btcBalancesService,
    ].find((service) => {
      return !!service.getServiceForProvider(provider);
    });

    if (balanceService) return balanceService;
    throw new Error('no balances service for this provider is supported');
  }

  async getBalanceForNetwork(
    network: Network,
    userAddress: string
  ): Promise<TokenWithBalance[]> {
    /**
     * At this point we need to call glacier
     *    1. check if its up and supports the current chain
     *    2. if it supports it we need to get the balances and tokens from there
     *    3. polling will be against the glacier api
     *
     * Otherwise the code below should run
     */
    const getBalanceForProvider = (provider) => {
      const balanceService = this.getBalanceServiceByProvider(provider);
      return balanceService.getBalances(userAddress, network);
    };

    const btcNetworks = [ChainId.BITCOIN, ChainId.BITCOIN_TESTNET];
    const ethNetworks = [
      ChainId.ETHEREUM_HOMESTEAD,
      ChainId.ETHEREUM_TEST_RINKEBY,
    ];

    if (btcNetworks.includes(network.chainId)) {
      const provider = await this.networkService.getBitcoinProvider();
      return getBalanceForProvider(provider);
    } else if (ethNetworks.includes(network.chainId)) {
      const provider = await this.networkService.getEthereumProvider();
      return getBalanceForProvider(provider);
    } else if (network.vmName === NetworkVMType.EVM) {
      const provider = await this.networkService.getProviderForNetwork(network);
      return getBalanceForProvider(provider);
    } else {
      throw new Error('unsupported network');
    }
  }
}
