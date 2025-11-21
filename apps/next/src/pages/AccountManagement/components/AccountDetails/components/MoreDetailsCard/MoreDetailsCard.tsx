import { isPrivateKeyRevealable } from '@/pages/AccountManagement/utils/isPrivateKeyRevealable';
import {
  Box,
  ChevronRightIcon,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@avalabs/k2-alpine';
import { SecretType } from '@core/types';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import * as Styled from '../../../Styled';
import { textProps } from './config';
import { getSecretTypeDisplayName } from './utils';

type Props = {
  walletName: string;
  walletType: SecretType;
};

export const MoreDetailsCard: FC<Props> = ({ walletName, walletType }) => {
  const { t } = useTranslation();
  const {
    push,
    location: { search },
  } = useHistory();

  return (
    <Styled.Card sx={{ paddingBlock: 0 }}>
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
              sx={{ paddingBlock: 0.75 }}
              disabled={!isPrivateKeyRevealable(walletType)}
              onClick={() => {
                push({
                  pathname: '/account-management/show-private-key',
                  search,
                });
              }}
            >
              <ListItemText primary={t('Show private key')} {...textProps} />
              <ListItemText
                secondary={
                  <Box
                    component="span"
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      verticalAlign: 'middle',
                    }}
                  >
                    <ChevronRightIcon size={22} />
                  </Box>
                }
                {...textProps}
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Styled.CardContent>
    </Styled.Card>
  );
};
