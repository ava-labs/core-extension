import { ListItemText, ListItemTextProps } from '@avalabs/k2-alpine';
import { FC } from 'react';

const listItemSlotProps: ListItemTextProps['slotProps'] = {
  primary: {
    variant: 'body3',
  },
  secondary: {
    variant: 'caption',
    textAlign: 'end',
  },
};

export const ListItemBody3Text: FC<ListItemTextProps> = (props) => {
  return <ListItemText slotProps={listItemSlotProps} {...props} />;
};
