import React from 'react';
import {
  Typography,
  Stack,
  toast,
  CopyIcon,
  TypographyProps,
  StackProps,
} from '@avalabs/core-k2-components';
import { useTranslation } from 'react-i18next';

import { truncateAddress } from '@core/utils';

export type SimpleAddressProps = StackProps & {
  address: string;
  textColor?: TypographyProps['color'];
  iconColor?: TypographyProps['color'];
  copyCallback?: () => void;
};

export function SimpleAddress({
  address,
  iconColor,
  textColor,
  copyCallback,
  ...props
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
      {...props}
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
