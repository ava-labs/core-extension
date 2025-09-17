import {
  Button,
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
  LedgerIcon,
  KeystoreIcon,
  Box,
  ChevronRightIcon,
  Stack,
  PlusIcon,
} from '@avalabs/core-k2-components';
import { useCallback, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import browser from 'webextension-polyfill';

import { useFeatureFlagContext } from '@core/ui';
import { FeatureGates } from '@core/types';
import { useNetworkContext } from '@core/ui';
import { isProductionBuild } from '@core/common';
import { ChainId } from '@avalabs/core-chains-sdk';
import { useAnalyticsContext } from '@core/ui';
import { LedgerAppType, useLedgerContext } from '@core/ui';
import { useWalletContext } from '@core/ui';

type AccountsActionButtonProps = {
  isLoading: boolean;
  canCreateAccount: boolean;
  onAddNewAccount: () => void;
};

const MenuItemColumn = styled(Stack)`
  flex-direction: row;
  align-items: center;
  width: 100%;
  justify-content: space-between;
  border-bottom: 1px solid
    ${({ theme, hasNoBorder }) =>
      hasNoBorder ? 'transparent' : theme.palette.grey[800]};
  padding-top: ${({ theme }) => theme.spacing(1.5)};
  padding-bottom: ${({ theme }) => theme.spacing(1.5)};
`;

const StyledMenuItem = styled(MenuItem)`
  cursor: pointer;
  padding: 0;
  width: 100%;
`;

const IconColumn = styled(Stack)`
  padding-right: ${({ theme }) => theme.spacing(2)};
  padding-left: ${({ theme }) => theme.spacing(2)};
`;

export const AccountsActionButton = ({
  isLoading,
  onAddNewAccount,
  canCreateAccount,
}: AccountsActionButtonProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { hasLedgerTransport, appType } = useLedgerContext();
  const { isLedgerWallet } = useWalletContext();
  const history = useHistory();
  const toggleButtonRef = useRef<HTMLElement | null>(null);
  const { t } = useTranslation();
  const { featureFlags } = useFeatureFlagContext();
  const { capture } = useAnalyticsContext();
  const { network } = useNetworkContext();

  const canAddNewAccount =
    !isLedgerWallet ||
    (hasLedgerTransport && appType === LedgerAppType.AVALANCHE);

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
        'Please switch to Avalanche C-Chain to import your Fireblocks account.',
      );
    }

    return '';
  }, [t, network]);

  return (
    <ClickAwayListener onClickAway={() => setIsMenuOpen(false)}>
      <Box
        sx={{
          width: '100%',
        }}
      >
        <Button
          onClick={() => setIsMenuOpen((open) => !open)}
          isLoading={isLoading}
          disabled={isLoading}
          endIcon={
            <ChevronDownIcon
              sx={{
                transition: 'transform ease-in-out .15s',
                transform: isMenuOpen ? 'rotateX(180deg)' : 'none',
              }}
            />
          }
          fullWidth
          data-testid="account-options"
          size="xlarge"
          sx={{
            fontSize: 14,
          }}
          ref={toggleButtonRef}
        >
          {t('Add Account or Connect Wallet')}
        </Button>

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
                  py: 1,
                  mb: 2,
                  overflow: 'hidden',
                  backgroundColor: 'grey.850',
                  width: '343px',
                  height: '468px',
                  boxShadow: '0px 4px 24px 0px rgba(0, 0, 0, 0.60)',
                }}
              >
                <StyledMenuItem
                  onClick={goToImportScreen}
                  data-testid="add-import-account"
                >
                  <IconColumn>
                    <KeyIcon size={24} />
                  </IconColumn>
                  <MenuItemColumn>
                    <Stack>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {t('Import Private Key')}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption">
                          {t('Import a single-chain account')}
                        </Typography>
                      </Box>
                    </Stack>
                    <IconColumn>
                      <ChevronRightIcon size={24} sx={{ color: 'grey.500' }} />
                    </IconColumn>
                  </MenuItemColumn>
                </StyledMenuItem>
                {featureFlags[FeatureGates.IMPORT_WALLET_CONNECT] && (
                  <StyledMenuItem
                    data-testid="import-wallet-connect"
                    onClick={goToWalletConnectScreen}
                  >
                    <IconColumn>
                      <WalletConnectIcon size={24} />
                    </IconColumn>
                    <MenuItemColumn>
                      <Stack>
                        <Box>
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 'bold' }}
                          >
                            {t('Connect using Wallet Connect')}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption">
                            {t('Import account with Wallet Connect')}
                          </Typography>
                        </Box>
                      </Stack>
                      <IconColumn>
                        <ChevronRightIcon
                          size={24}
                          sx={{ color: 'grey.500' }}
                        />
                      </IconColumn>
                    </MenuItemColumn>
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
                      <IconColumn>
                        <FireblocksIcon size={24} />
                      </IconColumn>
                      <MenuItemColumn>
                        <Stack>
                          <Box>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 'bold' }}
                            >
                              {t('Import Fireblocks Account')}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption">
                              {t('Use Fireblocks application')}
                            </Typography>
                          </Box>
                        </Stack>
                        <IconColumn>
                          <ChevronRightIcon
                            size={24}
                            sx={{ color: 'grey.500' }}
                          />
                        </IconColumn>
                      </MenuItemColumn>
                    </StyledMenuItem>
                  </Tooltip>
                )}

                {featureFlags[FeatureGates.ADD_WALLET_WITH_SEEDPHRASE] && (
                  <StyledMenuItem
                    onClick={goToAddSeedphraseScreen}
                    data-testid="add-wallet-seed-phrase"
                  >
                    <IconColumn>
                      <ListIcon size={24} />
                    </IconColumn>
                    <MenuItemColumn>
                      <Stack>
                        <Box>
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 'bold' }}
                          >
                            {t('Import Recovery Phrase')}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption">
                            {t('Import accounts from another wallet')}
                          </Typography>
                        </Box>
                      </Stack>
                      <IconColumn>
                        <ChevronRightIcon
                          size={24}
                          sx={{ color: 'grey.500' }}
                        />
                      </IconColumn>
                    </MenuItemColumn>
                  </StyledMenuItem>
                )}
                {featureFlags[FeatureGates.ADD_WALLET_WITH_LEDGER] && (
                  <StyledMenuItem
                    onClick={goToAddLedgerScreen}
                    data-testid="add-wallet-ledger"
                  >
                    <IconColumn>
                      <LedgerIcon size={24} />
                    </IconColumn>
                    <MenuItemColumn>
                      <Stack>
                        <Box>
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 'bold' }}
                          >
                            {t('Import Ledger Wallet')}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption">
                            {t('Use your Ledger hardware wallet')}
                          </Typography>
                        </Box>
                      </Stack>
                      <IconColumn>
                        <ChevronRightIcon
                          size={24}
                          sx={{ color: 'grey.500' }}
                        />
                      </IconColumn>
                    </MenuItemColumn>
                  </StyledMenuItem>
                )}
                {featureFlags[FeatureGates.ADD_WALLET_WITH_KEYSTORE_FILE] && (
                  <StyledMenuItem
                    onClick={goToAddKeystoreFileScreen}
                    data-testid="add-wallet-keystore-file"
                  >
                    <IconColumn>
                      <KeystoreIcon size={24} />
                    </IconColumn>
                    <MenuItemColumn>
                      <Stack>
                        <Box>
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 'bold' }}
                          >
                            {t('Import Keystore File')}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption">
                            {t('Use a keystore from the Avalanche Wallet')}
                          </Typography>
                        </Box>
                      </Stack>
                      <IconColumn>
                        <ChevronRightIcon
                          size={24}
                          sx={{ color: 'grey.500' }}
                        />
                      </IconColumn>
                    </MenuItemColumn>
                  </StyledMenuItem>
                )}
                {canCreateAccount && (
                  <Tooltip
                    title={
                      canAddNewAccount
                        ? ''
                        : t(
                            'Connect your Ledger device and open the Avalanche app',
                          )
                    }
                  >
                    <StyledMenuItem
                      disabled={!canAddNewAccount}
                      onClick={() => {
                        onAddNewAccount();
                        setIsMenuOpen(false);
                      }}
                      data-testid={'add-primary-account'}
                    >
                      <IconColumn>
                        <PlusIcon size={24} />
                      </IconColumn>
                      <MenuItemColumn hasNoBorder>
                        <Stack>
                          <Box>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 'bold' }}
                            >
                              {t('Create New Account ')}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption">
                              {t('Add a new account to your active wallet')}
                            </Typography>
                          </Box>
                        </Stack>
                        <IconColumn>
                          <ChevronRightIcon
                            size={24}
                            sx={{ color: 'grey.500' }}
                          />
                        </IconColumn>
                      </MenuItemColumn>
                    </StyledMenuItem>
                  </Tooltip>
                )}
              </MenuList>
            </Grow>
          )}
        </Popper>
      </Box>
    </ClickAwayListener>
  );
};
