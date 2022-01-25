import {
  VerticalFlex,
  Typography,
  TextButton,
  HorizontalFlex,
  WalletIcon,
  CreateWalletIcon,
} from '@avalabs/react-components';
import { LoginIllustration } from '@src/components/common/LoginIllustation';
import { OnboardButton } from './components/OnboardButton';
import styled, { useTheme } from 'styled-components';

interface WelcomeProps {
  onNext: (isImportFlow: boolean) => void;
}

const TermsButton = styled(TextButton)`
  height: 24px;
  margin: 40px 0 0 0;
`;

export function Welcome({ onNext }: WelcomeProps) {
  const theme = useTheme();

  return (
    <VerticalFlex width="100%" align="center" justify="space-between">
      <Typography as="h1" size={24} height="29px" weight={700}>
        Welcome to Avalanche!
      </Typography>
      <VerticalFlex justify="center" grow="1">
        <LoginIllustration size={182} variant="secondary" />
      </VerticalFlex>
      <VerticalFlex align="center">
        <HorizontalFlex>
          <OnboardButton margin="0 24px 0 0" onClick={() => onNext(false)}>
            <Typography margin="24px 0 68px 0" size={18} weight={600}>
              Create a new wallet
            </Typography>
            <CreateWalletIcon color={theme.colors.icon1} height="80px" />
          </OnboardButton>

          <OnboardButton onClick={() => onNext(true)}>
            <Typography margin="24px 0 68px 0" size={18} weight={600}>
              Access existing wallet
            </Typography>
            <WalletIcon color={theme.colors.icon1} height="80px" />
          </OnboardButton>
        </HorizontalFlex>

        <TermsButton as="a">Terms and Conditions</TermsButton>
      </VerticalFlex>
    </VerticalFlex>
  );
}
