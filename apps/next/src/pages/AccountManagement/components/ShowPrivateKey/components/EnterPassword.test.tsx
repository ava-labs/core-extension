import { ThemeProvider } from '@avalabs/k2-alpine';
import { Account, AccountType } from '@core/types';
import { render, screen } from '@shared/tests/test-utils';
import { createInstance } from 'i18next';
import { I18nextProvider, initReactI18next } from 'react-i18next';

import translationEn from '@/localization/locales/en/translation.json';

import { EnterPassword } from './EnterPassword';

jest.mock('@core/ui', () => ({
  isSpecificContextContainer: () => false,
  useKeyboardShortcuts: () => ({}),
  useAnalyticsContext: () => ({ capture: jest.fn() }),
}));

jest.mock('../hooks/useRevealKey', () => ({
  useRevealKey: () => ({
    revealKey: jest.fn(),
    error: '',
    errorType: null,
    isLoading: false,
  }),
}));

const SHARE_WARNING =
  'Do not share this private key with anyone! It can be used to steal all funds in the account(s) associated with it.';

describe('EnterPassword (private key reveal)', () => {
  let i18n: ReturnType<typeof createInstance>;

  beforeAll(async () => {
    i18n = createInstance();
    await i18n.use(initReactI18next).init({
      lng: 'en',
      interpolation: { escapeValue: false },
      resources: { en: { translation: translationEn } },
    });
  });

  const renderStep = (type: AccountType.PRIMARY | AccountType.IMPORTED) =>
    render(
      <ThemeProvider theme="light" toastVariant="extension">
        <I18nextProvider i18n={i18n}>
          <EnterPassword
            account={
              {
                id: 'account-id',
                type,
                index: 0,
              } as Extract<
                Account,
                { type: AccountType.IMPORTED | AccountType.PRIMARY }
              >
            }
            onAuthenticated={jest.fn()}
          />
        </I18nextProvider>
      </ThemeProvider>,
    );

  it.each([AccountType.PRIMARY, AccountType.IMPORTED] as const)(
    'warns about sharing the private key above the password field (%s account)',
    (type) => {
      renderStep(type);

      const warning = screen.getByTestId('private-key-share-warning');
      const passwordInput = screen.getByTestId('private-key-password-input');

      expect(warning.textContent).toBe(SHARE_WARNING);
      expect(
        warning.compareDocumentPosition(passwordInput) &
          Node.DOCUMENT_POSITION_FOLLOWING,
      ).toBeTruthy();
      expect(screen.queryByTestId('revealed-private-key')).toBeNull();
    },
  );
});
