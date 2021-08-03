import { JsonRpcRequest } from './jsonRpcEngine';
import { store } from '@src/store/store';
import { formatAndLog, LoggerColors } from '../utils/logging';
import { DOMAIN_METADATA_METHOD } from '../permissionsController';
import { getAccountsFromWallet, walletService } from '@src/background/services';

export default {
  async metamask_getProviderState(data) {
    const wallet = await walletService.wallet.promisify();
    return {
      ...data,
      result: {
        isUnlocked: store.extensionStore.isUnlocked,
        chainId: wallet.getAddressC(),
        networkVersion: 'avax',
        accounts: getAccountsFromWallet(wallet),
      },
    };
  },
  async [DOMAIN_METADATA_METHOD](data) {
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
