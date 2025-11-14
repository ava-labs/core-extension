import { URL_SEARCH_TOKENS } from '@/pages/AccountManagement/utils/searchParams';
import {
  Button,
  ListItem,
  ListItemIcon,
  ListItemText,
  PopoverPosition,
  Tooltip,
  truncateAddress,
  Typography,
} from '@avalabs/k2-alpine';
import { Account } from '@core/types';
import { useAccountManager } from '@core/ui';
import { DOMAttributes, FC, MouseEventHandler, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { RenamableTitle } from '../../../RenamableTitle';
import { AccountContextMenu } from '../AccountContextMenu';
import * as Styled from '../Styled';
import { AccountBalance } from './components/AccountBalance';
import { AccountListCheckbox } from './components/AccountListCheckbox';

interface Props {
  account: Account;
  active: boolean;
  onSelect: (account: Account['id']) => void;
}

export const AccountListItem: FC<Props> = ({ account, active, onSelect }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const {
    isManageMode,
    isAccountSelectable,
    selectAccount,
    deselectAccount,
    selectedAccounts,
  } = useAccountManager();
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
        [URL_SEARCH_TOKENS.account]: account.id,
      }).toString(),
    });
  };

  const domEventHandlers: DOMAttributes<HTMLElement> = isManageMode
    ? {
        onClick: (e) => {
          e.preventDefault();
          const checked = selectedAccounts.includes(account.id);
          const action = checked ? deselectAccount : selectAccount;
          action(account.id, true);
        },
      }
    : {
        onClick: () => onSelect(account.id),
        onMouseEnter: () => setIsHovered(true),
        onMouseLeave: () => setIsHovered(false),
        onContextMenu: (e) => {
          e.preventDefault();
          setPosition({ top: e.clientY, left: e.clientX });
        },
      };

  const handleRename: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.preventDefault();
    event.stopPropagation();
    history.push({
      pathname: '/account-management/rename',
      search: new URLSearchParams({
        [URL_SEARCH_TOKENS.account]: account.id,
      }).toString(),
    });
  };

  return (
    <ListItem disablePadding>
      <Styled.ListItemButton
        disabled={isManageMode && !isAccountSelectable(account)}
        selected={!isManageMode && active}
        {...domEventHandlers}
      >
        <ListItemIcon sx={{ minWidth: 'unset ' }}>
          <AccountListCheckbox account={account} active={active} />
        </ListItemIcon>
        <ListItemText
          primary={
            <RenamableTitle
              onRename={handleRename}
              variant="subtitle3"
              component="span"
            >
              {account.name}
            </RenamableTitle>
          }
          secondary={
            <Tooltip title={account.addressC} enterDelay={1000}>
              <Typography
                variant="mono2"
                color="text.secondary"
                component="span"
              >
                {truncateAddress(account.addressC)}
              </Typography>
            </Tooltip>
          }
        />
        <ListItemText
          className="secondary-text"
          primary={
            <>
              {isHovered ? (
                <Button
                  size="xsmall"
                  color="secondary"
                  variant="contained"
                  onClick={navigateToAccount}
                >
                  {t('Options')}
                </Button>
              ) : (
                <AccountBalance account={account} selected={active} />
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
