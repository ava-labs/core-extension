import { ListItem } from '@avalabs/k2-alpine';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { ListItemBody3Text } from './ListItemBody3Text';

export const IncorrectDeviceConnected: FC = () => {
  const { t } = useTranslation();
  return (
    <>
      <ListItem disableGutters>
        <ListItemBody3Text
          primary={t(
            'This Ledger was not used to create this wallet. Please connect the original Ledger device to continue.',
          )}
        />
      </ListItem>
    </>
  );
};
