import { OnboardButton } from './components/OnboardButton';
import animationData from '@src/images/OwlAnimation-short.json';
import Lottie from 'react-lottie';
import { OnboardingPhase } from '@src/background/services/onboarding/models';
import { useTranslation } from 'react-i18next';
import {
  Divider,
  LedgerIcon,
  PlusIcon,
  RecoveryPhraseIcon,
  Stack,
  WalletIcon,
} from '@avalabs/k2-components';

interface WelcomeProps {
  onNext: (isImportFlow: OnboardingPhase) => void;
}
const defaultOptions = {
  loop: false,
  autoplay: true,
  animationData: animationData,
};

export function Welcome({ onNext }: WelcomeProps) {
  const { t } = useTranslation();

  return (
    <Stack sx={{ width: '100%', alignItems: 'center', rowGap: 10 }}>
      <Stack sx={{ mt: 12.5 }}>
        <Lottie options={defaultOptions} height={200} width={200} />
      </Stack>
      <Stack>
        <Stack
          sx={{
            flexDirection: 'row',
            columnGap: 1,
          }}
          divider={<Divider orientation="vertical" flexItem />}
        >
          <Stack>
            <OnboardButton
              testId="create-new-wallet"
              title={t('Create a New Wallet')}
              onClick={() => onNext(OnboardingPhase.ANALYTICS_CONSENT)}
            >
              <PlusIcon size={42} />
            </OnboardButton>
          </Stack>

          <Stack
            sx={{
              '&:hover': {
                '& .existing-wallet': {
                  display: 'none',
                },
                '& .existing-wallet-buttons': {
                  display: 'flex',
                },
              },
            }}
          >
            <OnboardButton
              className="existing-wallet"
              testId="access-existing-wallet"
              title={t('Access Existing Wallet')}
            >
              <WalletIcon size={42} className="wallet-icon" />
            </OnboardButton>
            <Stack
              className="existing-wallet-buttons"
              sx={{
                display: 'none',
                width: (theme) => theme.spacing(29.25),
                height: '100%',
                justifyContent: 'space-evenly',
              }}
            >
              <OnboardButton
                testId="recovery-phrase"
                title={t('Recovery Phrase')}
                onClick={() => onNext(OnboardingPhase.IMPORT_WALLET)}
                variant="small"
              >
                <RecoveryPhraseIcon size={35} />
              </OnboardButton>
              <OnboardButton
                testId="ledger"
                title={t('Ledger')}
                onClick={() => {
                  onNext(OnboardingPhase.LEDGER);
                }}
                variant="small"
              >
                <LedgerIcon size={35} />
              </OnboardButton>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
}
