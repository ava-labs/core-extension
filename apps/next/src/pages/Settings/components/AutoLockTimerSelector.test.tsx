import { ThemeProvider } from '@avalabs/k2-alpine';
import { useAnalyticsContext, useSettingsContext } from '@core/ui';
import { fireEvent, render, screen, waitFor } from '@shared/tests/test-utils';
import { createInstance } from 'i18next';
import { I18nextProvider, initReactI18next } from 'react-i18next';

import translationEn from '@/localization/locales/en/translation.json';
import { AutoLockTimerSelector } from './AutoLockTimerSelector';

jest.mock('@core/ui', () => ({
  useAnalyticsContext: jest.fn(),
  useSettingsContext: jest.fn(),
}));

describe('AutoLockTimerSelector', () => {
  let i18n: ReturnType<typeof createInstance>;
  const setAutoLockTimer = jest.fn().mockResolvedValue(true);
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
    jest.mocked(useAnalyticsContext).mockReturnValue({ capture } as any);
    jest.mocked(useSettingsContext).mockReturnValue({
      autoLockTimer: 20,
      setAutoLockTimer,
    } as any);
  });

  const renderSelector = () =>
    render(
      <ThemeProvider theme="light" toastVariant="extension">
        <I18nextProvider i18n={i18n}>
          <AutoLockTimerSelector />
        </I18nextProvider>
      </ThemeProvider>,
    );

  it('shows the currently configured timeout', () => {
    renderSelector();

    expect(screen.getByTestId('settings-auto-lock-timer').textContent).toBe(
      '20 minutes',
    );
  });

  it('only offers timeouts of 20 minutes or less', () => {
    renderSelector();
    fireEvent.click(screen.getByTestId('settings-auto-lock-timer'));

    const offered = screen
      .getAllByTestId(/^auto-lock-timer-selector-/)
      .map((el) => el.textContent);

    expect(offered).toEqual([
      '5 minutes',
      '10 minutes',
      '15 minutes',
      '20 minutes',
    ]);
    expect(screen.queryByTestId('auto-lock-timer-selector-30')).toBeNull();
  });

  it('saves the selected timeout', async () => {
    renderSelector();
    fireEvent.click(screen.getByTestId('settings-auto-lock-timer'));
    fireEvent.click(screen.getByTestId('auto-lock-timer-selector-10'));

    await waitFor(() => expect(setAutoLockTimer).toHaveBeenCalledWith(10));
    expect(capture).toHaveBeenCalledWith('AutoLockTimerChanged', {
      autoLockTimer: 10,
    });
  });
});
