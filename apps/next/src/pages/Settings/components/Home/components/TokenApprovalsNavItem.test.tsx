import { ThemeProvider } from '@avalabs/k2-alpine';
import { openNewTab } from '@core/common';
import { useAccountsContext, useAnalyticsContext } from '@core/ui';
import { fireEvent, render, screen } from '@shared/tests/test-utils';
import { createInstance } from 'i18next';
import { I18nextProvider, initReactI18next } from 'react-i18next';

import translationEn from '@/localization/locales/en/translation.json';
import { TokenApprovalsNavItem } from './TokenApprovalsNavItem';

jest.mock('@core/common', () => ({
  openNewTab: jest.fn(),
}));

jest.mock('@core/ui', () => ({
  useAccountsContext: jest.fn(),
  useAnalyticsContext: jest.fn(),
}));

const mockAccounts = (active?: { addressC?: string }) =>
  jest.mocked(useAccountsContext).mockReturnValue({
    accounts: { active },
  } as unknown as ReturnType<typeof useAccountsContext>);

describe('TokenApprovalsNavItem', () => {
  let i18n: ReturnType<typeof createInstance>;
  const capture = jest.fn();

  beforeAll(async () => {
    i18n = createInstance();
    await i18n.use(initReactI18next).init({
      lng: 'en',
      interpolation: { escapeValue: false },
      resources: { en: { translation: translationEn } },
    });
  });

  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(useAnalyticsContext).mockReturnValue({
      capture,
    } as unknown as ReturnType<typeof useAnalyticsContext>);
  });

  const renderItem = () =>
    render(
      <ThemeProvider theme="light" toastVariant="extension">
        <I18nextProvider i18n={i18n}>
          <TokenApprovalsNavItem />
        </I18nextProvider>
      </ThemeProvider>,
    );

  it('renders the item with a third-party tool description', () => {
    mockAccounts({ addressC: '0x1111111111111111111111111111111111111111' });

    renderItem();

    expect(screen.getByText('Token approvals')).toBeTruthy();
    expect(
      screen.getByText(
        'Review and revoke token approvals for this account using revoke.cash, a third-party tool.',
      ),
    ).toBeTruthy();
  });

  it('opens revoke.cash for the active account C-chain address in a new tab', () => {
    const addressC = '0xAbCdEf0000000000000000000000000000000123';
    mockAccounts({ addressC });

    renderItem();
    fireEvent.click(screen.getByText('Token approvals'));

    expect(openNewTab).toHaveBeenCalledTimes(1);
    expect(openNewTab).toHaveBeenCalledWith({
      url: `https://revoke.cash/address/${addressC}`,
    });
    expect(capture).toHaveBeenCalledWith('TokenApprovalsClicked');
  });

  it('uses the newly active account after switching accounts', () => {
    mockAccounts({ addressC: '0x1111111111111111111111111111111111111111' });
    const { rerender } = renderItem();

    mockAccounts({ addressC: '0x2222222222222222222222222222222222222222' });
    rerender(
      <ThemeProvider theme="light" toastVariant="extension">
        <I18nextProvider i18n={i18n}>
          <TokenApprovalsNavItem />
        </I18nextProvider>
      </ThemeProvider>,
    );
    fireEvent.click(screen.getByText('Token approvals'));

    expect(openNewTab).toHaveBeenCalledWith({
      url: 'https://revoke.cash/address/0x2222222222222222222222222222222222222222',
    });
  });

  it('renders nothing when there is no active EVM address', () => {
    mockAccounts(undefined);

    renderItem();

    expect(screen.queryByText('Token approvals')).toBeNull();
  });
});
