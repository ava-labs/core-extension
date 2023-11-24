import {
  Blockchain,
  getAssets,
  getMaxTransferAmount,
} from '@avalabs/bridge-sdk';
import { JsonRpcBatchInternal } from '@avalabs/wallets-sdk';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import Big from 'big.js';
import { BN } from 'bn.js';
import { TokenType, TokenWithBalance } from '../../balances/models';
import { GetEthMaxTransferAmountHandler } from './getEthMaxTransferAmount';

jest.mock('@avalabs/bridge-sdk', () => {
  const originalModule = jest.requireActual('@avalabs/bridge-sdk');
  return {
    ...originalModule,
    getAssets: jest.fn(),
    getMaxTransferAmount: jest.fn(),
  };
});

describe('background/services/bridge/handlers/getEthMaxTransferAmount', () => {
  const activeNetworkMock = {
    chainId: 1,
  } as any;
  const mockProvider = new JsonRpcBatchInternal(1);
  const networkServiceMock = {
    activeNetwork: activeNetworkMock,
    getProviderForNetwork: jest.fn(),
  } as any;
  const bridgeServiceMock = {
    bridgeConfig: {
      config: {
        critical: {
          assets: [{ symbol: 'WETH' }],
        },
      },
    },
  } as any;
  const balanceAggregatorServiceMock = {
    balances: {
      '1': {
        '0x11111eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee': [
          {
            type: TokenType.NATIVE,
            balance: new BN('1000000'),
            decimals: 4,
            name: 'NativeTestToken',
            symbol: 'NTT',
            description: '',
            logoUri: '',
          },
        ] as TokenWithBalance[],
      },
    },
  } as any;
  const accountsServiceMock = {
    activeAccount: {
      addressC: '0x11111eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    },
  } as any;

  beforeEach(() => {
    jest.resetAllMocks();

    networkServiceMock.activeNetwork = activeNetworkMock;
    networkServiceMock.getProviderForNetwork.mockReturnValue(mockProvider);
  });

  it('returns error when network is not set', async () => {
    networkServiceMock.activeNetwork = undefined;

    const handler = new GetEthMaxTransferAmountHandler(
      bridgeServiceMock,
      networkServiceMock,
      balanceAggregatorServiceMock,
      accountsServiceMock
    );
    const request = {
      id: '1',
      method: ExtensionRequest.BRIDGE_GET_ETH_MAX_TRANSFER_AMOUNT,
      params: ['NTT'],
    } as any;
    const result = await handler.handle(request);

    expect(result).toEqual({
      ...request,
      error: 'network or account not found',
    });
  });

  it('returns error when account is not found', async () => {
    const handler = new GetEthMaxTransferAmountHandler(
      bridgeServiceMock,
      networkServiceMock,
      balanceAggregatorServiceMock,
      { activeAccount: undefined } as any
    );
    const request = {
      id: '1',
      method: ExtensionRequest.BRIDGE_GET_ETH_MAX_TRANSFER_AMOUNT,
      params: ['NTT'],
    } as any;
    const result = await handler.handle(request);

    expect(result).toEqual({
      ...request,
      error: 'network or account not found',
    });
  });

  it('returns error when not on ethereum network', async () => {
    networkServiceMock.activeNetwork = {
      chainId: 1234,
    };

    const handler = new GetEthMaxTransferAmountHandler(
      bridgeServiceMock,
      networkServiceMock,
      balanceAggregatorServiceMock,
      accountsServiceMock
    );
    const request = {
      id: '1',
      method: ExtensionRequest.BRIDGE_GET_ETH_MAX_TRANSFER_AMOUNT,
      params: ['NTT'],
    } as any;
    const result = await handler.handle(request);

    expect(result).toEqual({
      ...request,
      error: 'not on ethereum network',
    });
  });

  it('returns error if token not found', async () => {
    const handler = new GetEthMaxTransferAmountHandler(
      bridgeServiceMock,
      networkServiceMock,
      balanceAggregatorServiceMock,
      accountsServiceMock
    );
    const request = {
      id: '1',
      method: ExtensionRequest.BRIDGE_GET_ETH_MAX_TRANSFER_AMOUNT,
      params: ['UNKOWN'],
    } as any;
    const result = await handler.handle(request);

    expect(result).toEqual({
      ...request,
      error: 'unable to determine max amount',
    });
  });

  it('returns error when provider is missing', async () => {
    const handler = new GetEthMaxTransferAmountHandler(
      bridgeServiceMock,
      networkServiceMock,
      balanceAggregatorServiceMock,
      accountsServiceMock
    );

    // make sure provider is not a JsonRpcBatchInternal
    networkServiceMock.getProviderForNetwork.mockReturnValue({} as any);
    const request = {
      id: '1',
      method: ExtensionRequest.BRIDGE_GET_ETH_MAX_TRANSFER_AMOUNT,
      params: ['NTT'],
    } as any;
    const result = await handler.handle(request);

    expect(result).toEqual({
      ...request,
      error: 'unable to determine max amount',
    });
  });

  it('returns error when bridge config is missing', async () => {
    const handler = new GetEthMaxTransferAmountHandler(
      {
        bridgeConfig: {
          config: undefined,
        },
      } as any,
      networkServiceMock,
      balanceAggregatorServiceMock,
      accountsServiceMock
    );
    const request = {
      id: '1',
      method: ExtensionRequest.BRIDGE_GET_ETH_MAX_TRANSFER_AMOUNT,
      params: ['NTT'],
    } as any;
    const result = await handler.handle(request);

    expect(result).toEqual({
      ...request,
      error: 'unable to determine max amount',
    });
  });

  it('catches errors when config is missing', async () => {
    class BridgeServiceErrorMock {
      public get bridgeConfig(): any {
        throw new Error('bridge config error');
      }
    }

    const handler = new GetEthMaxTransferAmountHandler(
      new BridgeServiceErrorMock() as any,
      networkServiceMock,
      balanceAggregatorServiceMock,
      accountsServiceMock
    );
    const request = {
      id: '1',
      method: ExtensionRequest.BRIDGE_GET_ETH_MAX_TRANSFER_AMOUNT,
      params: ['NTT'],
    } as any;
    const result = await handler.handle(request);

    expect(result).toEqual({
      ...request,
      error: 'Error: bridge config error',
    });
  });

  it('calculates max transfer amount', async () => {
    const handler = new GetEthMaxTransferAmountHandler(
      bridgeServiceMock,
      networkServiceMock,
      balanceAggregatorServiceMock,
      accountsServiceMock
    );

    (getMaxTransferAmount as jest.Mock).mockResolvedValue(new Big(1000));
    const ethAssets = Symbol('ethAssets');
    (getAssets as jest.Mock).mockReturnValue(ethAssets);

    const request = {
      id: '1',
      method: ExtensionRequest.BRIDGE_GET_ETH_MAX_TRANSFER_AMOUNT,
      params: ['NTT'],
    } as any;
    const result = await handler.handle(request);

    expect(getMaxTransferAmount).toHaveBeenCalledTimes(1);
    expect(getMaxTransferAmount).toHaveBeenCalledWith({
      currentBlockchain: Blockchain.ETHEREUM,
      balance: new Big('100'),
      currentAsset: 'NTT',
      assets: ethAssets,
      provider: mockProvider,
      config: bridgeServiceMock.bridgeConfig.config,
    });

    expect(result).toEqual({
      ...request,
      result: new Big(1000),
    });
  });
});
