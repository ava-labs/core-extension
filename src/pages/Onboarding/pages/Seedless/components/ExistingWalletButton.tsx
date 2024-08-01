import { Stack, Typography } from '@avalabs/core-k2-components';
import { ReactNode } from 'react';

interface ExistingWalletButtonProps {
  icon: ReactNode;
  text: string;
  onClick: () => void;
}

export function ExistingWalletButton({
  icon,
  text,
  onClick,
}: ExistingWalletButtonProps) {
  return (
    <Stack
      sx={{
        width: '225px',
        height: '180px',
        borderRadius: 2,
        backgroundColor: 'grey.700',
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: 'grey.200',
          color: 'grey.700',
        },
        alignItems: 'flex-start',
        p: 2,
        rowGap: 1,
      }}
      onClick={() => {
        onClick();
      }}
    >
      {icon}
      <Typography
        variant="h6"
        sx={{
          width: '130px',
          textAlign: 'start',
          fontWeight: 'fontWeightSemibolds',
        }}
      >
        {text}
      </Typography>
    </Stack>
  );
}
