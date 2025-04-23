import {
  CopyIcon,
  Stack,
  toast,
  Tooltip,
  Typography,
} from '@avalabs/core-k2-components';
import { useTranslation } from 'react-i18next';

import { truncateAddress } from '@core/utils';

type ContactAddressProps = {
  networkIcon: JSX.Element;
  address: string;
};

export const ContactAddress = ({
  networkIcon,
  address,
}: ContactAddressProps) => {
  const { t } = useTranslation();

  const copyAddress = (ev: React.MouseEvent) => {
    ev.stopPropagation();
    navigator.clipboard.writeText(address);
    toast(t('Copied!'), { duration: 2000 });
  };

  return (
    <Stack sx={{ flexDirection: 'row', gap: 0.25, alignItems: 'center' }}>
      {networkIcon}
      <CopyIcon
        role="button"
        onClick={copyAddress}
        size={16}
        sx={{ p: 0.5, ':hover': { color: 'secondary.main' } }}
        color="primary"
      />
      <Tooltip
        title={address}
        wrapWithSpan={false}
        disableInteractive
        PopperProps={{ disablePortal: true }}
      >
        <Typography variant="body2" color="inherit" sx={{ width: '92px' }}>
          {truncateAddress(address)}
        </Typography>
      </Tooltip>
    </Stack>
  );
};
