import {
  VerticalFlex,
  HorizontalFlex,
  WalletIcon,
  CreateWalletIcon,
  VerticalSeparator,
} from '@avalabs/react-components';
import { LoginIllustration } from '@src/components/common/LoginIllustation';
import { OnboardButton, TermsButton } from './components/OnboardButton';
import { useTheme } from 'styled-components';
import { OnboardingStepHeader } from './components/OnboardingStepHeader';

interface WelcomeProps {
  onNext: (isImportFlow: boolean) => void;
}

export function Welcome({ onNext }: WelcomeProps) {
  const theme = useTheme();

  return (
    <VerticalFlex width="100%" align="center">
      <OnboardingStepHeader title="Welcome to Core X" />
      <VerticalFlex justify="center" margin="48px 0 64px">
        <LoginIllustration size={144} variant="secondary" />
      </VerticalFlex>
      <VerticalFlex align="center">
        <HorizontalFlex>
          <OnboardButton
            title="Create a New Wallet"
            onClick={() => onNext(false)}
          >
            <CreateWalletIcon color={theme.colors.icon1} height="56px" />
          </OnboardButton>
          <VerticalSeparator margin="0 24px" />
          <OnboardButton
            title="Access Existing Wallet"
            onClick={() => onNext(true)}
          >
            <WalletIcon color={theme.colors.icon1} height="56px" />
          </OnboardButton>
        </HorizontalFlex>

        <TermsButton />
      </VerticalFlex>
    </VerticalFlex>
  );
}
