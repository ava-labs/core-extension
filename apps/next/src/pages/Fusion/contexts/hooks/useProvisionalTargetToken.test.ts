import { renderHook } from '@testing-library/react';
import { TokenType } from '@avalabs/vm-module-types';
import { ERC_ZERO_ADDRESS } from '@avalabs/fusion-sdk';
import { NetworkVMType } from '@avalabs/core-chains-sdk';

import {
  USDC_ADDRESS_C_CHAIN,
  USDC_ADDRESS_ETHEREUM,
  USDC_ADDRESS_SOLANA,
} from '@core/common';
import { type ChainOption } from '@/components/TokenSelect/components/ChainFilterChips';
import { type FungibleTokenBalance, getUniqueTokenId } from '@core/types';

import { useProvisionalTargetToken } from './useProvisionalTargetToken';

const mockGetNetwork = jest.fn();
const mockResolveToken = jest.fn();
const mockUseTokensLookup = jest.fn();

jest.mock('@core/ui', () => ({
  useNetworkContext: () => ({ getNetwork: mockGetNetwork }),
}));
jest.mock('../../hooks/useTokensLookup', () => ({
  useTokensLookup: (...args: unknown[]) => mockUseTokensLookup(...args),
}));

const cChain = {
  chainId: 43114,
  caipId: 'eip155:43114',
  vmName: NetworkVMType.EVM,
  isTestnet: false,
};
const ethereum = {
  chainId: 1,
  caipId: 'eip155:1',
  vmName: NetworkVMType.EVM,
  isTestnet: false,
};
const solana = {
  chainId: 4503599627370471,
  caipId: 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp',
  vmName: NetworkVMType.SVM,
  isTestnet: false,
};
const fuji = {
  ...cChain,
  chainId: 43113,
  caipId: 'eip155:43113',
  isTestnet: true,
};
const networks: Record<string, unknown> = {
  [cChain.caipId]: cChain,
  [ethereum.caipId]: ethereum,
  [solana.caipId]: solana,
  [fuji.caipId]: fuji,
};

const nativeSource = (
  symbol: string,
  network: { chainId: number; caipId: string },
) =>
  ({
    type: TokenType.NATIVE,
    symbol,
    name: symbol,
    decimals: 18,
    assetType: 'evm_native',
    coreChainId: network.chainId,
    chainCaipId: network.caipId,
    balance: 1n,
  }) as unknown as FungibleTokenBalance;

const erc20Source = (symbol: string) =>
  ({
    type: TokenType.ERC20,
    symbol,
    name: symbol,
    decimals: 6,
    address: '0x1111111111111111111111111111111111111111',
    assetType: 'evm_erc20',
    coreChainId: cChain.chainId,
    chainCaipId: cChain.caipId,
    balance: 1n,
  }) as unknown as FungibleTokenBalance;

const usdc = {
  type: TokenType.ERC20,
  symbol: 'USDC',
  name: 'USD Coin',
  decimals: 6,
  address: USDC_ADDRESS_C_CHAIN,
  assetType: 'evm_erc20',
  coreChainId: cChain.chainId,
  chainCaipId: cChain.caipId,
  balance: 0n,
} as unknown as FungibleTokenBalance;

const nativeAvax = nativeSource('AVAX', cChain);

const defaults = {
  sourceToken: nativeAvax as FungibleTokenBalance | undefined,
  toId: undefined as string | undefined,
  isTargetTokenListLoading: true,
  committedTargetChainId: 'avalanche' as number | 'avalanche' | null,
  targetChainOptions: [
    { chainId: 43114 },
    { chainId: 1 },
    { chainId: 4503599627370471 },
    { chainId: 43113 },
  ] as ChainOption[],
};

const render = (overrides: Partial<typeof defaults> = {}) =>
  renderHook(() => useProvisionalTargetToken({ ...defaults, ...overrides }));

describe('useProvisionalTargetToken', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetNetwork.mockImplementation((id: string | number) =>
      Object.values(networks).find(
        (network) =>
          (network as { chainId: number; caipId: string }).chainId === id ||
          (network as { chainId: number; caipId: string }).caipId === id,
      ),
    );
    mockResolveToken.mockReturnValue(usdc);
    mockUseTokensLookup.mockReturnValue({ resolveToken: mockResolveToken });
  });

  it('resolves the default USDC for AVAX on C-Chain while the list loads', () => {
    const { result } = render();

    expect(result.current).toBe(usdc);
    expect(mockResolveToken).toHaveBeenCalledWith(
      cChain.caipId,
      USDC_ADDRESS_C_CHAIN,
    );
    expect(mockUseTokensLookup).toHaveBeenLastCalledWith(
      [{ network: cChain, addresses: [USDC_ADDRESS_C_CHAIN] }],
      { enabled: true },
    );
  });

  it('resolves the default USDC for ETH on Ethereum and SOL on Solana', () => {
    render({
      sourceToken: nativeSource('ETH', ethereum),
      committedTargetChainId: ethereum.chainId,
    });
    expect(mockResolveToken).toHaveBeenLastCalledWith(
      ethereum.caipId,
      USDC_ADDRESS_ETHEREUM,
    );

    render({
      sourceToken: nativeSource('SOL', solana),
      committedTargetChainId: solana.chainId,
    });
    expect(mockResolveToken).toHaveBeenLastCalledWith(
      solana.caipId,
      USDC_ADDRESS_SOLANA,
    );
  });

  it('resolves a numeric committed chain equal to the source chain', () => {
    const { result } = render({ committedTargetChainId: cChain.chainId });

    expect(result.current).toBe(usdc);
  });

  it('resolves the native token for a non-native source without a default', () => {
    const native = nativeAvax;
    mockResolveToken.mockReturnValue(native);

    const { result } = render({ sourceToken: erc20Source('PEPE') });

    expect(mockResolveToken).toHaveBeenCalledWith(
      cChain.caipId,
      ERC_ZERO_ADDRESS,
    );
    expect(result.current).toBe(native);
  });

  it('returns nothing when the resolved token is the source token', () => {
    mockResolveToken.mockReturnValue(erc20Source('PEPE'));

    const { result } = render({ sourceToken: erc20Source('PEPE') });

    expect(getUniqueTokenId(erc20Source('PEPE'))).toBeDefined();
    expect(result.current).toBeUndefined();
  });

  it('returns nothing for a native source without a configured default', () => {
    const { result } = render({ sourceToken: nativeSource('BTC', cChain) });

    expect(result.current).toBeUndefined();
    expect(mockUseTokensLookup).toHaveBeenLastCalledWith([], {
      enabled: false,
    });
  });

  it.each([
    ['there is no source token', { sourceToken: undefined }],
    ['a target id is set', { toId: 'some-id' }],
    ['the list is not loading', { isTargetTokenListLoading: false }],
    [
      'the committed chain differs from the source chain',
      { committedTargetChainId: ethereum.chainId },
    ],
    ['the committed chain is unresolved', { committedTargetChainId: null }],
    [
      'the avalanche chip is committed but the source is not on Avalanche',
      { sourceToken: nativeSource('ETH', ethereum) },
    ],
    [
      'the source chain is not reachable',
      { targetChainOptions: [{ chainId: 1 }] as ChainOption[] },
    ],
  ])('returns nothing and does not look up when %s', (_, overrides) => {
    const { result } = render(overrides);

    expect(result.current).toBeUndefined();
    expect(mockUseTokensLookup).toHaveBeenLastCalledWith([], {
      enabled: false,
    });
  });

  it('returns nothing on testnets', () => {
    const { result } = render({
      sourceToken: nativeSource('AVAX', fuji),
      committedTargetChainId: fuji.chainId,
    });

    expect(result.current).toBeUndefined();
    expect(mockUseTokensLookup).toHaveBeenLastCalledWith([], {
      enabled: false,
    });
  });

  it('returns nothing while the token is not resolved yet', () => {
    mockResolveToken.mockReturnValue(undefined);

    const { result } = render();

    expect(result.current).toBeUndefined();
  });

  describe('explicit target id', () => {
    const usdcId = getUniqueTokenId(usdc);

    it('resolves the held ERC20 for the target id while loading', () => {
      const { result } = render({ toId: usdcId });

      expect(result.current).toBe(usdc);
      expect(mockResolveToken).toHaveBeenCalledWith(
        cChain.caipId,
        USDC_ADDRESS_C_CHAIN.toLowerCase(),
      );
      expect(mockUseTokensLookup).toHaveBeenLastCalledWith(
        [
          {
            network: cChain,
            addresses: [USDC_ADDRESS_C_CHAIN.toLowerCase()],
          },
        ],
        { enabled: true },
      );
    });

    it('resolves a native target id with the zero address', () => {
      const native = nativeSource('ETH', cChain);
      mockResolveToken.mockReturnValue(native);

      const { result } = render({ toId: getUniqueTokenId(native) });

      expect(mockResolveToken).toHaveBeenCalledWith(
        cChain.caipId,
        ERC_ZERO_ADDRESS,
      );
      expect(result.current).toBe(native);
    });

    it('resolves a target id on the committed numeric chain, even on testnet', () => {
      const fujiUsdc = {
        ...usdc,
        coreChainId: fuji.chainId,
        chainCaipId: fuji.caipId,
      } as FungibleTokenBalance;
      mockResolveToken.mockReturnValue(fujiUsdc);

      const { result } = render({
        sourceToken: nativeSource('AVAX', fuji),
        toId: getUniqueTokenId(fujiUsdc),
        committedTargetChainId: fuji.chainId,
      });

      expect(result.current).toBe(fujiUsdc);
    });

    it.each([
      ['the list is not loading', { isTargetTokenListLoading: false }],
      [
        'the target chain is not the committed chain',
        { committedTargetChainId: ethereum.chainId },
      ],
      ['the committed chain is unresolved', { committedTargetChainId: null }],
      [
        'the target chain is not reachable',
        { targetChainOptions: [{ chainId: 1 }] as ChainOption[] },
      ],
      [
        'the target id equals the source token',
        { toId: getUniqueTokenId(nativeAvax) },
      ],
      ['the target id is malformed', { toId: 'garbage' }],
      [
        'the target is a hypercore spot token',
        { toId: 'HYPERCORE_SPOT:spot:150:43114' },
      ],
    ])('returns nothing and does not look up when %s', (_, overrides) => {
      const { result } = render({ toId: usdcId, ...overrides });

      expect(result.current).toBeUndefined();
      expect(mockUseTokensLookup).toHaveBeenLastCalledWith([], {
        enabled: false,
      });
    });

    it('returns nothing when the resolved token does not match the target id', () => {
      mockResolveToken.mockReturnValue(erc20Source('OTHER'));

      const { result } = render({ toId: usdcId });

      expect(result.current).toBeUndefined();
    });
  });
});
