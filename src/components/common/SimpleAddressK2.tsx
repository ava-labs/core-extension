import React from 'react';
import {
  Typography,
  Stack,
  toast,
  CopyIcon,
  TypographyProps,
} from '@avalabs/k2-components';
import { useTranslation } from 'react-i18next';

import { truncateAddress } from '@src/utils/truncateAddress';

export interface SimpleAddressProps {
  address: string;
  textColor?: TypographyProps['color'];
  iconColor?: TypographyProps['color'];
  copyCallback?: () => void;
}

export function SimpleAddressK2({
  address,
  iconColor,
  textColor,
  copyCallback,
}: SimpleAddressProps) {
  const { t } = useTranslation();

  const copyAddress = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(address);
    toast.success(t('Copied!'), { duration: 2000 });

    if (copyCallback) {
      copyCallback();
    }
  };

  return (
    <Stack
      direction="row"
      sx={{
        gap: 1,
        cursor: 'pointer',
        alignItems: 'center',
        textAlign: 'center',
      }}
      onClick={copyAddress}
    >
      <CopyIcon
        sx={{
          ...(iconColor ? { color: iconColor } : {}),
        }}
      />
      <Typography variant="caption" color={textColor}>
        {truncateAddress(address)}
      </Typography>
    </Stack>
  );
}
