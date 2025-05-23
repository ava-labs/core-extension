import { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { EncryptedIcon, Divider, LedgerIcon, Stack } from '@avalabs/k2-alpine';

import {
  OnboardingStepContent,
  OnboardingStepTitle,
  useModalPageControl,
} from '@/components/OnboardingModal';

import { CardMenu, CardMenuItem } from '../components/CardMenu';

export const OnboardingStrategyChoiceScreen: FC = () => {
  const { t } = useTranslation();
  const { setCurrent, setTotal } = useModalPageControl();

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
        <CardMenu sx={{ width: 1, flex: '0 0 auto' }}>
          <CardMenuItem
            link={'/onboarding/import/recovery-phrase'}
            icon={<EncryptedIcon size={24} />}
            text={t('Manually enter a recovery phrase')}
          />
          <Divider sx={{ ml: 7, mr: 2 }} />
          <CardMenuItem
            link={'/onboarding/import/ledger'}
            icon={<LedgerIcon size={24} />}
            text={t('Add using Ledger')}
          />
          <Divider sx={{ ml: 7, mr: 2 }} />
          <CardMenuItem
            link={'/onboarding/import/keystone'}
            icon={<LedgerIcon size={24} />} // TODO: Add Keystone icon
            text={t('Add using Keystone')}
          />
        </CardMenu>
      </OnboardingStepContent>
    </Stack>
  );
};
