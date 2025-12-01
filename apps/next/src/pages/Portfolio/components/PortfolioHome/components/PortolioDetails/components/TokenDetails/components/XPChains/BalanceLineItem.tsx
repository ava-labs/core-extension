import { Stack, Typography } from '@avalabs/k2-alpine';
import { FC } from 'react';

type Props = {
  title: string;
  displayBalanceWithSymbol: string;
};
export const BalanceLineItem: FC<Props> = ({
  title,
  displayBalanceWithSymbol,
}) => {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      p={1}
    >
      <Typography variant="subtitle3">{title}</Typography>
      <Typography variant="body3" color="text.secondary" textAlign="right">
        {displayBalanceWithSymbol}
      </Typography>
    </Stack>
  );
};
