import { singleton } from 'tsyringe';
import { NetworkService } from '../network/NetworkService';
import { ChainId, NetworkVMType } from '@avalabs/chains-sdk';
import { HistoryServiceBTC } from './HistoryServiceBTC';
import { HistoryServiceCChain } from './HistoryServiceCChain';
import { HistoryServiceSubnet } from './HistoryServiceSubnet';
import { resolve } from '@avalabs/utils-sdk';
import { HistoryServiceETH } from './HistoryServiceETH';

@singleton()
export class HistoryService {
  constructor(
    private networkService: NetworkService,
    private btcHistoryService: HistoryServiceBTC,
    private cChainHistorySerive: HistoryServiceCChain,
    private subnetHistoryService: HistoryServiceSubnet,
    private ethHistoryService: HistoryServiceETH
  ) {}

  async getTxHistory() {
    const network = await this.networkService.activeNetwork.promisify();

    if (network) {
      if (network.vmName === NetworkVMType.BITCOIN) {
        return await this.btcHistoryService.getHistory(network);
      } else if (
        ChainId.ETHEREUM_HOMESTEAD === network.chainId ||
        ChainId.ETHEREUM_TEST_RINKEBY === network.chainId
      ) {
        return await this.ethHistoryService.getHistory(network);
      } else if (
        ChainId.AVALANCHE_MAINNET_ID === network.chainId ||
        ChainId.AVALANCHE_TESTNET_ID === network.chainId
      ) {
        return await this.cChainHistorySerive.getHistory(network);
      } else {
        const [res] = await resolve(
          this.subnetHistoryService.getHistory(network)
        );
        return res || [];
      }
    }
    return [];
  }
}
