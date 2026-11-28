import { ThemeProvider } from '@avalabs/k2-alpine';
import { fireEvent, render, screen } from '@shared/tests/test-utils';
import { useCopySecretToClipboard } from '@/hooks/useCopySecretToClipboard';
import { NewSeedphraseScreen } from './NewSeedphraseScreen';

const MNEMONIC =
  'one two three four five six seven eight nine ten eleven twelve';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

jest.mock('@core/common', () => ({
  createNewMnemonic: () => MNEMONIC,
}));

jest.mock('@/hooks/useCopySecretToClipboard', () => ({
  useCopySecretToClipboard: jest.fn(),
}));

jest.mock('@/components/FullscreenModal', () => {
  const Passthrough = ({ children }: { children?: React.ReactNode }) => (
    <div>{children}</div>
  );
  return {
    FullscreenModalActions: Passthrough,
    FullscreenModalContent: Passthrough,
    FullscreenModalDescription: Passthrough,
    FullscreenModalTitle: Passthrough,
    useModalPageControl: () => ({ setCurrent: jest.fn(), setTotal: jest.fn() }),
  };
});

jest.mock('@/pages/Onboarding/components/NavButton', () => ({
  NavButton: () => null,
}));

jest.mock('./components/SeedphraseGrid', () => ({
  SeedphraseGrid: () => null,
}));

jest.mock('./components/term', () => ({
  TermsAgreementSection: () => null,
}));

describe('NewSeedphraseScreen', () => {
  it('copies the generated phrase through the secret clipboard helper', () => {
    const copySecret = jest.fn();
    jest.mocked(useCopySecretToClipboard).mockReturnValue(copySecret);
    const writeText = jest.fn();
    Object.assign(navigator, { clipboard: { writeText } });

    render(
      <ThemeProvider theme="light" toastVariant="extension">
        <NewSeedphraseScreen step={1} totalSteps={3} onNext={jest.fn()} />
      </ThemeProvider>,
    );
    fireEvent.click(screen.getByTestId('copy-phrase-button'));

    expect(copySecret).toHaveBeenCalledWith(MNEMONIC, 'recoveryPhrase');
    expect(writeText).not.toHaveBeenCalled();
  });
});
