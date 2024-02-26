import {
  CheckIcon,
  ChevronRightIcon,
  ClickAwayListener,
  ConfigureIcon,
  Grow,
  IconButton,
  KeyIcon,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  MoreHorizontalIcon,
  Popper,
} from '@avalabs/k2-components';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MouseEvent, useCallback, useRef, useState } from 'react';

import { Account } from '@src/background/services/accounts/models';

import { usePrivateKeyExport } from '../hooks/usePrivateKeyExport';
import { SecretType } from '@src/background/services/secrets/models';

type AccountItemMenuProps = {
  account: Account;
  isActive: boolean;
  activateAccount(e: MouseEvent<HTMLElement>): void;
  walletType?: SecretType;
};

export const AccountItemMenu = ({
  account,
  activateAccount,
  isActive,
  walletType,
}: AccountItemMenuProps) => {
  const { t } = useTranslation();
  const history = useHistory();

  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLButtonElement>(null);
  const { isPrivateKeyAvailable, showPrivateKey } = usePrivateKeyExport(
    account,
    walletType
  );

  const goToDetails = useCallback(
    (e: Event) => {
      e.stopPropagation();
      history.push(`/accounts/${account.id}`);
    },
    [history, account.id]
  );

  return (
    <ClickAwayListener
      mouseEvent="onMouseDown"
      onClickAway={() => setIsOpen(false)}
    >
      <IconButton
        sx={{ p: 0 }}
        ref={ref}
        data-testid={`${isActive ? 'active' : 'inactive'}-account-item-menu`}
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen((open) => !open);
        }}
      >
        {isActive ? (
          <ChevronRightIcon size={20} />
        ) : (
          <MoreHorizontalIcon size={24} />
        )}

        <Popper
          open={isOpen}
          anchorEl={ref.current}
          placement="bottom-end"
          transition
        >
          {({ TransitionProps }) => (
            <Grow {...TransitionProps} timeout={250}>
              <MenuList
                dense
                sx={{
                  p: 0,
                  mb: 1,
                  overflow: 'hidden',
                  backgroundColor: 'grey.850',
                  color: 'text.secondary',
                }}
              >
                <MenuItem
                  onClick={goToDetails}
                  data-testid="show-account-details-button"
                >
                  <ListItemIcon sx={{ color: 'inherit' }}>
                    <ConfigureIcon />
                  </ListItemIcon>
                  <ListItemText>{t('View Details')}</ListItemText>
                </MenuItem>
                {!isActive && (
                  <MenuItem
                    onClick={activateAccount}
                    data-testid="activate-account-button"
                  >
                    <ListItemIcon sx={{ color: 'inherit' }}>
                      <CheckIcon />
                    </ListItemIcon>
                    <ListItemText>{t('Select Account')}</ListItemText>
                  </MenuItem>
                )}
                {isPrivateKeyAvailable && (
                  <MenuItem
                    onClick={showPrivateKey}
                    data-testid="export-private-key-button"
                  >
                    <ListItemIcon sx={{ color: 'inherit' }}>
                      <KeyIcon />
                    </ListItemIcon>
                    <ListItemText>{t('Show Private Key')}</ListItemText>
                  </MenuItem>
                )}
              </MenuList>
            </Grow>
          )}
        </Popper>
      </IconButton>
    </ClickAwayListener>
  );
};
