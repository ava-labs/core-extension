import { Card } from '@/components/Card';
import { Stack } from '@avalabs/k2-alpine';
import { FC, ReactNode } from 'react';

type Props = {
  avatar: ReactNode;
  name: ReactNode;
  amount: ReactNode;
  price: ReactNode;
};

export const BridgeTokenCardLayout: FC<Props> = ({
  avatar,
  name,
  amount,
  price,
}) => {
  return (
    <Card noPadding>
      <Stack direction="row" alignItems="center" gap={1} px={1.5} py={2}>
        {avatar}
        {name}
        <Stack
          direction="column"
          alignItems="flex-end"
          marginInlineStart="auto"
        >
          {amount}
          {price}
        </Stack>
      </Stack>
    </Card>
  );
};
