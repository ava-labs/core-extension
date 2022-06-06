import {
  VerticalFlex,
  HorizontalFlex,
  WalletIcon,
  CreateWalletIcon,
  VerticalSeparator,
} from '@avalabs/react-components';
import { OnboardButton } from './components/OnboardButton';
import { useTheme } from 'styled-components';
import { BetaLabel } from '@src/components/icons/BetaLabel';
import animationData from '@src/images/OwlAnimation-short.json';
import Lottie from 'react-lottie';

interface WelcomeProps {
  onNext: (isImportFlow: boolean) => void;
}
const defaultOptions = {
  loop: false,
  autoplay: true,
  animationData: animationData,
};

export function Welcome({ onNext }: WelcomeProps) {
  const theme = useTheme();
  return (
    <VerticalFlex width="100%" align="center">
      <VerticalFlex justify="center" align="center" margin="22px 0 36px">
        <Lottie options={defaultOptions} height={260} width={260} />
        <HorizontalFlex justify="flex-end" width="100%">
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
      </VerticalFlex>
    </VerticalFlex>
  );
}
