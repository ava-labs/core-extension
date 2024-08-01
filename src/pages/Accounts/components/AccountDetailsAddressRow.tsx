import {
  CopyIcon,
  IconButton,
  Stack,
  Typography,
} from '@avalabs/core-k2-components';

import { stripAddressPrefix } from '@src/utils/stripAddressPrefix';

export const AccountDetailsAddressRow = ({
  icon,
  label,
  address,
  copyHandler,
  ...props
}) => (
  <Stack direction="row" sx={{ gap: 0.5, alignItems: 'start' }} {...props}>
    <Stack
      direction="row"
      sx={{ gap: 1, alignItems: 'center', minWidth: '30%' }}
    >
      {icon}
      <Typography
        variant="body2"
        sx={{
          fontWeight: 'fontWeightSemibold',
          whiteSpace: 'nowrap',
          zIndex: 1,
        }}
      >
        {label}
      </Typography>
    </Stack>
    <Typography variant="body2" sx={{ ml: 1, wordBreak: 'break-all' }}>
      {stripAddressPrefix(address)}
    </Typography>
    <IconButton
      size="small"
      onClick={copyHandler}
      sx={{ alignSelf: 'center' }}
      data-testid="address-copy-button"
    >
      <CopyIcon />
    </IconButton>
  </Stack>
);
