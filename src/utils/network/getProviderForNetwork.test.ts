import {
  BITCOIN_NETWORK,
  BITCOIN_TEST_NETWORK,
  NetworkVMType,
} from '@avalabs/chains-sdk';
import {
  BitcoinProvider,
  JsonRpcBatchInternal,
  Avalanche,
} from '@avalabs/wallets-sdk';
import { FetchRequest, Network } from 'ethers';
import { addGlacierAPIKeyIfNeeded } from './addGlacierAPIKeyIfNeeded';
import { getProviderForNetwork } from './getProviderForNetwork';
import { decorateWithCaipId } from '../caipConversion';

jest.mock('@avalabs/wallets-sdk', () => {
  const BitcoinProviderMock = jest.fn();
  const JsonRpcBatchInternalMock = jest.fn();
  const getDefaultFujiProviderMock = jest.fn();
  const getDefaultMainnetProviderMock = jest.fn();
  const actual = jest.requireActual('@avalabs/wallets-sdk');

  return {
    ...actual,
    BitcoinProvider: BitcoinProviderMock,
    JsonRpcBatchInternal: JsonRpcBatchInternalMock,
    Avalanche: {
      ...actual.Avalanche,
      JsonRpcProvider: {
        getDefaultFujiProvider: getDefaultFujiProviderMock,
        getDefaultMainnetProvider: getDefaultMainnetProviderMock,
      },
    },
  };
});

jest.mock('ethers', () => ({
  ...jest.requireActual('ethers'),
  FetchRequest: jest.fn(),
}));

jest.mock('./addGlacierAPIKeyIfNeeded', () => ({
  addGlacierAPIKeyIfNeeded: jest.fn(),
}));

jest.mock('@avalabs/chains-sdk', () => ({
  ...jest.requireActual('@avalabs/chains-sdk'),
  getChainsAndTokens: jest.fn(),
}));

const mockNetwork = (
  vmName: NetworkVMType,
  isTestnet?: boolean,
  overrides = {}
) =>
  decorateWithCaipId({
    chainName: 'test chain',
    chainId: 123,
    vmName,
    rpcUrl: 'https://rpcurl.example',
    networkToken: {
      name: 'test network token',
      symbol: 'TNT',
      description: '',
      decimals: 18,
      logoUri: '',
    },
    logoUri: '',
    primaryColor: 'blue',
    isTestnet: isTestnet ?? true,
    ...overrides,
  });

describe('src/utils/network/getProviderForNetwork', () => {
  const mockJsonRpcBatchInternalInstance = {};
  const mockBitcoinProviderInstance = {};
  const mockFujiProviderInstance = {};
  const mockMainnetProviderInstance = {};

  beforeEach(() => {
    (addGlacierAPIKeyIfNeeded as jest.Mock).mockImplementation((v) => v);
    (JsonRpcBatchInternal as unknown as jest.Mock).mockReturnValue(
      mockJsonRpcBatchInternalInstance
    );
    (BitcoinProvider as jest.Mock).mockReturnValue(mockBitcoinProviderInstance);
    (
      Avalanche.JsonRpcProvider.getDefaultFujiProvider as jest.Mock
    ).mockReturnValue(mockFujiProviderInstance);
    (
      Avalanche.JsonRpcProvider.getDefaultMainnetProvider as jest.Mock
    ).mockReturnValue(mockMainnetProviderInstance);
    jest.mocked(FetchRequest).mockImplementation((url) => ({ url } as any));
  });

  it('returns a json rpc provider for evm chains', () => {
    const mockEVMNetwork = mockNetwork(NetworkVMType.EVM);
    const provider = getProviderForNetwork(mockEVMNetwork);

    expect(JsonRpcBatchInternal).toHaveBeenCalledTimes(1);
    expect(JsonRpcBatchInternal).toHaveBeenCalledWith(
      40,
      expect.objectContaining({ url: mockEVMNetwork.rpcUrl }),
      new Network(mockEVMNetwork.chainName, mockEVMNetwork.chainId)
    );
    expect((provider as JsonRpcBatchInternal).pollingInterval).toEqual(2000);
    expect(provider).toBe(mockJsonRpcBatchInternalInstance);
  });

  it('applies custom headers if they are configured', async () => {
    const fetchConfig = {
      setHeader: jest.fn(),
    };
    jest.mocked(FetchRequest).mockReturnValue(fetchConfig as any);

    const mockEVMNetwork = mockNetwork(NetworkVMType.EVM, false, {
      customRpcHeaders: {
        'X-Glacier-Api-Key': 'my-elite-key',
      },
    });

    getProviderForNetwork(mockEVMNetwork);

    expect(fetchConfig.setHeader).toHaveBeenCalledTimes(1);
    expect(fetchConfig.setHeader).toHaveBeenCalledWith(
      'X-Glacier-Api-Key',
      'my-elite-key'
    );

    expect(JsonRpcBatchInternal).toHaveBeenCalledTimes(1);
    expect(JsonRpcBatchInternal).toHaveBeenCalledWith(
      40,
      fetchConfig,
      new Network(mockEVMNetwork.chainName, mockEVMNetwork.chainId)
    );
  });

  it('uses multicall when requested', () => {
    const mockEVMNetwork = mockNetwork(NetworkVMType.EVM);
    const provider = getProviderForNetwork(
      {
        ...mockEVMNetwork,
        utilityAddresses: {
          multicall: '0x11111eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
        },
      },
      true
    );

    expect(provider).toBe(mockJsonRpcBatchInternalInstance);
    expect(JsonRpcBatchInternal).toHaveBeenCalledTimes(1);
    expect(JsonRpcBatchInternal).toHaveBeenCalledWith(
      {
        maxCalls: 40,
        multiContractAddress: '0x11111eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
      },
      expect.objectContaining({ url: mockEVMNetwork.rpcUrl }),
      new Network(mockEVMNetwork.chainName, mockEVMNetwork.chainId)
    );
  });

  it('adds glacier api key for glacier urls', () => {
    (addGlacierAPIKeyIfNeeded as jest.Mock).mockReturnValue(
      'https://urlwithglacierkey.example'
    );

    const mockEVMNetwork = mockNetwork(NetworkVMType.EVM);
    const provider = getProviderForNetwork(mockEVMNetwork);

    expect(provider).toBe(mockJsonRpcBatchInternalInstance);
    expect(addGlacierAPIKeyIfNeeded).toHaveBeenCalledWith(
      mockEVMNetwork.rpcUrl
    );
    expect(JsonRpcBatchInternal).toHaveBeenCalledTimes(1);
    expect(JsonRpcBatchInternal).toHaveBeenCalledWith(
      40,
      expect.objectContaining({ url: 'https://urlwithglacierkey.example' }),
      new Network(mockEVMNetwork.chainName, mockEVMNetwork.chainId)
    );
  });

  it('returns bitcoin provider for BTC testnet', () => {
    const provider = getProviderForNetwork(
      decorateWithCaipId(BITCOIN_TEST_NETWORK)
    );

    expect(provider).toBe(mockBitcoinProviderInstance);
    expect(BitcoinProvider).toHaveBeenCalledTimes(1);
    expect(BitcoinProvider).toHaveBeenCalledWith(
      false,
      undefined,
      `${process.env.PROXY_URL}/proxy/nownodes/btcbook-testnet`,
      `${process.env.PROXY_URL}/proxy/nownodes/btc-testnet`,
      { token: process.env.GLACIER_API_KEY }
    );
  });

  it('returns bitcoin provider for BTC mainnet', () => {
    const provider = getProviderForNetwork(decorateWithCaipId(BITCOIN_NETWORK));

    expect(provider).toBe(mockBitcoinProviderInstance);
    expect(BitcoinProvider).toHaveBeenCalledTimes(1);
    expect(BitcoinProvider).toHaveBeenCalledWith(
      true,
      undefined,
      `${process.env.PROXY_URL}/proxy/nownodes/btcbook`,
      `${process.env.PROXY_URL}/proxy/nownodes/btc`,
      { token: process.env.GLACIER_API_KEY }
    );
  });

  it('returns fuji provider for X-Chain test network', () => {
    const mockAVMNetwork = mockNetwork(NetworkVMType.AVM);
    const provider = getProviderForNetwork(mockAVMNetwork);

    expect(provider).toBe(mockFujiProviderInstance);
    expect(
      Avalanche.JsonRpcProvider.getDefaultFujiProvider
    ).toHaveBeenCalledTimes(1);
  });

  it('returns mainnet provider for X-Chain network', () => {
    const mockAVMNetwork = mockNetwork(NetworkVMType.AVM, false);
    const provider = getProviderForNetwork(mockAVMNetwork);

    expect(provider).toBe(mockMainnetProviderInstance);
    expect(
      Avalanche.JsonRpcProvider.getDefaultMainnetProvider
    ).toHaveBeenCalledTimes(1);
  });

  it('returns fuji provider for P-Chain test network', () => {
    const mockAVMNetwork = mockNetwork(NetworkVMType.PVM);
    const provider = getProviderForNetwork(mockAVMNetwork);

    expect(provider).toBe(mockFujiProviderInstance);
    expect(
      Avalanche.JsonRpcProvider.getDefaultFujiProvider
    ).toHaveBeenCalledTimes(1);
  });

  it('returns mainnet provider for P-Chain network', () => {
    const mockAVMNetwork = mockNetwork(NetworkVMType.PVM, false);
    const provider = getProviderForNetwork(mockAVMNetwork);

    expect(provider).toBe(mockMainnetProviderInstance);
    expect(
      Avalanche.JsonRpcProvider.getDefaultMainnetProvider
    ).toHaveBeenCalledTimes(1);
  });

  it('returns error when VM is not supported', () => {
    const mockEVMNetwork = mockNetwork(NetworkVMType.EVM);
    expect(() => {
      getProviderForNetwork({
        ...mockEVMNetwork,
        vmName: 'CRAPPYVM' as unknown as NetworkVMType,
      });
    }).toThrow(new Error('unsupported network'));
  });
});
