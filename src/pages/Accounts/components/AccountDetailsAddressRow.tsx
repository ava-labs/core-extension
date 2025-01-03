import { useTranslation } from 'react-i18next';
import { Button, Stack, Typography } from '@avalabs/core-k2-components';

import { stripAddressPrefix } from '@src/utils/stripAddressPrefix';
import { truncateAddress } from '@src/utils/truncateAddress';

export const AccountDetailsAddressRow = ({
  icon,
  label,
  address,
  copyHandler,
  ...props
}) => {
  const { t } = useTranslation();

  return (
    <Stack direction="row" sx={{ gap: 2, alignItems: 'start' }} {...props}>
      <Stack direction="row" sx={{ gap: 1, flexGrow: 1 }}>
        {icon}
        <Stack>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 'fontWeightSemibold',
              whiteSpace: 'nowrap',
            }}
          >
            {label}
          </Typography>
          <Typography variant="caption" color="text.secondary" monospace>
            {truncateAddress(stripAddressPrefix(address), 16)}
          </Typography>
        </Stack>
      </Stack>
      <Button
        color="secondary"
        size="small"
        onClick={copyHandler}
        sx={{ alignSelf: 'center' }}
        data-testid="address-copy-button"
      >
        {t('Copy')}
      </Button>
    </Stack>
  );
};
