import { WarningMessage } from '@/components/WarningMessage';
import { Stack } from '@avalabs/k2-alpine';
import { useTranslation } from 'react-i18next';

export const RecoveryMethodFailure = () => {
  const { t } = useTranslation();
  return (
    <Stack
      direction="column"
      rowGap={3}
      paddingBlock="28px 22px"
      paddingInline="0px 30px"
    >
      <WarningMessage>{t('Error occurred. Please try again.')}</WarningMessage>
    </Stack>
  );
};
