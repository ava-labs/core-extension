import {
  VerticalFlex,
  HorizontalFlex,
  WalletIcon,
  CreateWalletIcon,
  VerticalSeparator,
  RecoveryLockIcon,
  LedgerIcon,
} from '@avalabs/react-components';
import { OnboardButton } from './components/OnboardButton';
import styled, { useTheme } from 'styled-components';
import { BetaLabel } from '@src/components/icons/BetaLabel';
import animationData from '@src/images/OwlAnimation-short.json';
import Lottie from 'react-lottie';

const ExistingWalletButton = styled(OnboardButton)`
  .lock-ledger-icon-container {
    display: none;
    height: 100%;
  }

  .wallet-icon {
    display: block;
    height: 100%;
  }

  &:hover {
    .lock-ledger-icon-container {
      display: flex;
      justify-content: space-between;
    }

    .wallet-icon {
      display: none;
    }
  }
`;

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
        <VerticalFlex height="260px">
          <Lottie options={defaultOptions} height={260} width={260} />
        </VerticalFlex>
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
          <ExistingWalletButton
            title="Access Existing Wallet"
            onClick={() => onNext(true)}
            className="access-existing-button"
          >
            <HorizontalFlex
              justify="space-between"
              width="160px"
              className="lock-ledger-icon-container"
            >
              <RecoveryLockIcon color={theme.colors.icon1} height="56px" />
              <LedgerIcon
                color={theme.colors.icon1}
                height="56px"
                width="56px"
              />
            </HorizontalFlex>
            <WalletIcon
              color={theme.colors.icon1}
              height="56px"
              width="56px"
              className="wallet-icon"
            />
          </ExistingWalletButton>
        </HorizontalFlex>
      </VerticalFlex>
    </VerticalFlex>
  );
}
