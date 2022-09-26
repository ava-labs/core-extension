import { BalancesServiceEVM } from '@src/background/services/balances/BalancesServiceEVM';
import { NetworkService } from '@src/background/services/network/NetworkService';
import { BalancesServiceBTC } from '@src/background/services/balances/BalancesServiceBTC';
import { singleton } from 'tsyringe';
import { TokenWithBalance } from '@src/background/services/balances/models';
import { Network, ChainId, NetworkVMType } from '@avalabs/chains-sdk';
import { Account } from '../accounts/models';
import { isEthereumNetwork } from '../network/utils/isEthereumNetwork';
import { BalancesServiceGlacier } from './BalancesServiceGlacier';
import { GlacierService } from '../glacier/GlacierService';

@singleton()
export class BalancesService {
  constructor(
    private balancesServiceEVM: BalancesServiceEVM,
    private balancesServiceBTC: BalancesServiceBTC,
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
    accounts: Account[]
  ): Promise<Record<string, TokenWithBalance[]>> {
    const isSupportedNetwork = await this.glacierService.isNetworkSupported(
      network.chainId
    );

    if (isSupportedNetwork) {
      return await this.balanceServiceGlacier.getBalances(accounts, network);
    }

    // if the above fails in anyway we simply fallback to making the calls oursleves

    const getBalanceForProvider = (provider) => {
      const balanceService = this.getBalanceServiceByProvider(provider);
      return balanceService.getBalances(accounts, network);
    };

    const btcNetworks = [ChainId.BITCOIN, ChainId.BITCOIN_TESTNET];

    if (btcNetworks.includes(network.chainId)) {
      const provider = await this.networkService.getBitcoinProvider();
      return getBalanceForProvider(provider);
    } else if (isEthereumNetwork(network)) {
      const provider = await this.networkService.getEthereumProvider();
      return getBalanceForProvider(provider);
    } else if (network.vmName === NetworkVMType.EVM) {
      const provider = await this.networkService.getProviderForNetwork(
        network,
        true
      );
      return getBalanceForProvider(provider);
    } else {
      throw new Error('unsupported network');
    }
  }
}
