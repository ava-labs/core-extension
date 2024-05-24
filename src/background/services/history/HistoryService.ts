import { singleton } from 'tsyringe';
import { NetworkService } from '../network/NetworkService';
import { NetworkVMType } from '@avalabs/chains-sdk';
import { HistoryServiceBTC } from './HistoryServiceBTC';
import { HistoryServiceETH } from './HistoryServiceETH';
import { isEthereumNetwork } from '../network/utils/isEthereumNetwork';
import { GlacierService } from '../glacier/GlacierService';
import { HistoryServiceGlacier } from './HistoryServiceGlacier';
import { isPchainNetwork } from '../network/utils/isAvalanchePchainNetwork';
import { HistoryServicePVM } from './HistoryServicePVM';
import { isXchainNetwork } from '../network/utils/isAvalancheXchainNetwork';
import { HistoryServiceAVM } from './HistoryServiceAVM';

@singleton()
export class HistoryService {
  constructor(
    private networkService: NetworkService,
    private btcHistoryService: HistoryServiceBTC,
    private ethHistoryService: HistoryServiceETH,
    private glacierHistoryService: HistoryServiceGlacier,
    private glacierService: GlacierService,
    private historyServiceAVM: HistoryServiceAVM,
    private historyServicePVM: HistoryServicePVM
  ) {}

  async getTxHistory() {
    const network = this.networkService.activeNetwork;

    if (network) {
      const isSupportedNetwork = await this.glacierService.isNetworkSupported(
        network.chainId
      );

      if (isSupportedNetwork) {
        return await this.glacierHistoryService.getHistory(network);
      }

      if (network.vmName === NetworkVMType.BITCOIN) {
        return await this.btcHistoryService.getHistory(network);
      } else if (isEthereumNetwork(network)) {
        return await this.ethHistoryService.getHistory(network);
      } else if (isPchainNetwork(network)) {
        return await this.historyServicePVM.getHistory(network);
      } else if (isXchainNetwork(network)) {
        return await this.historyServiceAVM.getHistory(network);
      }
    }
    return [];
  }
}
