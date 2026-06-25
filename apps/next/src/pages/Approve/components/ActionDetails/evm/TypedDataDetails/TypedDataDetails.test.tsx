import { ThemeProvider } from '@avalabs/k2-alpine';
import { render } from '@testing-library/react';
import { createInstance } from 'i18next';
import { I18nextProvider, initReactI18next } from 'react-i18next';

import translationEn from '@/localization/locales/en/translation.json';

import { TypedDataDetails } from './TypedDataDetails';
import { parseKnownTypedData } from './lib/parseKnownTypedData';

// fireblocks-sdk (pulled in transitively via @core/types) fails to evaluate in
// the jsdom test env. We never exercise it here, so stub its named exports with
// enum-like proxies (so `SomeEnum.MEMBER` access doesn't throw).
jest.mock(
  'fireblocks-sdk',
  () =>
    new Proxy(
      {},
      { get: () => new Proxy({}, { get: (_t, key) => String(key) }) },
    ),
);

jest.mock('@core/ui', () => ({
  useAccountsContext: () => ({
    getAccount: () => undefined,
    accounts: { active: undefined },
  }),
  toast: { success: jest.fn() },
}));

jest.mock('@core/common', () => ({
  getExplorerAddressByNetwork: () => 'https://explorer.example/address/0x',
}));

const network = { caipId: 'eip155:1', chainName: 'Ethereum' } as never;

const permit = {
  types: {
    EIP712Domain: [],
    Permit: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
      { name: 'value', type: 'uint256' },
      { name: 'nonce', type: 'uint256' },
      { name: 'deadline', type: 'uint256' },
    ],
  },
  primaryType: 'Permit',
  domain: {
    name: 'USD Coin',
    chainId: 1,
    verifyingContract: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  },
  message: {
    owner: '0x1111111111111111111111111111111111111111',
    spender: '0x2222222222222222222222222222222222222222',
    value: '1000000',
    nonce: '7',
    deadline: '1700000000',
  },
};

describe('TypedDataDetails', () => {
  let i18n: ReturnType<typeof createInstance>;

  beforeAll(async () => {
    i18n = createInstance();
    await i18n.use(initReactI18next).init({
      lng: 'en',
      fallbackLng: 'en',
      interpolation: { escapeValue: false },
      resources: { en: { translation: { ...translationEn } } },
    });
  });

  const renderSection = (data: unknown) => {
    const parsed = parseKnownTypedData(data);
    if (!parsed) throw new Error('expected a known typed data section');
    return render(
      <ThemeProvider theme="light" toastVariant="extension">
        <I18nextProvider i18n={i18n}>
          <TypedDataDetails section={parsed.section} network={network} />
        </I18nextProvider>
      </ThemeProvider>,
    );
  };

  it('renders only the important, human-readable fields for a permit', () => {
    const { container } = renderSection(permit);
    const text = container.textContent ?? '';

    expect(text).toContain('Token approval (Permit)');
    expect(text).toContain('Token');
    expect(text).toContain('Spender');
    expect(text).toContain('Amount');
    expect(text).toContain('1000000');
    expect(text).toContain('Deadline');
    // Internal noise like nonce is not surfaced.
    expect(text).not.toContain('nonce');
    expect(text).not.toContain('7');
  });

  it('renders the deadline as a formatted date row', () => {
    const { container } = renderSection(permit);
    // date-fns formats 1700000000 (2023) — assert the year shows.
    expect(container.textContent ?? '').toContain('2023');
  });
});
