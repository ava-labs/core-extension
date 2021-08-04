import { JsonRpcRequest } from './jsonRpcEngine';
import { store } from '@src/store/store';
import { formatAndLog, LoggerColors } from '../utils/logging';
import { DOMAIN_METADATA_METHOD } from '../permissionsController';
import { getAccountsFromWallet, walletService } from '@src/background/services';
import { AddEthChainParams } from '../models';
import { networks } from '@src/contexts/NetworkProvider';

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

  /**
   * @link https://eips.ethereum.org/EIPS/eip-3085
   * @param data
   */
  async wallet_addEthereumChain(data: JsonRpcRequest<AddEthChainParams[]>) {
    const params = data.params;
    const supportedChainIds = Array.from(networks.values()).map(
      (network) => network.chainId
    );
    const chainsRequestedIsSupported = params?.every((chainRequested) =>
      supportedChainIds.includes(chainRequested.chainId)
    );
    return {
      ...data,
      ...(chainsRequestedIsSupported
        ? { result: null }
        : {
            error: {
              code: 0,
              message:
                'One or more chains requested are not supported by this extension',
            },
          }),
    };
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
