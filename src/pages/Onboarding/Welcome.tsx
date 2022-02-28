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

interface WelcomeProps {
  onNext: (isImportFlow: boolean) => void;
}

export function Welcome({ onNext }: WelcomeProps) {
  const theme = useTheme();

  return (
    <VerticalFlex width="100%" align="center">
      <VerticalFlex justify="center" margin="22px 0 64px">
        <Logo height={204} />
        <BrandName width={288} />
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
