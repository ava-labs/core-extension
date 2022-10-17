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
import { OnboardingPhase } from '@src/background/services/onboarding/models';
import { t } from 'i18next';

const ExistingWalletButton = styled(OnboardButton)`
  .lock-ledger-icon-container {
    display: none;
    height: 100%;
  }

  .wallet-icon {
    display: block;
    height: 100%;
  }
`;

const ButtonsWrapper = styled(VerticalFlex)`
  display: none;
  height: 100%;
  width: 234px;
`;

const ExistingButtonsWrapper = styled.div`
  :hover {
    ${ExistingWalletButton} {
      display: none;
    }
    ${ButtonsWrapper} {
      display: flex;
    }
  }
`;

interface WelcomeProps {
  onNext: (isImportFlow: OnboardingPhase) => void;
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
            testId="create-new-wallet"
            title={t('Create a New Wallet')}
            onClick={() => onNext(OnboardingPhase.ANALYTICS_CONSENT)}
          >
            <CreateWalletIcon color={theme.colors.icon1} height="56px" />
          </OnboardButton>
          <VerticalSeparator margin="0 24px" />
          <ExistingButtonsWrapper>
            <ExistingWalletButton
              testId="access-existing-wallet"
              title={t('Access Existing Wallet')}
            >
              <WalletIcon
                color={theme.colors.icon1}
                height="56px"
                width="56px"
                className="wallet-icon"
              />
            </ExistingWalletButton>
            <ButtonsWrapper justify="space-evenly">
              <OnboardButton
                testId="recovery-phrase"
                title={t('Recovery Phrase')}
                onClick={() => onNext(OnboardingPhase.IMPORT_WALLET)}
                variant="small"
              >
                <RecoveryLockIcon color={theme.colors.icon1} height="35px" />
              </OnboardButton>
              <VerticalSeparator margin="0 24px" />
              <OnboardButton
                testId="ledger"
                title={t('Ledger')}
                onClick={() => {
                  onNext(OnboardingPhase.LEDGER);
                }}
                variant="small"
              >
                <LedgerIcon color={theme.colors.icon1} height="35px" />
              </OnboardButton>
            </ButtonsWrapper>
          </ExistingButtonsWrapper>
        </HorizontalFlex>
      </VerticalFlex>
    </VerticalFlex>
  );
}
