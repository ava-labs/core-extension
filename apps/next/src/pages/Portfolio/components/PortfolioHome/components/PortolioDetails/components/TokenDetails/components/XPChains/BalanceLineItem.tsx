import { Stack, Typography } from '@avalabs/k2-alpine';
import { FC } from 'react';

type Props = {
  title: string;
  balance: string;
};
export const BalanceLineItem: FC<Props> = ({ title, balance }) => {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      p={1}
    >
      <Typography variant="subtitle3">{title}</Typography>
      <Typography variant="body3" color="text.secondary" textAlign="right">
        {balance}
      </Typography>
    </Stack>
  );
};
