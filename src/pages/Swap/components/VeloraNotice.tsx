import { useTranslation } from 'react-i18next';
import {
  InfoCircleIcon,
  Stack,
  Typography,
  Tooltip,
} from '@avalabs/core-k2-components';
import { VeloraIcon } from '@src/components/icons/VeloraIcon';

export function VeloraNotice() {
  const { t } = useTranslation();

  return (
    <Stack
      sx={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 0.75,
      }}
    >
      <Typography variant="caption">{t('Powered by')}</Typography>
      <VeloraIcon />
      <Stack sx={{ flexDirection: 'row' }}>
        <Tooltip
          placement={'top'}
          title={t("You will interact directly with Velora's smart contracts.")}
        >
          <InfoCircleIcon size="14px" />
        </Tooltip>
      </Stack>
    </Stack>
  );
}
