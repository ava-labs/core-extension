import { ListItem, Skeleton } from '@avalabs/k2-alpine';
import { FC } from 'react';

export const Connecting: FC = () => (
  <>
    <ListItem divider disableGutters>
      <Skeleton variant="text" width="100%" height={24} />
    </ListItem>
    <ListItem disableGutters>
      <Skeleton variant="text" width="100%" height={24} />
    </ListItem>
  </>
);
