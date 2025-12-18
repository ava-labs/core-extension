import { Divider } from '@avalabs/k2-alpine';

import { Stack } from '@avalabs/k2-alpine';
import { ComponentProps, FC, ReactElement } from 'react';
import { StyledCardNoPaddingY } from '../../styled';
import { BalanceLineItem } from './BalanceLineItem';
import { UtxoBanner } from './UtxoBanner';

type Props = {
  network: 'x-chain' | 'p-chain';
  children: ReactElement<ComponentProps<typeof BalanceLineItem>>[];
};

export const AssetsLayout: FC<Props> = ({ network, children }) => {
  return (
    <Stack rowGap={1}>
      <UtxoBanner network={network} />
      <StyledCardNoPaddingY>
        <Stack divider={<Divider />}>{children}</Stack>
      </StyledCardNoPaddingY>
    </Stack>
  );
};
