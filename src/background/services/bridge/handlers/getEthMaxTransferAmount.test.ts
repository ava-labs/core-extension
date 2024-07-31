import {
  Blockchain,
  getAssets,
  getMaxTransferAmount,
} from '@avalabs/core-bridge-sdk';
import { JsonRpcBatchInternal } from '@avalabs/core-wallets-sdk';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import Big from 'big.js';
import { BN } from 'bn.js';
import { TokenType, TokenWithBalance } from '../../balances/models';
import { GetEthMaxTransferAmountHandler } from './getEthMaxTransferAmount';
import { getProviderForNetwork } from '@src/utils/network/getProviderForNetwork';
import { buildRpcCall } from '@src/tests/test-utils';
import { ChainId } from '@avalabs/core-chains-sdk';

jest.mock('@avalabs/core-bridge-sdk', () => {
  const originalModule = jest.requireActual('@avalabs/core-bridge-sdk');
  return {
    ...originalModule,
    getAssets: jest.fn(),
    getMaxTransferAmount: jest.fn(),
  };
});

jest.mock('@src/utils/network/getProviderForNetwork');

describe('background/services/bridge/handlers/getEthMaxTransferAmount', () => {
  const mockProvider = new JsonRpcBatchInternal(1);
  const networkServiceMock = {
    getNetwork: jest.fn(),
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
    getBalancesForNetworks: async () => ({
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
    }),
  } as any;
  const accountsServiceMock = {
    activeAccount: {
      addressC: '0x11111eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    },
  } as any;
  const scope = `eip155:${ChainId.ETHEREUM_HOMESTEAD}`;

  beforeEach(() => {
    jest.resetAllMocks();
    jest.mocked(getProviderForNetwork).mockReturnValue(mockProvider);

    jest
      .mocked(networkServiceMock.getNetwork)
      .mockResolvedValue({ chainId: ChainId.ETHEREUM_HOMESTEAD });
  });

  it('returns error when network is not set', async () => {
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

    jest
      .spyOn(networkServiceMock, 'getNetwork')
      .mockResolvedValueOnce(undefined);

    const result = await handler.handle(buildRpcCall(request, scope));

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
    const result = await handler.handle(buildRpcCall(request, scope));

    expect(result).toEqual({
      ...request,
      error: 'network or account not found',
    });
  });

  it('returns error when not on ethereum network', async () => {
    jest
      .mocked(networkServiceMock.getNetwork)
      .mockResolvedValue({ chainId: ChainId.AVALANCHE_MAINNET_ID });

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
    const result = await handler.handle(buildRpcCall(request, 'eip155:43114'));

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
    const result = await handler.handle(buildRpcCall(request, scope));

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
    jest.mocked(getProviderForNetwork).mockReturnValue({} as any);
    const request = {
      id: '1',
      method: ExtensionRequest.BRIDGE_GET_ETH_MAX_TRANSFER_AMOUNT,
      params: ['NTT'],
    } as any;
    const result = await handler.handle(buildRpcCall(request, scope));

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
    const result = await handler.handle(buildRpcCall(request, scope));

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
    const result = await handler.handle(buildRpcCall(request, scope));

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
    const result = await handler.handle(buildRpcCall(request, scope));

    expect(result).toEqual({
      ...request,
      result: new Big(1000),
    });
    expect(getMaxTransferAmount).toHaveBeenCalledTimes(1);
    expect(getMaxTransferAmount).toHaveBeenCalledWith({
      currentBlockchain: Blockchain.ETHEREUM,
      balance: new Big('100'),
      currentAsset: 'NTT',
      assets: ethAssets,
      provider: mockProvider,
      config: bridgeServiceMock.bridgeConfig.config,
    });
  });
});
