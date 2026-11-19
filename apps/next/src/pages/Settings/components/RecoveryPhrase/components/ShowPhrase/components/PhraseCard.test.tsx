import { ThemeProvider } from '@avalabs/k2-alpine';
import { fireEvent, render, screen } from '@shared/tests/test-utils';
import { useCopySecretToClipboard } from '@/hooks/useCopySecretToClipboard';
import { PhraseCard } from './PhraseCard';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

jest.mock('@/hooks/useCopySecretToClipboard', () => ({
  useCopySecretToClipboard: jest.fn(),
}));

describe('PhraseCard', () => {
  it('copies the phrase through the secret clipboard helper', () => {
    const copySecret = jest.fn();
    jest.mocked(useCopySecretToClipboard).mockReturnValue(copySecret);
    const writeText = jest.fn();
    Object.assign(navigator, { clipboard: { writeText } });

    render(
      <ThemeProvider theme="light" toastVariant="extension">
        <PhraseCard phrase="alpha beta gamma" />
      </ThemeProvider>,
    );
    fireEvent.click(screen.getByTestId('copy-phrase-button'));

    expect(copySecret).toHaveBeenCalledWith(
      'alpha beta gamma',
      'recoveryPhrase',
    );
    expect(writeText).not.toHaveBeenCalled();
  });
});
