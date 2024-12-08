import { NetworkService } from '@src/background/services/network/NetworkService';
import { ActiveNetworkMiddleware } from './ActiveNetworkMiddleware';
import { RpcMethod } from '@avalabs/vm-module-types';
import getTargetNetworkForTx from '@src/background/services/wallet/handlers/eth_sendTransaction/utils/getTargetNetworkForTx';

jest.mock(
  '@src/background/services/wallet/handlers/eth_sendTransaction/utils/getTargetNetworkForTx',
);

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
});
