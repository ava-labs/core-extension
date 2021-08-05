import { JsonRpcRequest } from './jsonRpcEngine';
import { formatAndLog, LoggerColors } from '../utils/logging';
import { DOMAIN_METADATA_METHOD } from '../permissionsController';
import { wallet } from '@src/background/services';
import { AddEthChainParams } from '../models';
import { firstValueFrom } from 'rxjs';
import { supportedNetworks } from '../services/network/models';
import { getAccountsFromWallet } from '../services/wallet/utils/getAccountsFromWallet';

export default {
  async metamask_getProviderState(data) {
    const walletResult = await firstValueFrom(wallet);
    return {
      ...data,
      result: {
        isUnlocked: true,
        chainId: walletResult.getAddressC(),
        networkVersion: 'avax',
        accounts: getAccountsFromWallet(walletResult),
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
    const supportedChainIds = Array.from(supportedNetworks.values()).map(
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
