import { ThemeProvider } from '@avalabs/k2-alpine';
import { useAnalyticsContext } from '@core/ui';
import { fireEvent, render, screen } from '@shared/tests/test-utils';
import { useCopySecretToClipboard } from '@/hooks/useCopySecretToClipboard';
import { KeyRevealed } from './KeyRevealed';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

jest.mock('react-router-dom', () => ({
  useHistory: () => ({ goBack: jest.fn() }),
}));

jest.mock('@core/ui', () => ({
  useAnalyticsContext: jest.fn(),
}));

jest.mock('@/hooks/useCopySecretToClipboard', () => ({
  useCopySecretToClipboard: jest.fn(),
}));

describe('KeyRevealed', () => {
  it('copies the private key through the secret clipboard helper', () => {
    const capture = jest.fn();
    const copySecret = jest.fn();
    jest.mocked(useAnalyticsContext).mockReturnValue({
      capture,
    } as unknown as ReturnType<typeof useAnalyticsContext>);
    jest.mocked(useCopySecretToClipboard).mockReturnValue(copySecret);
    const writeText = jest.fn();
    Object.assign(navigator, { clipboard: { writeText } });

    render(
      <ThemeProvider theme="light" toastVariant="extension">
        <KeyRevealed privateKey="0xprivatekey" />
      </ThemeProvider>,
    );
    fireEvent.click(screen.getByTestId('copy-private-key-button'));

    expect(copySecret).toHaveBeenCalledWith('0xprivatekey', 'privateKey');
    expect(capture).toHaveBeenCalledWith('ExportPrivateKeyCopied');
    expect(writeText).not.toHaveBeenCalled();
  });
});
