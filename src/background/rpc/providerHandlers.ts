import { JsonRpcRequest } from './jsonRpcEngine';
import { store } from '@src/store/store';
import { formatAndLog, LoggerColors } from '../utils/logging';

// const AVALANCHE_AGGREGATOR_NAME = "metamask";

export default {
  async metamask_getProviderState(data) {
    return {
      ...data,
      result: {
        isUnlocked: store.extensionStore.isUnlocked,
        chainId: store.walletStore.addrC,
        networkVersion: 'avax',
        accounts: store.extensionStore.isUnlocked
          ? store.walletStore.accounts
          : [],
      },
    };
  },
  async metamask_sendDomainMetadata(data) {
    return { ...data, result: data.params };
  },

  getHandlerForKey(data: JsonRpcRequest<any>) {
    const handler = this[data.method];
    return (
      handler &&
      (() =>
        handler(data).then((result) => {
          formatAndLog(
            'Wallet Controller: (provider handler response)',
            result,
            {
              color: LoggerColors.success,
            }
          );
          return result;
        }))
    );
  },
};
