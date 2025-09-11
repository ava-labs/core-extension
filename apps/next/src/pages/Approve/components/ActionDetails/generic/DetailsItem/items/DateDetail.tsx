import { format } from 'date-fns';
import { Typography } from '@avalabs/k2-alpine';
import { DateItem } from '@avalabs/vm-module-types';

import { TxDetailsRow } from './DetailRow';

type DateItemProps = {
  item: DateItem;
};

const DATE_FORMAT = 'MMM dd, yyyy, HH:mm a';

export const DateDetail = ({ item }: DateItemProps) => (
  <TxDetailsRow label={item.label} direction="row" alignItems="center">
    <Typography variant="body3" color="text.secondary" textAlign="end">
      {format(new Date(parseInt(item.value) * 1000), DATE_FORMAT)}
    </Typography>
  </TxDetailsRow>
);
