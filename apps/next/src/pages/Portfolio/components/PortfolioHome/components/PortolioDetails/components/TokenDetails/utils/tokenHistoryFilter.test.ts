import { FungibleTokenBalance, TxHistoryItem } from '@core/types';
import {
  NetworkVMType,
  TokenType,
  TransactionType,
} from '@avalabs/vm-module-types';
import { transactionMatchesTokenFilter } from './tokenHistoryFilter';

const WALLET = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0';
const OTHER = '0x1111111111111111111111111111111111111111';
const ROUTER_A = '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
const ROUTER_B = '0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb';

describe('transactionMatchesTokenFilter', () => {
  const ethToken = {
    type: TokenType.NATIVE,
    symbol: 'ETH',
    name: 'Ether',
    decimals: 18,
    coreChainId: 1,
    assetType: 'evm_native' as const,
    chainCaipId: 'eip155:1',
    balanceDisplayValue: '1',
    balance: 1n,
  } as FungibleTokenBalance;

  const usdcAddress = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48';
  const usdcToken = {
    type: TokenType.ERC20,
    symbol: 'USDC',
    name: 'USD Coin',
    address: usdcAddress,
    decimals: 6,
    coreChainId: 1,
    assetType: 'evm_erc20' as const,
    chainCaipId: 'eip155:1',
    balanceDisplayValue: '1',
    balance: 1n,
  } as FungibleTokenBalance;

  it('matches native leg on same chain even when symbol strings differ (ETH vs Ether)', () => {
    const tx = {
      chainId: '1',
      tokens: [
        {
          type: TokenType.NATIVE,
          symbol: 'ETH',
          name: 'Ether',
          amount: '0.1',
          decimal: '18',
        },
      ],
      vmType: NetworkVMType.EVM,
      isSender: false,
    } as TxHistoryItem;

    expect(
      transactionMatchesTokenFilter(
        tx,
        {
          ...ethToken,
          symbol: 'Ether',
        } as FungibleTokenBalance,
        WALLET,
      ),
    ).toBe(true);
  });

  it('does not match native leg when chainId does not match token coreChainId', () => {
    const tx = {
      chainId: '137',
      tokens: [
        {
          type: TokenType.NATIVE,
          symbol: 'ETH',
          name: 'Ether',
          amount: '0.1',
          decimal: '18',
        },
      ],
      vmType: NetworkVMType.EVM,
      isSender: false,
    } as TxHistoryItem;

    expect(transactionMatchesTokenFilter(tx, ethToken, WALLET)).toBe(false);
  });

  it('does not list ERC-20-only outgoing txs under native when gas leg is omitted (CP-13841)', () => {
    const tx = {
      chainId: '1',
      tokens: [
        {
          type: TokenType.ERC20,
          symbol: 'USDC',
          name: 'USDC',
          amount: '10',
          decimal: '6',
          address: usdcAddress,
          from: { address: WALLET },
          to: { address: OTHER },
        },
      ],
      vmType: NetworkVMType.EVM,
      isSender: true,
    } as TxHistoryItem;

    expect(transactionMatchesTokenFilter(tx, ethToken, WALLET)).toBe(false);
  });

  it('does not list NFT-only outgoing under native when no native transfer leg is indexed', () => {
    const tx = {
      chainId: '1',
      tokens: [
        {
          type: TokenType.ERC721,
          symbol: 'NFT',
          name: 'NFT',
          amount: '1',
          address: '0xnft',
          collectableTokenId: '1',
        },
      ],
      vmType: NetworkVMType.EVM,
      isSender: true,
    } as TxHistoryItem;

    expect(transactionMatchesTokenFilter(tx, ethToken, WALLET)).toBe(false);
  });

  it('does not attribute incoming ERC-20-only txs to native gas', () => {
    const tx = {
      chainId: '1',
      tokens: [
        {
          type: TokenType.ERC20,
          symbol: 'USDC',
          name: 'USDC',
          amount: '10',
          decimal: '6',
          address: usdcAddress,
          from: { address: OTHER },
          to: { address: WALLET },
        },
      ],
      vmType: NetworkVMType.EVM,
      isSender: false,
    } as TxHistoryItem;

    expect(transactionMatchesTokenFilter(tx, ethToken, WALLET)).toBe(false);
  });

  it('matches ERC-20 when contract address matches and the wallet is on the leg', () => {
    const tx = {
      chainId: '1',
      tokens: [
        {
          type: TokenType.ERC20,
          symbol: 'USDC',
          name: 'USDC',
          amount: '10',
          decimal: '6',
          address: usdcAddress,
          from: { address: WALLET },
          to: { address: OTHER },
        },
      ],
      vmType: NetworkVMType.EVM,
      isSender: true,
    } as TxHistoryItem;

    expect(transactionMatchesTokenFilter(tx, usdcToken, WALLET)).toBe(true);
    expect(
      transactionMatchesTokenFilter(
        tx,
        {
          ...usdcToken,
          address: '0xdead',
        } as FungibleTokenBalance,
        WALLET,
      ),
    ).toBe(false);
  });

  it('does not match ERC-20 when the wallet is not on the matching leg (e.g. AVAX contract call with router-only USDC leg)', () => {
    const tx = {
      chainId: '1',
      tokens: [
        {
          type: TokenType.NATIVE,
          symbol: 'AVAX',
          name: 'Avalanche',
          amount: '0.01',
          decimal: '18',
        },
        {
          type: TokenType.ERC20,
          symbol: 'USDC',
          name: 'USDC',
          amount: '1',
          decimal: '6',
          address: usdcAddress,
          from: { address: ROUTER_A },
          to: { address: ROUTER_B },
        },
      ],
      vmType: NetworkVMType.EVM,
      isSender: true,
      isContractCall: true,
    } as TxHistoryItem;

    expect(transactionMatchesTokenFilter(tx, usdcToken, WALLET)).toBe(false);
  });

  it('does not match USDC on contract call when an earlier native AVAX leg dominates (wallet still on USDC leg)', () => {
    const tx = {
      chainId: '1',
      txType: TransactionType.UNKNOWN,
      tokens: [
        {
          type: TokenType.NATIVE,
          symbol: 'AVAX',
          name: 'Avalanche',
          amount: '0.01',
          decimal: '18',
        },
        {
          type: TokenType.ERC20,
          symbol: 'USDC',
          name: 'USDC',
          amount: '0',
          decimal: '6',
          address: usdcAddress,
          from: { address: WALLET },
          to: { address: ROUTER_A },
        },
      ],
      vmType: NetworkVMType.EVM,
      isSender: true,
      isContractCall: true,
    } as TxHistoryItem;

    expect(transactionMatchesTokenFilter(tx, usdcToken, WALLET)).toBe(false);
  });

  it('does not match USDC on contract call when an earlier WETH.e leg dominates', () => {
    const wethE = '0x49d5c2bdffac6ce2bfdb6640f4f80f226bc10bab';
    const tx = {
      chainId: '1',
      txType: TransactionType.UNKNOWN,
      tokens: [
        {
          type: TokenType.ERC20,
          symbol: 'WETH.e',
          name: 'Wrapped ETH',
          amount: '0.1',
          decimal: '18',
          address: wethE,
          from: { address: WALLET },
          to: { address: ROUTER_A },
        },
        {
          type: TokenType.ERC20,
          symbol: 'USDC',
          name: 'USDC',
          amount: '5',
          decimal: '6',
          address: usdcAddress,
          from: { address: ROUTER_A },
          to: { address: WALLET },
        },
      ],
      vmType: NetworkVMType.EVM,
      isSender: true,
      isContractCall: true,
    } as TxHistoryItem;

    expect(transactionMatchesTokenFilter(tx, usdcToken, WALLET)).toBe(false);
  });

  it('still matches USDC on SWAP when another ERC-20 leg appears first (swap leg order)', () => {
    const wethE = '0x49d5c2bdffac6ce2bfdb6640f4f80f226bc10bab';
    const tx = {
      chainId: '1',
      txType: TransactionType.SWAP,
      tokens: [
        {
          type: TokenType.ERC20,
          symbol: 'WETH.e',
          name: 'Wrapped ETH',
          amount: '0.1',
          decimal: '18',
          address: wethE,
          from: { address: WALLET },
          to: { address: ROUTER_A },
        },
        {
          type: TokenType.ERC20,
          symbol: 'USDC',
          name: 'USDC',
          amount: '300',
          decimal: '6',
          address: usdcAddress,
          from: { address: ROUTER_A },
          to: { address: WALLET },
        },
      ],
      vmType: NetworkVMType.EVM,
      isSender: true,
      isContractCall: true,
    } as TxHistoryItem;

    expect(transactionMatchesTokenFilter(tx, usdcToken, WALLET)).toBe(true);
  });

  it('matches USDC on contract call when it is the first fungible leg (no prior native/other ERC-20)', () => {
    const tx = {
      chainId: '1',
      txType: TransactionType.UNKNOWN,
      tokens: [
        {
          type: TokenType.ERC20,
          symbol: 'USDC',
          name: 'USDC',
          amount: '10',
          decimal: '6',
          address: usdcAddress,
          from: { address: WALLET },
          to: { address: OTHER },
        },
      ],
      vmType: NetworkVMType.EVM,
      isSender: true,
      isContractCall: true,
    } as TxHistoryItem;

    expect(transactionMatchesTokenFilter(tx, usdcToken, WALLET)).toBe(true);
  });

  it('matches USDC when not a contract call even if native leg is listed first', () => {
    const tx = {
      chainId: '1',
      txType: TransactionType.SEND,
      tokens: [
        {
          type: TokenType.NATIVE,
          symbol: 'AVAX',
          name: 'Avalanche',
          amount: '0.02',
          decimal: '18',
        },
        {
          type: TokenType.ERC20,
          symbol: 'USDC',
          name: 'USDC',
          amount: '50',
          decimal: '6',
          address: usdcAddress,
          from: { address: WALLET },
          to: { address: OTHER },
        },
      ],
      vmType: NetworkVMType.EVM,
      isSender: true,
      isContractCall: false,
    } as TxHistoryItem;

    expect(transactionMatchesTokenFilter(tx, usdcToken, WALLET)).toBe(true);
  });

  it('does not match ERC-20 when walletAddress is empty', () => {
    const tx = {
      chainId: '1',
      tokens: [
        {
          type: TokenType.ERC20,
          symbol: 'USDC',
          name: 'USDC',
          amount: '10',
          decimal: '6',
          address: usdcAddress,
          from: { address: WALLET },
          to: { address: OTHER },
        },
      ],
      vmType: NetworkVMType.EVM,
      isSender: true,
    } as TxHistoryItem;

    expect(transactionMatchesTokenFilter(tx, usdcToken, '')).toBe(false);
  });
});
