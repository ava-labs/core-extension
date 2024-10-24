import { Stack, Typography, useTheme } from '@avalabs/core-k2-components';
import React from 'react';

type TxDetailsRowProps = { label: string | React.ReactNode };

export const TxDetailsRow: React.FC<TxDetailsRowProps> = ({
  children,
  label,
}) => {
  const theme = useTheme();

  return (
    <Stack
      sx={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        gap: 1,
      }}
    >
      {typeof label === 'string' ? (
        <Typography variant="caption" color="text.secondary">
          {label}
        </Typography>
      ) : (
        label
      )}
      <Stack
        sx={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 1,
          minHeight: theme.spacing(2),
          minWidth: '0px',
          wordWrap: 'break-word',
        }}
      >
        {children}
      </Stack>
    </Stack>
  );
};
