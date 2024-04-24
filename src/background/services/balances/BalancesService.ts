import { BalancesServiceEVM } from '@src/background/services/balances/BalancesServiceEVM';
import { NetworkService } from '@src/background/services/network/NetworkService';
import { BalancesServiceBTC } from '@src/background/services/balances/BalancesServiceBTC';
import { BalancesServicePVM } from '@src/background/services/balances/BalancesServicePVM';
import { singleton } from 'tsyringe';
import { TokenWithBalance } from '@src/background/services/balances/models';
import { Network, ChainId, NetworkVMType } from '@avalabs/chains-sdk';
import { Account } from '../accounts/models';
import { isEthereumNetwork } from '../network/utils/isEthereumNetwork';
import { BalancesServiceGlacier } from './BalancesServiceGlacier';
import { GlacierService } from '../glacier/GlacierService';
import { getProviderForNetwork } from '@src/utils/network/getProviderForNetwork';
import { isPchainNetwork } from '../network/utils/isAvalanchePchainNetwork';
import { TokensPriceShortData } from '../tokens/models';

@singleton()
export class BalancesService {
  constructor(
    private balancesServiceEVM: BalancesServiceEVM,
    private balancesServiceBTC: BalancesServiceBTC,
    private balancesServicePVM: BalancesServicePVM,
    private networkService: NetworkService,
    private balanceServiceGlacier: BalancesServiceGlacier,
    private glacierService: GlacierService
  ) {}

  private getBalanceServiceByProvider(provider: any) {
    const balanceService = [
      this.balancesServiceEVM,
      this.balancesServiceBTC,
    ].find((service) => {
      return !!service.getServiceForProvider(provider);
    });

    if (balanceService) return balanceService;
    throw new Error('no balances service for this provider is supported');
  }

  async getBalancesForNetwork(
    network: Network,
    accounts: Account[],
    priceChanges?: TokensPriceShortData
  ): Promise<Record<string, Record<string, TokenWithBalance>>> {
    if (isPchainNetwork(network)) {
      const pChainBalances = await this.balancesServicePVM.getBalances({
        accounts,
        network,
      });
      return pChainBalances;
    }

    const isSupportedNetwork = await this.glacierService.isNetworkSupported(
      network.chainId
    );

    if (isSupportedNetwork) {
      return await this.balanceServiceGlacier.getBalances(
        accounts,
        network,
        priceChanges
      );
    }

    // if the above fails in anyway we simply fallback to making the calls oursleves

    const getBalanceForProvider = (provider) => {
      const balanceService = this.getBalanceServiceByProvider(provider);
      return balanceService.getBalances(accounts, network, priceChanges);
    };

    const btcNetworks = [ChainId.BITCOIN, ChainId.BITCOIN_TESTNET];

    if (btcNetworks.includes(network.chainId)) {
      const provider = await this.networkService.getBitcoinProvider();
      return getBalanceForProvider(provider);
    } else if (isEthereumNetwork(network)) {
      const provider = await this.networkService.getEthereumProvider();
      return getBalanceForProvider(provider);
    } else if (network.vmName === NetworkVMType.EVM) {
      const provider = getProviderForNetwork(network, true);
      return getBalanceForProvider(provider);
    } else {
      throw new Error('unsupported network');
    }
  }
}
