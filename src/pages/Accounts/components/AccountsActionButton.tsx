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
  FireblocksIcon,
  Tooltip,
  ListIcon,
  Typography,
  TypographyProps,
  PlusIcon,
} from '@avalabs/core-k2-components';
import { useCallback, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import browser from 'webextension-polyfill';

import { useFeatureFlagContext } from '@src/contexts/FeatureFlagsProvider';
import { FeatureGates } from '@src/background/services/featureFlags/models';
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import { isProductionBuild } from '@src/utils/environment';
import { ChainId } from '@avalabs/core-chains-sdk';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';

type AccountsActionButtonProps = {
  isLoading: boolean;
  canCreateAccount: boolean;
  onAddNewAccount: () => void;
  createAccountTooltip?: string;
};

const StyledMenuItem = styled(MenuItem)`
  color: ${({ theme }) => theme.palette.text.secondary};
  &:hover {
    color: ${({ theme }) => theme.palette.text.primary};
  }
`;

const RoundedButtonGroup = styled(ButtonGroup)`
  & > .MuiButtonGroup-grouped {
    border-radius: 0;
    height: 40px;

    &:not(:last-of-type) {
      margin-right: 1px;

      &.Mui-disabled {
        margin-right: 1px;
      }
    }

    &:first-of-type {
      border-radius: 24px 0 0 24px;
    }

    &:last-of-type {
      border-radius: 0 24px 24px 0;
    }
  }
`;

const MenuSubheader = (props: TypographyProps) => (
  <Typography
    variant="caption"
    component="li"
    sx={{ px: 2, pt: 1, pb: 0.5, cursor: 'default' }}
    color="text.secondary"
    {...props}
  />
);

const WALLET_IMPORT_FLAGS = [
  FeatureGates.ADD_WALLET_WITH_SEEDPHRASE,
  FeatureGates.ADD_WALLET_WITH_KEYSTORE_FILE,
];

export const AccountsActionButton = ({
  isLoading,
  onAddNewAccount,
  createAccountTooltip,
  canCreateAccount,
}: AccountsActionButtonProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const history = useHistory();
  const toggleButtonRef = useRef();
  const { t } = useTranslation();
  const { featureFlags } = useFeatureFlagContext();
  const { capture } = useAnalyticsContext();
  const { network } = useNetworkContext();

  const goToImportScreen = useCallback(() => {
    capture('ImportPrivateKey_Clicked');
    history.push('/import-private-key');
  }, [history, capture]);

  const goToAddSeedphraseScreen = useCallback(() => {
    capture('AddWalletWithSeedphrase_Clicked');
    history.push('/accounts/add-wallet/seedphrase');
  }, [history, capture]);

  const goToAddKeystoreFileScreen = useCallback(() => {
    capture('AddWalletWithKeystoreFile_Clicked');
    history.push('/accounts/add-wallet/keystore');
  }, [history, capture]);

  const goToAddLedgerScreen = useCallback(() => {
    capture('AddWalletWithLedger_Clicked');

    // Open in a full screen tab to avoid popup hell
    browser.tabs.create({
      url: `/fullscreen.html#/accounts/add-wallet/ledger`,
    });
  }, [capture]);

  const goToWalletConnectScreen = useCallback(() => {
    capture('ImportWithWalletConnect_Clicked');
    history.push('/import-with-walletconnect');
  }, [history, capture]);

  const goToFireblocksWalletConnectScreen = useCallback(() => {
    capture('ImportWithFireblocks_Clicked');
    history.push('/fireblocks/import-with-walletconnect');
  }, [history, capture]);

  const fireblocksDisabledReason = useMemo(() => {
    if (
      isProductionBuild() &&
      network?.chainId !== ChainId.AVALANCHE_MAINNET_ID
    ) {
      return t(
        'Please switch to Avalanche C-Chain to import your Fireblocks account.'
      );
    }

    return '';
  }, [t, network]);

  const isAnyWalletImportAvailable = WALLET_IMPORT_FLAGS.some(
    (flag) => featureFlags[flag]
  );

  return (
    <RoundedButtonGroup
      disabled={isLoading}
      color="primary"
      variant="contained"
      fullWidth
    >
      <Tooltip
        title={createAccountTooltip}
        sx={{
          display: 'flex',
          width: '100%',
        }}
      >
        <Button
          onClick={onAddNewAccount}
          data-testid={'add-primary-account'}
          isLoading={isLoading}
          disabled={isLoading || !canCreateAccount}
          startIcon={<PlusIcon size={24} />}
        >
          {t('Add Account')}
        </Button>
      </Tooltip>

      <ClickAwayListener onClickAway={() => setIsMenuOpen(false)}>
        <Button
          ref={toggleButtonRef}
          onClick={() => setIsMenuOpen((open) => !open)}
          sx={{
            width: '56px',
          }}
          data-testid="account-options"
        >
          <ChevronDownIcon
            size={20}
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
                <MenuList
                  dense
                  sx={{
                    p: 0,
                    py: 0.5,
                    mb: 1,
                    overflow: 'hidden',
                    backgroundColor: 'grey.800',
                  }}
                >
                  <MenuSubheader>{t('Import Account')}</MenuSubheader>
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
                  {featureFlags[FeatureGates.IMPORT_FIREBLOCKS] && (
                    <Tooltip
                      title={fireblocksDisabledReason}
                      sx={{
                        cursor: fireblocksDisabledReason
                          ? 'not-allowed'
                          : 'pointer',
                      }}
                    >
                      <StyledMenuItem
                        data-testid="import-wallet-connect"
                        onClick={goToFireblocksWalletConnectScreen}
                        disabled={Boolean(fireblocksDisabledReason)}
                      >
                        <FireblocksIcon size={16} sx={{ pr: 1 }} />
                        {t('Import with Fireblocks')}
                      </StyledMenuItem>
                    </Tooltip>
                  )}

                  {isAnyWalletImportAvailable && (
                    <MenuSubheader>{t('Add Wallet')}</MenuSubheader>
                  )}
                  {featureFlags[FeatureGates.ADD_WALLET_WITH_SEEDPHRASE] && (
                    <StyledMenuItem
                      onClick={goToAddSeedphraseScreen}
                      data-testid="add-wallet-seed-phrase"
                    >
                      <ListIcon size={16} sx={{ pr: 1 }} />
                      {t('Add Wallet with Recovery Phrase')}
                    </StyledMenuItem>
                  )}
                  {featureFlags[FeatureGates.ADD_WALLET_WITH_KEYSTORE_FILE] && (
                    <StyledMenuItem
                      onClick={goToAddKeystoreFileScreen}
                      data-testid="add-wallet-keystore-file"
                    >
                      <ListIcon size={16} sx={{ pr: 1 }} />
                      {t('Add Wallet with Keystore File')}
                    </StyledMenuItem>
                  )}
                  {featureFlags[FeatureGates.ADD_WALLET_WITH_LEDGER] && (
                    <StyledMenuItem
                      onClick={goToAddLedgerScreen}
                      data-testid="add-wallet-ledger"
                    >
                      <ListIcon size={16} sx={{ pr: 1 }} />
                      {t('Add Wallet with Ledger')}
                    </StyledMenuItem>
                  )}
                </MenuList>
              </Grow>
            )}
          </Popper>
        </Button>
      </ClickAwayListener>
    </RoundedButtonGroup>
  );
};
