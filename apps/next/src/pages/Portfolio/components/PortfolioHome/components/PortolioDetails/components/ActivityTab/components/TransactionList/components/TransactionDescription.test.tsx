import { ThemeProvider } from '@avalabs/k2-alpine';
import type { Network, TxHistoryItem } from '@core/types';
import {
  NetworkVMType,
  TokenType,
  TransactionType,
} from '@avalabs/vm-module-types';
import { render } from '@shared/tests/test-utils';
import { createInstance } from 'i18next';
import { I18nextProvider, initReactI18next } from 'react-i18next';

import translationEn from '@/localization/locales/en/translation.json';
import { ActivityFilterNetworkProvider } from '../../../ActivityFilterNetworkContext';
import { TransactionDescription } from './TransactionDescription';

const SWAP_I18N_KEY =
  '<sourceAmount /> {{sourceSymbol}} swapped for {{targetSymbol}}';
const RECEIVE_I18N_KEY = '<amount /> {{symbol}} received';
const CONTRACT_CALL_I18N_KEY = `<amount /> {{symbol}} Contract\u00A0Call`;

const CHECKSUM_USER = '0xAbCdAbCdAbCdAbCdAbCdAbCdAbCdAbCdAbCdAbCd';
const LOWER_USER = CHECKSUM_USER.toLowerCase();

/** Base (and hex 0x2105) activity filter — native symbol fallback for tests. */
const TEST_BASE_ACTIVITY_FILTER_NETWORK = {
  chainId: 8453,
  chainName: 'Base',
  vmName: NetworkVMType.EVM,
  rpcUrl: 'https://mainnet.base.org',
  logoUri: '',
  networkToken: {
    symbol: 'ETH',
    name: 'Ether',
    decimals: 18,
    logoUri: '',
    description: '',
  },
} as Network;

jest.mock('@core/common', () => ({
  ...jest.requireActual<typeof import('@core/common')>('@core/common'),
  getAllAddressesForAccount: jest.fn(() => [CHECKSUM_USER]),
  getEthNativeSymbolForKnownChainId: (chainId: number) =>
    new Set([1, 11155111, 8453, 42161, 10]).has(chainId) ? 'ETH' : undefined,
}));

jest.mock('@core/ui/src/contexts/AccountsProvider', () => ({
  useAccountsContext: () => ({
    accounts: { active: { id: '1', name: 'Test', addressC: CHECKSUM_USER } },
  }),
}));

function buildNativeReceiveMissingLegAddressesTx(): TxHistoryItem {
  return {
    bridgeAnalysis: { isBridgeTx: false },
    isContractCall: false,
    isIncoming: true,
    isOutgoing: false,
    isSender: false,
    timestamp: 1_700_000_000_000,
    hash: '0xhash',
    from: '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    to: LOWER_USER,
    tokens: [
      {
        name: '',
        symbol: '',
        amount: '1',
        type: TokenType.NATIVE,
        decimal: '18',
      },
    ],
    gasUsed: '21000',
    explorerLink: 'https://explorer.example/tx',
    chainId: '8453',
    txType: TransactionType.RECEIVE,
    vmType: NetworkVMType.EVM,
  };
}

function buildReceiveWithExtraLegFirstTx(): TxHistoryItem {
  return {
    bridgeAnalysis: { isBridgeTx: false },
    isContractCall: false,
    isIncoming: true,
    isOutgoing: false,
    isSender: false,
    timestamp: 1_700_000_000_000,
    hash: '0xhash',
    from: '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    to: LOWER_USER,
    tokens: [
      {
        name: '',
        symbol: '',
        amount: '0.0000001',
        type: TokenType.ERC20,
        address: '0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
        decimal: '18',
        from: { address: '0xcccccccccccccccccccccccccccccccccccccccc' },
        to: { address: '0xdddddddddddddddddddddddddddddddddddddddd' },
      },
      {
        name: 'Ether',
        symbol: 'ETH',
        amount: '1',
        type: TokenType.NATIVE,
        decimal: '18',
        from: { address: '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' },
        to: { address: LOWER_USER },
      },
    ],
    gasUsed: '21000',
    explorerLink: 'https://explorer.example/tx',
    chainId: '8453',
    txType: TransactionType.RECEIVE,
    vmType: NetworkVMType.EVM,
  };
}

function buildSwapTx(): TxHistoryItem {
  return {
    bridgeAnalysis: { isBridgeTx: false },
    isContractCall: true,
    isIncoming: false,
    isOutgoing: true,
    isSender: true,
    timestamp: 1_700_000_000_000,
    hash: '0xhash',
    from: LOWER_USER,
    to: '0x2222222222222222222222222222222222222222',
    tokens: [
      {
        name: 'USD Coin',
        symbol: 'USDC',
        amount: '10',
        type: TokenType.ERC20,
        address: '0x1111111111111111111111111111111111111111',
        decimal: '6',
        from: { address: LOWER_USER },
        to: { address: '0x2222222222222222222222222222222222222222' },
      },
      {
        name: 'Wrapped Ether',
        symbol: 'WETH',
        amount: '0.01',
        type: TokenType.ERC20,
        address: '0x3333333333333333333333333333333333333333',
        decimal: '18',
        from: { address: '0x2222222222222222222222222222222222222222' },
        to: { address: LOWER_USER },
      },
    ],
    gasUsed: '21000',
    explorerLink: 'https://explorer.example/tx',
    chainId: '1',
    txType: TransactionType.SWAP,
    vmType: NetworkVMType.EVM,
  };
}

function buildTx(overrides: Partial<TxHistoryItem>): TxHistoryItem {
  return {
    bridgeAnalysis: { isBridgeTx: false },
    isContractCall: false,
    isIncoming: true,
    isOutgoing: false,
    isSender: false,
    timestamp: 1_700_000_000_000,
    hash: '0xhash',
    from: '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    to: LOWER_USER,
    tokens: [],
    gasUsed: '210000',
    explorerLink: 'https://explorer.example/tx',
    chainId: '8453',
    txType: TransactionType.RECEIVE,
    vmType: NetworkVMType.EVM,
    ...overrides,
  } as TxHistoryItem;
}

function buildContractCallTransaction(amount: string): TxHistoryItem {
  return {
    bridgeAnalysis: { isBridgeTx: false },
    isContractCall: true,
    isIncoming: false,
    isOutgoing: true,
    isSender: true,
    timestamp: 1_700_000_000_000,
    hash: '0xhash',
    from: '0xfrom',
    to: '0xto',
    tokens: [
      {
        name: 'BEAM',
        symbol: 'BEAM',
        amount,
        type: TokenType.ERC20,
        address: '0xbeam',
      },
    ],
    gasUsed: '21000',
    explorerLink: 'https://explorer.example/tx',
    chainId: 'eip155:1',
    txType: TransactionType.UNKNOWN,
    vmType: NetworkVMType.EVM,
  };
}

describe('TransactionDescription', () => {
  let i18n: ReturnType<typeof createInstance>;

  beforeAll(async () => {
    i18n = createInstance();
    await i18n.use(initReactI18next).init({
      lng: 'en',
      fallbackLng: 'en',
      interpolation: { escapeValue: false },
      resources: {
        en: {
          translation: {
            ...translationEn,
            [SWAP_I18N_KEY]: SWAP_I18N_KEY,
            [RECEIVE_I18N_KEY]: RECEIVE_I18N_KEY,
            [CONTRACT_CALL_I18N_KEY]: '<amount /> {{symbol}} Contract Call',
          },
        },
      },
    });
  });

  function renderDescription(
    transaction: TxHistoryItem,
    filterNetwork: Network = TEST_BASE_ACTIVITY_FILTER_NETWORK,
  ) {
    return render(
      <ThemeProvider theme="light" toastVariant="extension">
        <I18nextProvider i18n={i18n}>
          <ActivityFilterNetworkProvider network={filterNetwork}>
            <TransactionDescription transaction={transaction} />
          </ActivityFilterNetworkProvider>
        </I18nextProvider>
      </ThemeProvider>,
    );
  }

  it('matches swap legs when Moralis uses lowercase addresses and the account is checksummed', () => {
    const { container } = renderDescription(buildSwapTx());
    const text = container.textContent ?? '';

    expect(text).toMatch(/10/);
    expect(text).toMatch(/USDC/);
    expect(text).toMatch(/WETH/);
    expect(text).toMatch(/swapped for/i);
  });

  it('uses the user incoming token for RECEIVE when another transfer is listed first', () => {
    const { container } = renderDescription(buildReceiveWithExtraLegFirstTx());
    const text = container.textContent ?? '';

    expect(text).toMatch(/1/);
    expect(text).toMatch(/ETH/);
    expect(text).toMatch(/received/i);
  });

  it('shows native chain symbol for Base RECEIVE when Moralis omits token.to and symbol', () => {
    const { container } = renderDescription(
      buildNativeReceiveMissingLegAddressesTx(),
    );
    const text = container.textContent ?? '';

    expect(text).toMatch(/1/);
    expect(text).toMatch(/ETH/);
    expect(text).toMatch(/received/i);
  });

  it('resolves native symbol when history chainId is hex (Base 0x2105)', () => {
    const tx = buildNativeReceiveMissingLegAddressesTx();
    tx.chainId = '0x2105';
    const { container } = renderDescription(tx);
    const text = container.textContent ?? '';

    expect(text).toMatch(/ETH/);
    expect(text).toMatch(/received/i);
  });

  it('shows chain native symbol when history omits symbol and mis-tags native as ERC20 without address', () => {
    const tx = buildNativeReceiveMissingLegAddressesTx();
    tx.tokens = [
      {
        name: '',
        symbol: '',
        amount: '1',
        type: TokenType.ERC20,
        decimal: '18',
      } as TxHistoryItem['tokens'][number],
    ];
    const { container } = renderDescription(tx);
    const text = container.textContent ?? '';

    expect(text).toMatch(/ETH/);
    expect(text).toMatch(/received/i);
  });

  it('shows NFT received for Base RECEIVE when main token is ERC721 (any symbol)', () => {
    const tx = buildTx({
      isContractCall: true,
      hash: '0x97a0127e26cd73540fa1b13ee16f87e77c3a6696f7c425556d8c1bbb737bcdee',
      explorerLink: 'https://basescan.org/tx/0x97a0',
      tokens: [
        {
          name: '',
          symbol: '',
          amount: '1',
          type: TokenType.ERC721,
          address: '0x46dbfaff2172d23539122feea0a16e83629102c6',
          decimal: '0',
          from: { address: '0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb' },
          to: { address: LOWER_USER },
        },
      ],
    });
    const { container } = renderDescription(tx);
    const text = container.textContent ?? '';

    expect(text).toMatch(/NFT received/i);
    expect(text).not.toMatch(/0x46db/);
  });

  it('shows NFT received for ERC721 RECEIVE even when token has a symbol', () => {
    const tx = buildTx({
      tokens: [
        {
          name: 'Cool Cats',
          symbol: 'COOL',
          amount: '1',
          type: TokenType.ERC721,
          address: '0x46dbfaff2172d23539122feea0a16e83629102c6',
          decimal: '0',
          from: { address: '0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb' },
          to: { address: LOWER_USER },
        },
      ],
    });
    const { container } = renderDescription(tx);
    const text = container.textContent ?? '';

    expect(text).toMatch(/NFT received/i);
    expect(text).not.toMatch(/COOL/);
  });

  it('shows NFT sent when main token is ERC721 on SEND', () => {
    const tx = buildTx({
      isContractCall: true,
      isIncoming: false,
      isOutgoing: true,
      isSender: true,
      from: LOWER_USER,
      to: '0x2222222222222222222222222222222222222222',
      tokens: [
        {
          name: '',
          symbol: '',
          amount: '1',
          type: TokenType.ERC721,
          address: '0x46dbfaff2172d23539122feea0a16e83629102c6',
          decimal: '0',
          from: { address: LOWER_USER },
          to: { address: '0x2222222222222222222222222222222222222222' },
        },
      ],
      txType: TransactionType.SEND,
    });
    const { container } = renderDescription(tx);
    expect(container.textContent ?? '').toMatch(/NFT sent/i);
  });

  it('renders contract call copy with long decimal amount and BEAM symbol', () => {
    const ethereumFilter: Network = {
      chainId: 1,
      chainName: 'Ethereum',
      vmName: NetworkVMType.EVM,
      rpcUrl: 'https://eth.llamarpc.com',
      logoUri: '',
      networkToken: {
        symbol: 'ETH',
        name: 'Ether',
        decimals: 18,
        logoUri: '',
        description: '',
      },
    } as Network;

    const { container } = renderDescription(
      buildContractCallTransaction('445.37927'),
      ethereumFilter,
    );

    const text = container.textContent ?? '';
    expect(text).toMatch(/445\.37927/);
    expect(text).toMatch(/BEAM/);
    expect(text).toMatch(/Contract Call/);
  });

  it('renders truncated approximation for very long fractional amounts', () => {
    const ethereumFilter: Network = {
      chainId: 1,
      chainName: 'Ethereum',
      vmName: NetworkVMType.EVM,
      rpcUrl: 'https://eth.llamarpc.com',
      logoUri: '',
      networkToken: {
        symbol: 'ETH',
        name: 'Ether',
        decimals: 18,
        logoUri: '',
        description: '',
      },
    } as Network;

    const { container } = renderDescription(
      buildContractCallTransaction('1.123456789'),
      ethereumFilter,
    );

    const text = container.textContent ?? '';
    expect(text).toMatch(/~1\.12345/);
    expect(text).toMatch(/BEAM/);
  });
});
