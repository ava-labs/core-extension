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
  minNumberOfKeys: number;
};

export const ConnectKeystoneScreenViaQR: FC<
  ConnectKeystoneScreenViaQRProps
> = ({ step, totalSteps, onSuccess, onFailure, minNumberOfKeys }) => {
  const { t } = useTranslation();
  const { setCurrent, setTotal } = useModalPageControl();

  useEffect(() => {
    setCurrent(step);
    setTotal(totalSteps);
  }, [setCurrent, setTotal, step, totalSteps]);

  return (
    <>
      <FullscreenModalTitle>{t('Camera access')}</FullscreenModalTitle>
      <FullscreenModalDescription sx={{ whiteSpace: 'pre-line' }}>
        {t(
          'Use your camera to scan the QR code on your Keystone device.\nThe preview will appear blurred, but scanning will still work normally.',
        )}
      </FullscreenModalDescription>
      <FullscreenModalContent sx={{ alignItems: 'center', gap: 3 }}>
        <KeystoneQRConnector
          onQRCodeScanned={onSuccess}
          onUnreadableQRCode={onFailure}
          minNumberOfKeys={minNumberOfKeys}
        />
      </FullscreenModalContent>
      <FullscreenModalActions sx={{ justifyContent: 'center' }}>
        <KeystoneSupportButton />
      </FullscreenModalActions>
    </>
  );
};
