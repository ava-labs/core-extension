import {
  VerticalFlex,
  TextButton,
  HorizontalFlex,
  WalletIcon,
  CreateWalletIcon,
  VerticalSeparator,
} from '@avalabs/react-components';
import { LoginIllustration } from '@src/components/common/LoginIllustation';
import { OnboardButton } from './components/OnboardButton';
import styled, { useTheme } from 'styled-components';
import { OnboardingStepHeader } from './components/OnboardingStepHeader';

interface WelcomeProps {
  onNext: (isImportFlow: boolean) => void;
}

const TermsButton = styled(TextButton)`
  height: 40px;
  margin: 64px 0 0 0;
  font-size: 12px;
`;

export function Welcome({ onNext }: WelcomeProps) {
  const theme = useTheme();

  return (
    <VerticalFlex width="100%" align="center">
      <OnboardingStepHeader title="Welcome to Core X!" />
      <VerticalFlex justify="center" margin="48px 0 64px">
        <LoginIllustration size={144} variant="secondary" />
      </VerticalFlex>
      <VerticalFlex align="center">
        <HorizontalFlex>
          <OnboardButton
            margin="3px 24px 3px 0"
            title="Create a New Wallet"
            onClick={() => onNext(false)}
          >
            <CreateWalletIcon color={theme.colors.icon1} height="46px" />
          </OnboardButton>
          <VerticalSeparator margin="0" />
          <OnboardButton
            margin="3px 0 3px 24px"
            title="Access Existing Wallet"
            onClick={() => onNext(true)}
          >
            <WalletIcon color={theme.colors.icon1} height="46px" />
          </OnboardButton>
        </HorizontalFlex>

        <TermsButton as="a">Terms and Conditions</TermsButton>
      </VerticalFlex>
    </VerticalFlex>
  );
}
