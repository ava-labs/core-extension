import {
  Button,
  ButtonGroup,
  ChevronDownIcon,
  ClickAwayListener,
  Grow,
  KeyIcon,
  PlusIcon,
  Popper,
  Stack,
  styled,
} from '@avalabs/k2-components';
import { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import { AccountsTab } from '../Accounts';

type AccountsActionButtonProps = {
  disabled?: boolean;
  mode: AccountsTab;
  onAddNewAccount: () => void;
};

/**
 * The styles below look weird, but they're to make sure
 * that whatever is rendered under the button is not visible,
 * since the button itself is semi-transparent.
 *
 * I didn't want to override the colors for the button,
 * so I'm adding a pseudo element just under it, with the
 * same background color as the background of the entire page.
 *
 * This issue also has an open discussion on the K2 Slack channel.
 **/
const OpaqueButton = styled(Button)`
  overflow: hidden;
  gap: ${({ theme }) => theme.spacing(1)};
  
  ::before {
    content: '';
    position: absolute;
    inset: 0;
    background-color: ${({ theme }) => theme.palette.background.paper};
    z-index: -1;
  }
}`;

const CreateAccountButtonContent = () => {
  const { t } = useTranslation();

  return (
    <>
      <PlusIcon size={24} />
      {t('Create Account')}
    </>
  );
};

const ImportKeyButtonContent = () => {
  const { t } = useTranslation();

  return (
    <>
      <KeyIcon size={24} />
      {t('Import Private Key')}
    </>
  );
};

export const AccountsActionButton = ({
  disabled,
  mode,
  onAddNewAccount,
}: AccountsActionButtonProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const history = useHistory();
  const toggleButtonRef = useRef();
  const isInImportedAccountsMode = mode === AccountsTab.Imported;

  const goToImportScreen = useCallback(
    () => history.push('/import-private-key'),
    [history]
  );

  const handleMainButtonClick = useCallback(() => {
    if (isInImportedAccountsMode) {
      goToImportScreen();
    } else {
      onAddNewAccount();
    }
  }, [isInImportedAccountsMode, onAddNewAccount, goToImportScreen]);

  const handleSecondaryButtonClick = useCallback(() => {
    // When in imported accounts list, the secondary key adds new main account.
    if (isInImportedAccountsMode) {
      onAddNewAccount();
    } else {
      goToImportScreen();
    }
  }, [isInImportedAccountsMode, onAddNewAccount, goToImportScreen]);

  return (
    <ButtonGroup
      disabled={disabled}
      color="primary"
      size="large"
      variant="contained"
      fullWidth
    >
      <Button onClick={handleMainButtonClick} sx={{ gap: 1 }}>
        {isInImportedAccountsMode ? (
          <ImportKeyButtonContent />
        ) : (
          <CreateAccountButtonContent />
        )}
      </Button>
      <ClickAwayListener onClickAway={() => setIsMenuOpen(false)}>
        <Button
          ref={toggleButtonRef}
          onClick={() => setIsMenuOpen((open) => !open)}
          sx={{ width: '56px' }}
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
                <Stack sx={{ mb: 2 }}>
                  <OpaqueButton
                    size="large"
                    color="secondary"
                    onClick={handleSecondaryButtonClick}
                  >
                    {isInImportedAccountsMode ? (
                      <CreateAccountButtonContent />
                    ) : (
                      <ImportKeyButtonContent />
                    )}
                  </OpaqueButton>
                </Stack>
              </Grow>
            )}
          </Popper>
        </Button>
      </ClickAwayListener>
    </ButtonGroup>
  );
};
