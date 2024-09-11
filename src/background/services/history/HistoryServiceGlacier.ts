import { ETHEREUM_ADDRESS } from '@src/utils/bridgeTransactionUtils';
import { singleton } from 'tsyringe';
import { AccountsService } from '../accounts/AccountsService';
import { isBitcoinChainId } from '../network/utils/isBitcoinNetwork';
import { TxHistoryItem } from './models';
import { UnifiedBridgeService } from '../unifiedBridge/UnifiedBridgeService';
import { ModuleManager } from '@src/background/vmModules/ModuleManager';
import { NetworkWithCaipId } from '../network/models';

@singleton()
export class HistoryServiceGlacier {
  constructor(
    private accountsService: AccountsService,
    private unifiedBridgeService: UnifiedBridgeService,
    private moduleManager: ModuleManager
  ) {}

  async getHistory(network: NetworkWithCaipId): Promise<TxHistoryItem[] | []> {
    const account = this.getAddress(network.chainId);

    if (!account) {
      return [];
    }

    const address = this.accountsService.activeAccount?.addressC;

    if (address) {
      const module = await this.moduleManager.loadModuleByNetwork(network);
      const { transactions } = await module.getTransactionHistory({
        address,
        network,
        offset: 25,
      });
      const result = transactions.filter(
        // Filtering txs with 0 value since there is no change in balance
        (transaction) =>
          transaction.tokens.find((token) => Number(token.amount) !== 0)
      );
      return result.map((transaction) => {
        const isBridge =
          this.isBridgeAddress(transaction.from) ||
          this.isBridgeAddress(transaction.to);
        return {
          ...transaction,
          isBridge,
        };
      });
    }

    return [];
  }

  private getAddress(chainId: number) {
    return isBitcoinChainId(chainId)
      ? this.accountsService.activeAccount?.addressBTC
      : this.accountsService.activeAccount?.addressC;
  }

  private isBridgeAddress(address?: string) {
    if (!address) {
      return false;
    }

    return [
      ETHEREUM_ADDRESS,
      ...this.unifiedBridgeService.state.addresses,
    ].includes(address.toLowerCase());
  }
}
