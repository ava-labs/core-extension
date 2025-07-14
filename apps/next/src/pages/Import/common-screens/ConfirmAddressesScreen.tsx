import { useTranslation } from 'react-i18next';
import { FC, PropsWithChildren, useEffect } from 'react';

import {
  FullscreenModalActions,
  FullscreenModalContent,
  FullscreenModalDescription,
  FullscreenModalTitle,
  useModalPageControl,
} from '@/components/FullscreenModal';
import { OnboardingScreenProps } from '@/pages/Onboarding/types';
import { DerivedAddresses } from '@/pages/Onboarding/components/DerivedAddresses';
import { NavButton } from '@/pages/Onboarding/components/NavButton';

type ConfirmAddressesScreenProps = PropsWithChildren<
  OnboardingScreenProps & {
    addresses: string[];
    chainCaipId: string;
    onNext: () => void;
    isImporting: boolean;
  }
>;

export const ConfirmAddressesScreen: FC<ConfirmAddressesScreenProps> = ({
  onNext,
  step,
  totalSteps,
  addresses,
  chainCaipId,
  isImporting,
}) => {
  const { t } = useTranslation();
  const { setCurrent, setTotal } = useModalPageControl();

  useEffect(() => {
    setCurrent(step);
    setTotal(totalSteps);
  }, [setCurrent, setTotal, step, totalSteps]);

  return (
    <>
      <FullscreenModalTitle>{t('Confirm addresses')}</FullscreenModalTitle>
      <FullscreenModalDescription>
        {t('Please confirm the following addresses are correct.')}
      </FullscreenModalDescription>
      <FullscreenModalContent>
        <DerivedAddresses addresses={addresses} chainCaipId={chainCaipId} />
      </FullscreenModalContent>
      <FullscreenModalActions
        sx={{
          gap: 6,
          pt: 2,
        }}
      >
        <NavButton
          color="primary"
          onClick={onNext}
          loading={isImporting}
          disabled={isImporting}
        >
          {t('Confirm')}
        </NavButton>
      </FullscreenModalActions>
    </>
  );
};
