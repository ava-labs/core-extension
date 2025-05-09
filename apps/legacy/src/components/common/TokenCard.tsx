import { PropsWithChildren } from 'react';
import { Card, Stack, Typography } from '@avalabs/core-k2-components';

interface TokenCardProps {
  name: string;
  balanceDisplayValue?: string | number;
  balanceInCurrency?: string;
  onClick?(): void;
}

// TODO: This component is the beginning of the TokenCard from React Components k2 migration, it should be continued in another ticket ie.: #CP-4371 migrate Swap to K2

export function TokenCard({
  name,
  onClick,
  balanceInCurrency,
  children,
}: PropsWithChildren<TokenCardProps>) {
  return (
    <Card
      sx={{
        py: 1,
        px: 2,
        borderRadius: 1,
        mb: 1,
        cursor: `${() => (onClick ? 'pointer' : 'default')}`,
      }}
      onClick={() => onClick && onClick()}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <Stack
        sx={{
          width: '100%',
          flexDirection: 'row',
        }}
        data-testid={`${name}-${balanceInCurrency}`}
      >
        <Stack sx={{ flexDirection: 'row' }}>{children}</Stack>

        <Stack
          sx={{
            justifyContent: 'space-between',
            width: '100%',
            alignItems: 'center',
            flexDirection: 'row',
            ml: 2,
          }}
        >
          <Typography varian="body2">{name}</Typography>
          {balanceInCurrency && (
            <Typography varian="body2">{balanceInCurrency}</Typography>
          )}
        </Stack>
      </Stack>
    </Card>
  );
}
