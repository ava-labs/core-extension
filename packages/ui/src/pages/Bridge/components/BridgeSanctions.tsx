import { PageTitle, PageTitleVariant } from 'packages/ui/src/components/common/PageTitle';
import { useTranslation } from 'react-i18next';
import {
  AlertCircleIcon,
  Stack,
  Typography,
} from '@avalabs/core-k2-components';

export const BridgeSanctions = () => {
  const { t } = useTranslation();
  return (
    <Stack
      sx={{
        alignItems: 'center',
        rowGap: 2,
        height: '100%',
      }}
    >
      <PageTitle variant={PageTitleVariant.PRIMARY}></PageTitle>
      <AlertCircleIcon size={72} sx={{ mt: 5 }} />
      <Typography variant="h4">{t('Failed to connect')}</Typography>
      <Typography
        variant="body2"
        sx={{ mx: 5, color: 'text.secondary', textAlign: 'center' }}
      >
        {t(
          'Users may not use the Bridge if they are on the Specially Designated Nationals (SDN) List of the Office of Foreign Assets Control (OFAC) or any other sanctions or are otherwise a sanctioned person or from a sanctioned jurisdiction',
        )}
      </Typography>
    </Stack>
  );
};
