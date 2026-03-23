import { ThemeProvider } from '@avalabs/k2-alpine';
import { TxHistoryItem } from '@core/types';
import {
  NetworkVMType,
  TokenType,
  TransactionType,
} from '@avalabs/vm-module-types';
import { render } from '@shared/tests/test-utils';
import { createInstance } from 'i18next';
import { I18nextProvider, initReactI18next } from 'react-i18next';

import translationEn from '@/localization/locales/en/translation.json';
import { TransactionDescription } from './TransactionDescription';

jest.mock('@/hooks/useNativeSymbolForTransactionChain', () => ({
  useNativeSymbolForTransactionChain: (
    chainId: string | number | undefined,
  ): string | undefined => {
    const common =
      jest.requireMock<typeof import('@core/common')>('@core/common');
    if (chainId === undefined || String(chainId).trim() === '') {
      return undefined;
    }
    const { buildNetworkLookupKeys } =
      jest.requireActual<typeof import('@core/common')>('@core/common');
    for (const key of buildNetworkLookupKeys(chainId)) {
      if (typeof key === 'number') {
        const sym = common.getEthNativeSymbolForKnownChainId(key);
        if (sym) {
          return sym;
        }
      }
    }
    return undefined;
  },
}));

const SWAP_I18N_KEY =
  '<sourceAmount /> {{sourceSymbol}} swapped for {{targetSymbol}}';
const RECEIVE_I18N_KEY = '<amount /> {{symbol}} received';

const CHECKSUM_USER = '0xAbCdAbCdAbCdAbCdAbCdAbCdAbCdAbCdAbCdAbCd';
const LOWER_USER = CHECKSUM_USER.toLowerCase();

jest.mock('@core/common', () => ({
  ...jest.requireActual<typeof import('@core/common')>('@core/common'),
  getAllAddressesForAccount: jest.fn(() => [CHECKSUM_USER]),
  // Deterministic fallback for tests; keep chain set aligned with withDefaultNativeTokenSymbol.ts
  getEthNativeSymbolForKnownChainId: (chainId: number) =>
    new Set([1, 11155111, 8453, 42161, 10]).has(chainId) ? 'ETH' : undefined,
}));

jest.mock('@core/ui/src/contexts/AccountsProvider', () => ({
  useAccountsContext: () => ({
    accounts: { active: { id: '1', name: 'Test', addressC: CHECKSUM_USER } },
  }),
}));

jest.mock('@core/ui/src/contexts/NetworkProvider', () => ({
  useNetworkContext: () => ({
    getNetwork: (key: number | string) => {
      let id: number;
      if (typeof key === 'number') {
        id = key;
      } else if (key.startsWith('eip155:')) {
        id = Number.parseInt(key.slice('eip155:'.length), 10);
      } else if (/^0x[0-9a-fA-F]+$/i.test(key)) {
        id = Number.parseInt(key, 16);
      } else {
        id = Number.parseInt(key, 10);
      }
      if (Number.isNaN(id) || (id !== 1 && id !== 8453)) {
        return undefined;
      }
      return {
        networkToken: { symbol: 'ETH' },
      };
    },
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
          },
        },
      },
    });
  });

  function renderDescription(transaction: TxHistoryItem) {
    return render(
      <ThemeProvider theme="light" toastVariant="extension">
        <I18nextProvider i18n={i18n}>
          <TransactionDescription transaction={transaction} />
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
    const tx: TxHistoryItem = {
      bridgeAnalysis: { isBridgeTx: false },
      isContractCall: true,
      isIncoming: true,
      isOutgoing: false,
      isSender: false,
      timestamp: 1_700_000_000_000,
      hash: '0x97a0127e26cd73540fa1b13ee16f87e77c3a6696f7c425556d8c1bbb737bcdee',
      from: '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      to: LOWER_USER,
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
      gasUsed: '210000',
      explorerLink: 'https://basescan.org/tx/0x97a0',
      chainId: '8453',
      txType: TransactionType.RECEIVE,
      vmType: NetworkVMType.EVM,
    };
    const { container } = renderDescription(tx);
    const text = container.textContent ?? '';

    expect(text).toMatch(/NFT received/i);
    expect(text).not.toMatch(/0x46db/);
  });

  it('shows NFT received for ERC721 RECEIVE even when token has a symbol', () => {
    const tx: TxHistoryItem = {
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
      gasUsed: '210000',
      explorerLink: 'https://explorer.example/tx',
      chainId: '8453',
      txType: TransactionType.RECEIVE,
      vmType: NetworkVMType.EVM,
    };
    const { container } = renderDescription(tx);
    const text = container.textContent ?? '';

    expect(text).toMatch(/NFT received/i);
    expect(text).not.toMatch(/COOL/);
  });

  it('shows NFT sent when main token is ERC721 on SEND', () => {
    const tx: TxHistoryItem = {
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
      gasUsed: '210000',
      explorerLink: 'https://explorer.example/tx',
      chainId: '8453',
      txType: TransactionType.SEND,
      vmType: NetworkVMType.EVM,
    };
    const { container } = renderDescription(tx);
    expect(container.textContent ?? '').toMatch(/NFT sent/i);
  });
});
