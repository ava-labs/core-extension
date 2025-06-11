import { NetworkService } from '~/services/network/NetworkService';
import { ActiveNetworkMiddleware } from './ActiveNetworkMiddleware';
import { RpcMethod } from '@avalabs/vm-module-types';
import getTargetNetworkForTx from '~/services/wallet/utils/getTargetNetworkForTx';

jest.mock('~/services/wallet/utils/getTargetNetworkForTx');

describe('src/background/connections/middlewares/ActiveNetworkMiddleware', () => {
  const networkService = {
    getNetwork: jest.fn(),
  } as unknown as NetworkService;

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('errors out for cross-environment EVM transaction attempts', async () => {
    const call = ActiveNetworkMiddleware(networkService);

    const next = jest.fn();
    const onError = jest.fn();
    const error = new Error('Cross-env error');

    jest.mocked(getTargetNetworkForTx).mockRejectedValueOnce(error);

    await call(
      {
        request: {
          params: {
            scope: 'eip155:43114', // C-Chain Mainnet
            request: {
              method: RpcMethod.ETH_SEND_TRANSACTION,
              params: [
                {
                  chainId: '0xa869', // C-Chain Fuji (43113)
                },
              ],
            },
          },
        },
      } as any,
      next,
      onError,
    );

    expect(next).not.toHaveBeenCalled();
    expect(onError).toHaveBeenCalledWith(error);
  });
  it('should not call anything because the method does not need the active network', async () => {
    const call = ActiveNetworkMiddleware(networkService);
    const next = jest.fn();
    const onError = jest.fn();
    await call(
      {
        request: {
          params: {
            scope: 'eip155:43114', // C-Chain Mainnet
            request: {
              method: 'wallet_ANYTHING_BEGINS_WITH_WALLET_',
              params: [
                {
                  chainId: '0xa869', // C-Chain Fuji (43113)
                },
              ],
            },
          },
        },
      } as any,
      next,
      onError,
    );

    expect(getTargetNetworkForTx).not.toHaveBeenCalled();
    expect(networkService.getNetwork).not.toHaveBeenCalled();
  });
});
