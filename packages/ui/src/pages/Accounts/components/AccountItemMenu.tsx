import {
	ClickAwayListener,
	Grow,
	IconButton,
	ListItemText,
	MenuItem,
	MenuList,
	MoreVerticalIcon,
	Popper,
	Tooltip,
} from '@avalabs/core-k2-components';
import { RefObject, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import { Account, SecretType } from '@core/types';

import { usePrivateKeyExport } from '../hooks/usePrivateKeyExport';
import { useAccountManager } from '../providers/AccountManagerProvider';

type AccountItemMenuProps = {
  account: Account;
  isActive: boolean;
  activateAccount(): Promise<void>;
  promptRename(): void;
  handleRemove(): void;
  walletType?: SecretType;
  menuAnchor: RefObject<HTMLElement | null>;
};

export const AccountItemMenu = ({
  account,
  activateAccount,
  promptRename,
  handleRemove,
  isActive,
  walletType,
  menuAnchor,
}: AccountItemMenuProps) => {
  const { isAccountSelectable } = useAccountManager();
  const { t } = useTranslation();
  const history = useHistory();

  const [isOpen, setIsOpen] = useState(false);
  const { isPrivateKeyAvailable, showPrivateKey } = usePrivateKeyExport(
    account,
    walletType,
  );
  const isDeletable = isAccountSelectable(account);

  const goToDetails = useCallback(
    (e: Event) => {
      e.stopPropagation();
      history.push(`/accounts/${account.id}`);
    },
    [history, account.id],
  );

  return (
    <ClickAwayListener
      mouseEvent="onMouseDown"
      onClickAway={() => setIsOpen(false)}
    >
      <IconButton
        sx={{ p: 0, mr: -0.5 }}
        data-testid={`${isActive ? 'active' : 'inactive'}-account-item-menu`}
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen((open) => !open);
        }}
      >
        <MoreVerticalIcon size={24} />

        <Popper
          open={isOpen}
          anchorEl={menuAnchor.current}
          placement="bottom"
          transition
        >
          {({ TransitionProps }) => (
            <Grow {...TransitionProps} timeout={250}>
              <MenuList
                sx={{
                  m: 1,
                  p: 0,
                  minWidth: 270,
                  overflow: 'hidden',
                  backgroundColor: 'grey.800',
                  color: 'text.primary',
                  border: '1px solid rgba(255,255,255,0.05)',
                }}
              >
                <MenuItem
                  onClick={goToDetails}
                  data-testid="show-account-details-button"
                  sx={{ minHeight: '40px' }}
                >
                  <ListItemText>{t('View Details')}</ListItemText>
                </MenuItem>
                {!isActive && (
                  <MenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      activateAccount();
                    }}
                    data-testid="activate-account-button"
                    sx={{
                      borderTop: '1px solid rgba(255,255,255,0.1)',
                      minHeight: '40px',
                    }}
                  >
                    <ListItemText>{t('Select this wallet')}</ListItemText>
                  </MenuItem>
                )}
                {isPrivateKeyAvailable && (
                  <MenuItem
                    onClick={showPrivateKey}
                    data-testid="export-private-key-button"
                    sx={{
                      borderTop: '1px solid rgba(255,255,255,0.1)',
                      minHeight: '40px',
                    }}
                  >
                    <ListItemText>{t('Show private key')}</ListItemText>
                  </MenuItem>
                )}
                <MenuItem
                  onClick={promptRename}
                  data-testid="export-private-key-button"
                  sx={{
                    borderTop: '1px solid rgba(255,255,255,0.1)',
                    minHeight: '40px',
                  }}
                >
                  <ListItemText>{t('Edit name')}</ListItemText>
                </MenuItem>
                <Tooltip
                  sx={{ width: 1 }}
                  disableInteractive
                  title={
                    isDeletable
                      ? ''
                      : t('Only the last account of the wallet can be removed')
                  }
                >
                  <MenuItem
                    disabled={!isDeletable}
                    onClick={handleRemove}
                    data-testid="remove-account-button"
                    sx={{
                      width: 1,
                      borderTop: '5px solid rgba(255,255,255,0.1)',
                      minHeight: '40px',
                    }}
                  >
                    <ListItemText sx={{ color: 'error.main' }}>
                      {t('Remove Account')}
                    </ListItemText>
                  </MenuItem>
                </Tooltip>
              </MenuList>
            </Grow>
          )}
        </Popper>
      </IconButton>
    </ClickAwayListener>
  );
};
