import { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { EncryptedIcon, Divider, LedgerIcon, Stack } from '@avalabs/k2-alpine';

import { useAnalyticsContext } from '@core/ui';

import {
  FullscreenModalContent,
  FullscreenModalTitle,
  useModalPageControl,
} from '@/components/FullscreenModal';

import { CardMenu, CardMenuItem } from '../components/CardMenu';

export const OnboardingStrategyChoiceScreen: FC = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const { setCurrent, setTotal } = useModalPageControl();
  const { capture } = useAnalyticsContext();

  useEffect(() => {
    setCurrent(0);
    setTotal(0);
  }, [setCurrent, setTotal]);

  return (
    <Stack>
      <FullscreenModalTitle>
        {t('How would you like to access your existing wallet?')}
      </FullscreenModalTitle>
      <FullscreenModalContent>
        <CardMenu
          sx={{ width: 1, flex: '0 0 auto' }}
          divider={<Divider sx={{ ml: 8, mr: 3 }} />}
        >
          <CardMenuItem
            data-testid="import-recovery-phrase-option"
            icon={<EncryptedIcon size={24} />}
            text={t('Manually enter a recovery phrase')}
            onClick={() => {
              capture('OnboardingImportMnemonicSelected');
              history.push('/onboarding/import/recovery-phrase');
            }}
          />
          <CardMenuItem
            data-testid="import-ledger-option"
            icon={<LedgerIcon size={24} />}
            text={t('Add using Ledger')}
            onClick={() => {
              capture('OnboardingImportLedgerSelected');
              history.push('/onboarding/import/ledger');
            }}
          />
          <CardMenuItem
            data-testid="import-keystone-option"
            icon={<LedgerIcon size={24} />} // TODO: Add Keystone icon
            text={t('Add using Keystone')}
            onClick={() => {
              capture('OnboardingKeystoneSelected');
              history.push('/onboarding/import/keystone');
            }}
          />
        </CardMenu>
      </FullscreenModalContent>
    </Stack>
  );
};
