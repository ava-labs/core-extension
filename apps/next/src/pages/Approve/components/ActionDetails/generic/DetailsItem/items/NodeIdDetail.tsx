import { Typography } from '@avalabs/k2-alpine';
import { NodeIDItem } from '@avalabs/vm-module-types';

import { TxDetailsRow } from './DetailRow';

type NodeIdItemProps = {
  item: NodeIDItem;
};

export const NodeIdDetail = ({ item }: NodeIdItemProps) => (
  <TxDetailsRow label={item.label} direction="row" alignItems="center">
    <Typography
      variant="mono"
      color="text.secondary"
      textAlign="end"
      maxWidth="60%"
      sx={{ wordBreak: 'break-all' }}
    >
      {item.value}
    </Typography>
  </TxDetailsRow>
);
