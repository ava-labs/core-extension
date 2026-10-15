import { ThemeProvider } from '@avalabs/k2-alpine';
import { useOutdatedLedgerAvalancheAppVersions } from '@core/ui';
import { render, screen } from '@shared/tests/test-utils';
import { createInstance } from 'i18next';
import { I18nextProvider, initReactI18next } from 'react-i18next';

import translationEn from '@/localization/locales/en/translation.json';
import { LedgerAppOutdatedHint } from './LedgerAppOutdatedHint';

jest.mock('@core/ui', () => ({
  useOutdatedLedgerAvalancheAppVersions: jest.fn(),
}));

describe('LedgerAppOutdatedHint', () => {
  let i18n: ReturnType<typeof createInstance>;

  beforeAll(async () => {
    i18n = createInstance();
    await i18n.use(initReactI18next).init({
      lng: 'en',
      interpolation: { escapeValue: false },
      resources: { en: { translation: translationEn } },
    });
  });

  const renderHint = (showIcon?: boolean) =>
    render(
      <ThemeProvider theme="light" toastVariant="extension">
        <I18nextProvider i18n={i18n}>
          <LedgerAppOutdatedHint showIcon={showIcon} />
        </I18nextProvider>
      </ThemeProvider>,
    );

  it('renders the hint with the current and recommended versions when the Avalanche app is outdated', () => {
    jest.mocked(useOutdatedLedgerAvalancheAppVersions).mockReturnValue({
      currentVersion: '0.8.4',
      recommendedVersion: '0.9.0',
    });

    renderHint();

    expect(screen.getByTestId('ledger-app-outdated-hint').textContent).toBe(
      'For improved user experience, update your Avalanche app on Ledger (0.8.4 → 0.9.0).',
    );
    expect(screen.getByText('0.8.4').tagName).toBe('SPAN');
    expect(screen.getByText('0.9.0').tagName).toBe('SPAN');
    expect(
      screen.getByTestId('ledger-app-outdated-hint').querySelector('svg'),
    ).not.toBeNull();
  });

  it('omits the icon when showIcon is false', () => {
    jest.mocked(useOutdatedLedgerAvalancheAppVersions).mockReturnValue({
      currentVersion: '0.8.4',
      recommendedVersion: '0.9.0',
    });

    renderHint(false);

    expect(
      screen.getByTestId('ledger-app-outdated-hint').querySelector('svg'),
    ).toBeNull();
  });

  it('renders nothing when the Avalanche app is not outdated', () => {
    jest
      .mocked(useOutdatedLedgerAvalancheAppVersions)
      .mockReturnValue(undefined);

    renderHint();

    expect(screen.queryByTestId('ledger-app-outdated-hint')).toBeNull();
  });
});
