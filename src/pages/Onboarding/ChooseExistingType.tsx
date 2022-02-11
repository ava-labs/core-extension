import {
  VerticalFlex,
  HorizontalFlex,
  LedgerIcon,
  RecoveryLockIcon,
  VerticalSeparator,
} from '@avalabs/react-components';
import { OnboardButton, TermsButton } from './components/OnboardButton';
import { useTheme } from 'styled-components';
import { OnboardingStepHeader } from './components/OnboardingStepHeader';
import { Logo } from '@src/components/icons/Logo';

interface ChooseExistingTypeProps {
  onNext: (isImportFlow: boolean) => void;
  onBack(): void;
  onCancel(): void;
}

export function ChooseExistingType({
  onNext,
  onBack,
  onCancel,
}: ChooseExistingTypeProps) {
  const theme = useTheme();

  return (
    <VerticalFlex width="100%" align="center">
      <OnboardingStepHeader
        title="Access Using..."
        onBack={onBack}
        onClose={onCancel}
      />
      <VerticalFlex justify="center" margin="48px 0 64px">
        <Logo height={144} />
      </VerticalFlex>
      <VerticalFlex align="center">
        <HorizontalFlex>
          <OnboardButton title="Recovery phrase" onClick={() => onNext(true)}>
            <RecoveryLockIcon color={theme.colors.icon1} height="56px" />
          </OnboardButton>
          <VerticalSeparator margin="0 24px" />
          <OnboardButton
            title="Ledger"
            onClick={() => {
              onNext(false);
            }}
          >
            <LedgerIcon color={theme.colors.icon1} height="56px" />
          </OnboardButton>
        </HorizontalFlex>
        <TermsButton />
      </VerticalFlex>
    </VerticalFlex>
  );
}
