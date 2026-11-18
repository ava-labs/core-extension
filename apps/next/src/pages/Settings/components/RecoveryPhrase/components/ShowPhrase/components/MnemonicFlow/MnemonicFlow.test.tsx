import { ThemeProvider } from '@avalabs/k2-alpine';
import { render, screen } from '@shared/tests/test-utils';
import { createInstance } from 'i18next';
import { ReactNode } from 'react';
import { I18nextProvider, initReactI18next } from 'react-i18next';

import translationEn from '@/localization/locales/en/translation.json';

import { useRevealPhrase } from '../../hooks/useRevealPhrase';
import { MnemonicFlow } from './MnemonicFlow';

jest.mock('@core/ui', () => ({
  isSpecificContextContainer: () => false,
  useKeyboardShortcuts: () => ({}),
}));

jest.mock('@/components/Page', () => ({
  Page: ({ title, children }: { title: ReactNode; children: ReactNode }) => (
    <div>
      <h1>{title}</h1>
      {children}
    </div>
  ),
}));

jest.mock('../../hooks/useRevealPhrase', () => ({
  useRevealPhrase: jest.fn(),
}));

jest.mock('../PhraseCard', () => ({
  PhraseCard: ({ phrase }: { phrase: string }) => (
    <div data-testid="phrase-card">{phrase}</div>
  ),
}));

const SHARE_WARNING =
  'Do not share this phrase with anyone! These words can be used to steal all your accounts.';

describe('MnemonicFlow', () => {
  let i18n: ReturnType<typeof createInstance>;

  beforeAll(async () => {
    i18n = createInstance();
    await i18n.use(initReactI18next).init({
      lng: 'en',
      interpolation: { escapeValue: false },
      resources: { en: { translation: translationEn } },
    });
  });

  const mockRevealState = (
    state: Partial<ReturnType<typeof useRevealPhrase>>,
  ) =>
    jest.mocked(useRevealPhrase).mockReturnValue({
      onPhraseReveal: jest.fn(),
      recoveryPhrase: '',
      isAuthorized: false,
      error: '',
      isFetching: false,
      ...state,
    } as ReturnType<typeof useRevealPhrase>);

  const renderFlow = () =>
    render(
      <ThemeProvider theme="light" toastVariant="extension">
        <I18nextProvider i18n={i18n}>
          <MnemonicFlow />
        </I18nextProvider>
      </ThemeProvider>,
    );

  it('warns about sharing the phrase on the password step, before it is revealed', () => {
    mockRevealState({});

    const { container } = renderFlow();

    const warning = screen.getByTestId('recovery-phrase-share-warning');
    expect(warning.textContent).toBe(SHARE_WARNING);
    expect(screen.queryByTestId('phrase-card')).toBeNull();

    // The warning is rendered above the password field.
    const passwordInput = container.querySelector('input[type="password"]');
    expect(passwordInput).not.toBeNull();
    expect(
      warning.compareDocumentPosition(passwordInput as Node) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  it('keeps the warning visible once the phrase is revealed', () => {
    mockRevealState({
      isAuthorized: true,
      recoveryPhrase: 'test phrase words',
    });

    renderFlow();

    expect(
      screen.getByTestId('recovery-phrase-share-warning').textContent,
    ).toBe(SHARE_WARNING);
    expect(screen.getByTestId('phrase-card').textContent).toBe(
      'test phrase words',
    );
  });
});
