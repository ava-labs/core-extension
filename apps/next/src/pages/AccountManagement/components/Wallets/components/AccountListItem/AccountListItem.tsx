import { URL_SEARCH_TOKENS } from '@/pages/AccountManagement/utils/searchParams';
import {
  Button,
  ListItem,
  ListItemIcon,
  ListItemText,
  PopoverPosition,
  Tooltip,
} from '@avalabs/k2-alpine';
import { Account, AccountType, SecretType } from '@core/types';
import { isPrimaryAccount } from '@core/common';
import {
  useAccountManager,
  useAnalyticsContext,
  useWalletContext,
} from '@core/ui';
import { DOMAttributes, FC, MouseEventHandler, useMemo, useState } from 'react';
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
  const { getWallet } = useWalletContext();
  const [isHovered, setIsHovered] = useState(false);
  const { capture } = useAnalyticsContext();
  const [position, setPosition] = useState<PopoverPosition | undefined>(
    undefined,
  );

  const isSelectable = isAccountSelectable(account);

  const nonSelectableHint = useMemo(() => {
    if (isSelectable) {
      return '';
    }

    // Check if it's a seedless account
    if (isPrimaryAccount(account)) {
      const wallet = getWallet(account.walletId);
      if (wallet?.type === SecretType.Seedless) {
        return t('You cannot delete a seedless account.');
      }
    }

    // Check if it's the last account
    if (account.type === AccountType.PRIMARY && account.index === 0) {
      return t('Removing the last account is not possible.');
    }

    return t(
      'To remove this account, you must also remove all accounts that follow.',
    );
  }, [isSelectable, account, getWallet, t]);
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
        onClick: () => {
          onSelect(account.id);
          capture('AccountSwitched', {
            type: account.type,
          });
          history.push('/portfolio');
        },
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
    <ListItem disablePadding className="account-item">
      <Tooltip title={isManageMode ? nonSelectableHint : ''}>
        <span style={{ width: '100%' }}>
          <Styled.ListItemButton
            disabled={isManageMode && !isSelectable}
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
                  fontWeight={active ? 600 : 400}
                  marginLeft="6px"
                >
                  {account.name}
                </RenamableTitle>
              }
            />
            <ListItemText
              className="secondary-text"
              primary={
                <>
                  {isHovered ? (
                    <Button
                      sx={{
                        position: 'absolute',
                        right: (theme) => theme.spacing(1.5),
                        top: '50%',
                        transform: 'translateY(-50%)',
                      }}
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
        </span>
      </Tooltip>
      <AccountContextMenu
        account={account}
        position={position}
        onClose={() => setPosition(undefined)}
      />
    </ListItem>
  );
};
