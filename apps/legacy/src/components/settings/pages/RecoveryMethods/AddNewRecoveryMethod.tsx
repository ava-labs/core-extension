import { useTranslation } from 'react-i18next';
import { Stack } from '@avalabs/core-k2-components';

import { Overlay } from '@/components/common/Overlay';
import { PageTitle } from '@/components/common/PageTitle';

import { RecoveryMethodsList } from './RecoveryMethodsList';

export function AddNewRecoveryMethod({
  onBackClick,
  onMethodClick,
  excludeTotp,
}) {
  const { t } = useTranslation();

  return (
    <Overlay isBackgroundFilled>
      <Stack sx={{ width: 1, height: 1, pt: 1.5, gap: 2 }}>
        <PageTitle onBackClick={onBackClick}>{t('Recovery Methods')}</PageTitle>

        <Stack sx={{ width: 1, px: 2, gap: 3 }}>
          <RecoveryMethodsList
            onMethodClick={onMethodClick}
            asCards
            excludeTotp={excludeTotp}
          />
        </Stack>
      </Stack>
    </Overlay>
  );
}
