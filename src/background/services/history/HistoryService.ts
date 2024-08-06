import { singleton } from 'tsyringe';
import { NetworkVMType } from '@avalabs/core-chains-sdk';

import { NetworkWithCaipId } from '../network/models';
import { GlacierService } from '../glacier/GlacierService';
import { isPchainNetwork } from '../network/utils/isAvalanchePchainNetwork';
import { isXchainNetwork } from '../network/utils/isAvalancheXchainNetwork';
import { isEthereumNetwork } from '../network/utils/isEthereumNetwork';

import { HistoryServiceBTC } from './HistoryServiceBTC';
import { HistoryServiceETH } from './HistoryServiceETH';
import { HistoryServicePVM } from './HistoryServicePVM';
import { HistoryServiceAVM } from './HistoryServiceAVM';
import { HistoryServiceGlacier } from './HistoryServiceGlacier';

@singleton()
export class HistoryService {
  constructor(
    private btcHistoryService: HistoryServiceBTC,
    private ethHistoryService: HistoryServiceETH,
    private glacierHistoryService: HistoryServiceGlacier,
    private glacierService: GlacierService,
    private historyServiceAVM: HistoryServiceAVM,
    private historyServicePVM: HistoryServicePVM
  ) {}

  async getTxHistory(network: NetworkWithCaipId) {
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

    return [];
  }
}
