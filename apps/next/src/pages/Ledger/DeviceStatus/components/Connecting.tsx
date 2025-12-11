import { ListItem, Skeleton } from '@avalabs/k2-alpine';

export const Connecting = () => {
  return (
    <>
      <ListItem divider disableGutters>
        <Skeleton variant="text" width="100%" height={24} />
      </ListItem>
      <ListItem disableGutters>
        <Skeleton variant="text" width="100%" height={24} />
      </ListItem>
    </>
  );
};
