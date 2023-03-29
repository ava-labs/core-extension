import { FAB } from '@src/components/common/fab/FAB';
import { Portfolio } from './components/Portfolio/Portfolio';
import { useSettingsContext } from '@src/contexts/SettingsProvider';
import { useEffect, useState } from 'react';
import { useOnboardingContext } from '@src/contexts/OnboardingProvider';
import { useTranslation } from 'react-i18next';
import { LedgerWrongVersionOverlay } from '../Ledger/LedgerWrongVersionOverlay';
import {
  toast,
  ToastCard,
  Typography,
  Button,
  Stack,
} from '@avalabs/k2-components';

export function Home() {
  const { t } = useTranslation();
  const { toggleIsDefaultExtension, isDefaultExtension } = useSettingsContext();
  const { updateInitialOpen, onboardingState } = useOnboardingContext();
  const [isSetAsDefaultDisplayed, setIsSetAsDefaultDisplayed] = useState(false);

  useEffect(() => {
    if (
      !isSetAsDefaultDisplayed &&
      onboardingState.initialOpen &&
      !isDefaultExtension
    ) {
      const toaster = toast.custom(
        <ToastCard
          onDismiss={() => {
            updateInitialOpen();
            toast.remove(toaster);
          }}
          variant="success"
          title={t("You've entered your Core wallet!")}
          sx={{ width: '343px', minWidth: '343px', position: 'relative' }}
        >
          <Stack
            sx={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Typography>{t('Set as your default wallet?')}</Typography>
            <Button
              onClick={() => {
                toggleIsDefaultExtension();
                updateInitialOpen();
                toast.remove(toaster);
              }}
            >
              {t('Yes')}
            </Button>
          </Stack>
        </ToastCard>,
        {
          duration: Infinity,
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
    t,
  ]);

  return (
    <>
      <Stack sx={{ width: '100%' }}>
        <Portfolio />
        <FAB />
      </Stack>
      <LedgerWrongVersionOverlay />
    </>
  );
}
