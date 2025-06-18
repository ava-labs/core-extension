import {
  ChevronRightIcon,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  toast,
} from '@avalabs/k2-alpine';
import { SecretType } from '@core/types';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import * as Styled from '../../../Styled';
import { textProps } from './config';
import { getSecretTypeDisplayName } from './utils';

type Props = {
  walletName: string;
  walletType: SecretType;
};

export const MoreDetailsCard: FC<Props> = ({ walletName, walletType }) => {
  const { t } = useTranslation();

  return (
    <Styled.Card>
      <Styled.CardContent>
        <List disablePadding>
          <ListItem>
            <ListItemText primary={t('Type')} {...textProps} />
            <ListItemText
              secondary={getSecretTypeDisplayName(walletType, t)}
              {...textProps}
            />
          </ListItem>
          <Styled.Divider variant="middle" component="li" />
          <ListItem>
            <ListItemText primary={t('Wallet')} {...textProps} />
            <ListItemText secondary={walletName} {...textProps} />
          </ListItem>
          <Styled.Divider variant="middle" component="li" />
          <ListItem disablePadding>
            <ListItemButton
              sx={{ paddingBlock: 0.5 }}
              onClick={() => {
                toast.info('Under construction', {
                  id: 'show-private-key',
                });
              }}
            >
              <ListItemText primary={t('Show private key')} {...textProps} />
              <ListItemText
                secondary={<ChevronRightIcon size={20} />}
                {...textProps}
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Styled.CardContent>
    </Styled.Card>
  );
};
