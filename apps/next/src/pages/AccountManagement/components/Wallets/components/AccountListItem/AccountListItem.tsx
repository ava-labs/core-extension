import {
  Button,
  ListItem,
  ListItemIcon,
  ListItemText,
  PopoverPosition,
  Tooltip,
  Typography,
  truncateAddress,
} from '@avalabs/k2-alpine';
import { Account, AccountType } from '@core/types';
import { FC, MouseEventHandler, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MdCheck } from 'react-icons/md';
import { useHistory } from 'react-router-dom';
import { AccountContextMenu } from '../AccountContextMenu';
import * as Styled from '../Styled';
import { AccountBalance } from './components/AccountBalance';

interface Props {
  account: Account;
  selected: boolean;
  onSelect: (account: Account['id']) => void;
}

export const AccountListItem: FC<Props> = ({ account, selected, onSelect }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const [isHovered, setIsHovered] = useState(false);
  const [position, setPosition] = useState<PopoverPosition | undefined>(
    undefined,
  );
  const navigateToAccount: MouseEventHandler = (event) => {
    event.preventDefault();
    event.stopPropagation();
    history.push({
      pathname: '/account-management/account',
      search: new URLSearchParams({
        accountId: account.id,
        walletId: account.type === AccountType.PRIMARY ? account.walletId : '',
      }).toString(),
    });
  };

  return (
    <ListItem disablePadding>
      <Styled.ListItemButton
        selected={selected}
        onClick={() => onSelect(account.id)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onContextMenu={(e) => {
          e.preventDefault();
          setPosition({ top: e.clientY, left: e.clientX });
        }}
      >
        <ListItemIcon sx={{ minWidth: 'unset ' }}>
          <MdCheck
            size={24}
            color={selected ? 'currentColor' : 'transparent'}
          />
        </ListItemIcon>
        <ListItemText
          primary={<Typography variant="subtitle1">{account.name}</Typography>}
          secondary={
            <Tooltip title={account.addressC} enterDelay={1000}>
              <Typography
                fontFamily=""
                variant="caption"
                color="text.secondary"
                component="span"
              >
                {truncateAddress(account.addressC)}
              </Typography>
            </Tooltip>
          }
        />
        <ListItemText
          sx={{ flexGrow: 0 }}
          className="secondary-text"
          primary={
            <>
              {isHovered ? (
                <Button
                  size="small"
                  color="secondary"
                  variant="contained"
                  onClick={navigateToAccount}
                >
                  {t('Options')}
                </Button>
              ) : (
                <AccountBalance account={account} selected={selected} />
              )}
            </>
          }
        />
      </Styled.ListItemButton>
      <AccountContextMenu
        account={account}
        position={position}
        onClose={() => setPosition(undefined)}
      />
    </ListItem>
  );
};
