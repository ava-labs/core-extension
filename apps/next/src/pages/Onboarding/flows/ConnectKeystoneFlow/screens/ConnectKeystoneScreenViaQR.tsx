import { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import {
  FullscreenModalActions,
  FullscreenModalContent,
  FullscreenModalDescription,
  FullscreenModalTitle,
  useModalPageControl,
} from '@/components/FullscreenModal';
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
      <FullscreenModalTitle>{t('Camera access')}</FullscreenModalTitle>
      <FullscreenModalDescription>
        {t('Allow Chrome to access your camera to scan the QR code.')}
      </FullscreenModalDescription>
      <FullscreenModalContent sx={{ alignItems: 'center', gap: 3 }}>
        <KeystoneQRConnector
          onQRCodeScanned={onSuccess}
          onUnreadableQRCode={onFailure}
          accountIndexes={accountIndexes}
        />
      </FullscreenModalContent>
      <FullscreenModalActions sx={{ justifyContent: 'center' }}>
        <KeystoneSupportButton />
      </FullscreenModalActions>
    </>
  );
};
