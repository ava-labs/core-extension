import { useTranslation } from 'react-i18next';
import {
  InfoCircleIcon,
  Stack,
  Typography,
  Tooltip,
} from '@avalabs/core-k2-components';
import { ParaswapIcon } from '@src/components/icons/ParaswapIcon';

export function ParaswapNotice() {
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
      <ParaswapIcon />
      <Stack sx={{ flexDirection: 'row' }}>
        <Tooltip
          placement={'top'}
          title={t(
            "You will interact directly with Paraswap's smart contracts.",
          )}
        >
          <InfoCircleIcon size="14px" />
        </Tooltip>
      </Stack>
    </Stack>
  );
}
