import { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { EncryptedIcon, Divider, LedgerIcon, Stack } from '@avalabs/k2-alpine';

import { useAnalyticsContext } from '@core/ui';

import {
  OnboardingStepContent,
  OnboardingStepTitle,
  useModalPageControl,
} from '@/components/OnboardingModal';

import { CardMenu, CardMenuItem } from '../components/CardMenu';

export const OnboardingStrategyChoiceScreen: FC = () => {
  const { t } = useTranslation();
  const { setCurrent, setTotal } = useModalPageControl();
  const { capture } = useAnalyticsContext();

  useEffect(() => {
    setCurrent(0);
    setTotal(0);
  }, [setCurrent, setTotal]);

  return (
    <Stack>
      <OnboardingStepTitle>
        {t('How would you like to access your existing wallet?')}
      </OnboardingStepTitle>
      <OnboardingStepContent>
        <CardMenu
          sx={{ width: 1, flex: '0 0 auto' }}
          divider={<Divider sx={{ ml: 8, mr: 3 }} />}
        >
          <CardMenuItem
            link={'/onboarding/import/recovery-phrase'}
            icon={<EncryptedIcon size={24} />}
            text={t('Manually enter a recovery phrase')}
            onClick={() => capture('OnboardingImportMnemonicSelected')}
          />
          <CardMenuItem
            link={'/onboarding/import/ledger'}
            icon={<LedgerIcon size={24} />}
            text={t('Add using Ledger')}
            onClick={() => capture('OnboardingImportLedgerSelected')}
          />
          <CardMenuItem
            link={'/onboarding/import/keystone'}
            icon={<LedgerIcon size={24} />} // TODO: Add Keystone icon
            text={t('Add using Keystone')}
            onClick={() => capture('OnboardingKeystoneSelected')}
          />
        </CardMenu>
      </OnboardingStepContent>
    </Stack>
  );
};
