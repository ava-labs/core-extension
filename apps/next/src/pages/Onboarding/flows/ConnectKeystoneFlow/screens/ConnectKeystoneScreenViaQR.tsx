import { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import {
  OnboardingStepActions,
  OnboardingStepContent,
  OnboardingStepDescription,
  OnboardingStepTitle,
  useModalPageControl,
} from '@/components/OnboardingModal';
import { OnboardingScreenProps } from '@/pages/Onboarding/types';

import { KeystoneSupportButton, KeystoneQRConnector } from '../components';
import { DerivedKeys } from '../types';

type ConnectKeystoneScreenViaQRProps = OnboardingScreenProps & {
  onSuccess: (derivedInfo: DerivedKeys) => void;
  onFailure: (isDimensionsError: boolean) => void;
  accountIndexes: number[];
};

export const ConnectKeystoneScreenViaQR: FC<
  ConnectKeystoneScreenViaQRProps
> = ({ step, totalSteps, onSuccess, onFailure, accountIndexes }) => {
  const { t } = useTranslation();
  const { setCurrent, setTotal } = useModalPageControl();

  useEffect(() => {
    setCurrent(step);
    setTotal(totalSteps);
  }, [setCurrent, setTotal, step, totalSteps]);

  return (
    <>
      <OnboardingStepTitle>{t('Camera access')}</OnboardingStepTitle>
      <OnboardingStepDescription>
        {t('Allow Chrome to access your camera to scan the QR code.')}
      </OnboardingStepDescription>
      <OnboardingStepContent sx={{ alignItems: 'center', gap: 3 }}>
        <KeystoneQRConnector
          onQRCodeScanned={onSuccess}
          onUnreadableQRCode={onFailure}
          accountIndexes={accountIndexes}
        />
      </OnboardingStepContent>
      <OnboardingStepActions sx={{ justifyContent: 'center' }}>
        <KeystoneSupportButton />
      </OnboardingStepActions>
    </>
  );
};
