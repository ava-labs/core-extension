import { Typography, VerticalFlex } from '@avalabs/react-components';

export function CollectibleListEmpty() {
  return (
    <VerticalFlex align="center" grow="1" justify="center">
      <Typography size={18} height="22px" weight={600}>
        No Collectibles
      </Typography>
      <Typography size={14} align="center" height="17px" margin="8px 0">
        You don’t have any collectibles yet.
      </Typography>
    </VerticalFlex>
  );
}
