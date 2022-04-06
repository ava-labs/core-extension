import {
  VerticalFlex,
  HorizontalFlex,
  WalletIcon,
  CreateWalletIcon,
  VerticalSeparator,
} from '@avalabs/react-components';
import { OnboardButton, TermsButton } from './components/OnboardButton';
import { useTheme } from 'styled-components';
import { Logo } from '@src/components/icons/Logo';
import { BrandName } from '@src/components/icons/BrandName';
import { BetaLabel } from '@src/components/icons/BetaLabel';

interface WelcomeProps {
  onNext: (isImportFlow: boolean) => void;
}

export function Welcome({ onNext }: WelcomeProps) {
  const theme = useTheme();

  return (
    <VerticalFlex width="100%" align="center">
      <VerticalFlex justify="center" align="center" margin="58px 0 36px">
        <Logo height={132} />
        <BrandName height={50} margin="24px 0 0 0" />
        <HorizontalFlex justify="flex-end" width="100%" margin="10px 0 0 0">
          <BetaLabel />
        </HorizontalFlex>
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
