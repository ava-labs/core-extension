import {
  VerticalFlex,
  TransactionToast,
  TransactionToastType,
  toast,
} from '@avalabs/react-components';
import { FAB } from '@src/components/common/fab/FAB';
import { Portfolio } from './components/Portfolio/Portfolio';
import { useSettingsContext } from '@src/contexts/SettingsProvider';
import { useEffect, useState } from 'react';
import { useOnboardingContext } from '@src/contexts/OnboardingProvider';
import { t } from 'i18next';
import { LedgerWrongVersionOverlay } from '../Ledger/LedgerWrongVersionOverlay';

export function Home() {
  const { toggleIsDefaultExtension, isDefaultExtension } = useSettingsContext();
  const { updateInitialOpen, onboardingState } = useOnboardingContext();
  const [isSetAsDefaultDisplayed, setIsSetAsDefaultDisplayed] = useState(false);

  useEffect(() => {
    if (
      !isSetAsDefaultDisplayed &&
      onboardingState.initialOpen &&
      !isDefaultExtension
    ) {
      toast.custom(
        <TransactionToast
          status={t("You've entered your Core wallet!")}
          type={TransactionToastType.SUCCESS}
          text={t('Set as your default wallet?')}
          onClick={() => {
            toggleIsDefaultExtension();
            updateInitialOpen();
          }}
          buttonText={t('Yes')}
          onClose={() => {
            updateInitialOpen();
          }}
        />,
        {
          // Toast will show until user clicks X icon or yes button
          duration: Infinity,
          // define id to prevent showing it up multiple times
          id: 'default_extension_toast',
        }
      );
    }
    setIsSetAsDefaultDisplayed(true);
  }, [
    onboardingState,
    isDefaultExtension,
    toggleIsDefaultExtension,
    updateInitialOpen,
    isSetAsDefaultDisplayed,
  ]);

  return (
    <>
      <VerticalFlex width={'100%'}>
        <VerticalFlex flex={1}>
          <Portfolio />
        </VerticalFlex>
        <FAB />
      </VerticalFlex>
      <LedgerWrongVersionOverlay />
    </>
  );
}
