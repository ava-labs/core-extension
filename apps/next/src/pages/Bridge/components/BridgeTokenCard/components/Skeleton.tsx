import { Skeleton } from '@avalabs/k2-alpine';
import { FC } from 'react';
import { BridgeTokenCardLayout } from './Layout';

export const BridgeTokenCardSkeleton: FC = () => {
  return (
    <BridgeTokenCardLayout
      avatar={
        <Skeleton variant="circular" width={24} height={24} animation="wave" />
      }
      name={
        <Skeleton variant="text" width="10ch" height="1.5em" animation="wave" />
      }
      amount={
        <Skeleton variant="text" width="6ch" height="1.5em" animation="wave" />
      }
      price={
        <Skeleton variant="text" width="6ch" height="1em" animation="wave" />
      }
    />
  );
};
