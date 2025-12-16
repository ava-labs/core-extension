import { ListItem, ListItemText, ListItemTextProps } from '@avalabs/k2-alpine';

import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { ListItemBody3Text } from './ListItemBody3Text';
import { OrderedListItem } from './OrderedListItem';

const listItemSlotProps: ListItemTextProps['slotProps'] = {
  primary: {
    variant: 'body1',
  },
};

export const Disconnected: FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <ListItem disableGutters sx={{ pb: 0 }}>
        <ListItemBody3Text primary={t('To connect')} />
      </ListItem>
      <OrderedListItem divider disableGutters>
        <ListItemText
          slotProps={listItemSlotProps}
          primary={t('Connect the Ledger device to your computer.')}
        />
      </OrderedListItem>
      <OrderedListItem divider disableGutters>
        <ListItemText
          primary={t('Enter your PIN')}
          slotProps={listItemSlotProps}
        />
      </OrderedListItem>
      <OrderedListItem disableGutters>
        <ListItemText
          slotProps={listItemSlotProps}
          primary={t(
            'Ensure you have installed the latest Avalanche app and open it on your device',
          )}
        />
      </OrderedListItem>
    </>
  );
};
