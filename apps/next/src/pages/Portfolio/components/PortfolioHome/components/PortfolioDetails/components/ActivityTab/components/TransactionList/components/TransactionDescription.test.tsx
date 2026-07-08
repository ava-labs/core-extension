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

const CONTRACT_CALL_I18N_KEY = `<amount /> {{symbol}} Contract\u00A0Call`;

jest.mock('@core/common', () => ({
  getAllAddressesForAccount: jest.fn(() => []),
  isNftTokenType: jest.fn(() => false),
}));

jest.mock('@core/ui/src/contexts/AccountsProvider', () => ({
  useAccountsContext: () => ({
    accounts: { active: undefined },
  }),
}));

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
            [CONTRACT_CALL_I18N_KEY]: '<amount /> {{symbol}} Contract Call',
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

  it('renders contract call copy with long decimal amount and BEAM symbol', () => {
    const { container } = renderDescription(
      buildContractCallTransaction('445.37927'),
    );

    const text = container.textContent ?? '';
    expect(text).toMatch(/445\.37927/);
    expect(text).toMatch(/BEAM/);
    expect(text).toMatch(/Contract Call/);
  });

  it('renders truncated approximation for very long fractional amounts', () => {
    const { container } = renderDescription(
      buildContractCallTransaction('1.123456789'),
    );

    const text = container.textContent ?? '';
    expect(text).toMatch(/~1\.12345/);
    expect(text).toMatch(/BEAM/);
  });
});
