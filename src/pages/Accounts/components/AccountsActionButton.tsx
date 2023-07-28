import {
  Button,
  ButtonGroup,
  ChevronDownIcon,
  ClickAwayListener,
  Grow,
  KeyIcon,
  MenuItem,
  MenuList,
  Popper,
  WalletConnectIcon,
  styled,
} from '@avalabs/k2-components';
import { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { FeatureGates } from '@avalabs/posthog-sdk';

import { useFeatureFlagContext } from '@src/contexts/FeatureFlagsProvider';

type AccountsActionButtonProps = {
  disabled?: boolean;
  onAddNewAccount: () => void;
};

const StyledMenuItem = styled(MenuItem)`
  color: ${({ theme }) => theme.palette.text.secondary};
  &:hover {
    color: ${({ theme }) => theme.palette.text.primary};
  }
`;

export const AccountsActionButton = ({
  disabled,
  onAddNewAccount,
}: AccountsActionButtonProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const history = useHistory();
  const toggleButtonRef = useRef();
  const { t } = useTranslation();
  const { featureFlags } = useFeatureFlagContext();

  const goToImportScreen = useCallback(
    () => history.push('/import-private-key'),
    [history]
  );

  const goToWalletConnectScreen = useCallback(
    () => history.push('/import-with-walletconnect'),
    [history]
  );

  return (
    <ButtonGroup
      disabled={disabled}
      color="primary"
      variant="contained"
      fullWidth
    >
      <Button
        onClick={onAddNewAccount}
        sx={{ gap: 1 }}
        data-testid={'add-primary-account'}
      >
        {t('Create Account')}
      </Button>
      <ClickAwayListener onClickAway={() => setIsMenuOpen(false)}>
        <Button
          ref={toggleButtonRef}
          onClick={() => setIsMenuOpen((open) => !open)}
          sx={{ width: '56px' }}
          data-testid="account-options"
        >
          <ChevronDownIcon
            size={24}
            sx={{
              transition: 'transform ease-in-out .15s',
              transform: isMenuOpen ? 'rotateX(180deg)' : 'none',
            }}
          />
          <Popper
            open={isMenuOpen}
            anchorEl={toggleButtonRef.current}
            placement="top-end"
            transition
          >
            {({ TransitionProps }) => (
              <Grow {...TransitionProps} timeout={250}>
                <MenuList dense sx={{ p: 0, mb: 1, overflow: 'hidden' }}>
                  <StyledMenuItem
                    onClick={goToImportScreen}
                    data-testid="add-import-account"
                  >
                    <KeyIcon size={16} sx={{ pr: 1 }} />
                    {t('Import Private Key')}
                  </StyledMenuItem>
                  {featureFlags[FeatureGates.IMPORT_WALLET_CONNECT] && (
                    <StyledMenuItem
                      data-testid="import-wallet-connect"
                      onClick={goToWalletConnectScreen}
                    >
                      <WalletConnectIcon size={16} sx={{ pr: 1 }} />
                      {t('Import with Wallet Connect')}
                    </StyledMenuItem>
                  )}
                </MenuList>
              </Grow>
            )}
          </Popper>
        </Button>
      </ClickAwayListener>
    </ButtonGroup>
  );
};
