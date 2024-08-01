import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  CopyIcon,
  IconButton,
  Stack,
  Tooltip,
  Typography,
  toast,
} from '@avalabs/core-k2-components';

import { truncateAddress } from '@src/utils/truncateAddress';

export const CurrentAddressSneakPeek = ({ address }) => {
  const { t } = useTranslation();

  const copy = useCallback(() => {
    navigator.clipboard.writeText(address);
    toast.success(t('Copied!'));
  }, [address, t]);

  return (
    <Stack
      sx={{
        flexDirection: 'row',
        gap: 0.5,
        alignItems: 'center',
      }}
    >
      <Tooltip
        title={address}
        placement="bottom"
        componentsProps={{
          tooltip: { sx: { py: 0.75 } },
        }}
      >
        <Typography variant="body2">{truncateAddress(address)}</Typography>
      </Tooltip>
      <IconButton size="small" onClick={copy}>
        <CopyIcon />
      </IconButton>
    </Stack>
  );
};
