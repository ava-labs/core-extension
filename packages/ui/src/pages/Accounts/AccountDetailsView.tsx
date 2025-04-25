import { useHistory, useParams } from 'react-router-dom';
import { useCallback, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  AvalancheColorIcon,
  BitcoinColorIcon,
  Button,
  Card,
  CardContent,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClickAwayListener,
  Divider,
  Grow,
  IconButton,
  MenuItem,
  MenuList,
  MoreVerticalIcon,
  Popper,
  Stack,
  Tooltip,
  Typography,
  XAndPChainsIcon,
  useTheme,
} from '@avalabs/core-k2-components';

import { AccountType, FeatureGates } from '@core/types';
import { isPrimaryAccount } from '@core/utils';
import { useScopedToast } from '@/hooks/useScopedToast';
import { useWalletContext } from '@/contexts/WalletProvider';
import { useAccountsContext } from '@/contexts/AccountsProvider';
import { stripAddressPrefix } from '@core/utils';
import { useAnalyticsContext } from '@/contexts/AnalyticsProvider';
import { useFeatureFlagContext } from '@/contexts/FeatureFlagsProvider';

import { useAccountManager } from './providers/AccountManagerProvider';
import { OverflowingTypography } from './components/OverflowingTypography';
import { NoAccountsFound, Origin } from './components/NoAccountsFound';
import { AccountDetailsAddressRow } from './components/AccountDetailsAddressRow';
import { useAccountRename } from './hooks/useAccountRename';
import { useAccountRemoval } from './hooks/useAccountRemoval';
import { usePrivateKeyExport } from './hooks/usePrivateKeyExport';
import { WalletTypeIcon } from './components/WalletTypeIcon';
import { useWalletTypeName } from './hooks/useWalletTypeName';

export const AccountDetailsView = () => {
  const { t } = useTranslation();
  const toast = useScopedToast('account-switcher');
  const theme = useTheme();
  const { isAccountSelectable } = useAccountManager();
  const { accountId } = useParams<{ accountId: string }>();
  const { getAccountById } = useAccountsContext();
  const { getWallet } = useWalletContext();
  const account = getAccountById(accountId);
  const history = useHistory();
  const { capture } = useAnalyticsContext();
  const walletDetails = isPrimaryAccount(account)
    ? getWallet(account.walletId)
    : getWallet(account?.id ?? '');
  const { isPrivateKeyAvailable, showPrivateKey } = usePrivateKeyExport(
    account,
    walletDetails?.type,
  );
  const { featureFlags } = useFeatureFlagContext();
  const canPrimaryAccountsBeRemoved =
    featureFlags[FeatureGates.PRIMARY_ACCOUNT_REMOVAL];

  const onAddressCopy = useCallback(
    (addressToCopy: string, eventName: string) => () => {
      navigator.clipboard.writeText(stripAddressPrefix(addressToCopy));
      toast.success(t('Copied!'), { duration: 1000 });
      capture(eventName, { type: account?.type });
    },
    [t, account?.type, capture, toast],
  );

  const [isContextMenuOpen, setIsContextMenuOpen] = useState(false);
  const contextMenuRef = useRef<HTMLButtonElement>(null);

  const toBeRemoved = useMemo(
    () => (account?.id ? [account.id] : []),
    [account?.id],
  );
  const { prompt: promptRename, renderDialog: renameDialog } =
    useAccountRename(account);
  const { prompt: promptRemove, renderDialog: removeDialog } =
    useAccountRemoval(toBeRemoved);

  const getWalletType = useWalletTypeName(walletDetails, account);

  if (!account) {
    return <NoAccountsFound origin={Origin.Url} />;
  }

  const isDeletable =
    isAccountSelectable(account) &&
    (account.type !== AccountType.PRIMARY || canPrimaryAccountsBeRemoved);

  return (
    <Stack
      sx={{
        width: '100%',
        height: '100%',
        background: theme.palette.background.paper,
      }}
    >
      <Stack
        sx={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          pl: 0.25,
          pr: 1,
          py: 3,
        }}
      >
        <IconButton
          data-testid="account-details-back-btn"
          onClick={() => history.replace('/accounts')}
          sx={{
            padding: 0.25,
            '> svg': {
              transition: 'color .15s ease-in-out, transform .15s ease-in-out',
            },
            ':hover svg': {
              color: 'secondary.lighter',
              transform: 'translateX(-2px)',
            },
          }}
          disableRipple
        >
          <ChevronLeftIcon size={32} />
        </IconButton>
        <OverflowingTypography
          variant="h4"
          sx={{ mr: 2, fontSize: 24, flexGrow: 1 }}
          data-testid="account-details-name"
        >
          {account.name}
        </OverflowingTypography>
        <ClickAwayListener
          mouseEvent="onMouseDown"
          onClickAway={() => setIsContextMenuOpen(false)}
        >
          <IconButton
            sx={{ ml: 3 }}
            ref={contextMenuRef}
            data-testid={`account-details-edit-button`}
            onClick={(e) => {
              e.stopPropagation();
              setIsContextMenuOpen((open) => !open);
            }}
          >
            <MoreVerticalIcon size={24} />
            <Popper
              open={isContextMenuOpen}
              anchorEl={contextMenuRef.current}
              placement="bottom-end"
              transition
            >
              {({ TransitionProps }) => (
                <Grow {...TransitionProps} timeout={250}>
                  <MenuList
                    sx={{
                      p: 0,
                      mb: 1,
                      minWidth: 180,
                      overflow: 'hidden',
                      backgroundColor: 'grey.850',
                      color: 'text.primary',
                      border: '1px solid rgba(255,255,255,0.05)',
                    }}
                  >
                    <MenuItem
                      onClick={promptRename}
                      data-testid="rename-account-button"
                      sx={{
                        borderBottom: '1px solid rgba(255,255,255,0.1)',
                        minHeight: '40px',
                      }}
                    >
                      <Typography variant="caption" color="text.primary">
                        {t('Rename')}
                      </Typography>
                    </MenuItem>

                    <Tooltip
                      title={
                        isDeletable
                          ? ''
                          : t(
                              'Only the last account and secondary wallets can be deleted. First account cannot be deleted (delete the wallet instead).',
                            )
                      }
                    >
                      <MenuItem
                        disabled={!isDeletable}
                        onClick={promptRemove}
                        data-testid="delete-account-button"
                        sx={{
                          minHeight: '40px',
                        }}
                      >
                        <Typography variant="caption" color="error.main">
                          {t('Delete Account')}
                        </Typography>
                      </MenuItem>
                    </Tooltip>
                  </MenuList>
                </Grow>
              )}
            </Popper>
          </IconButton>
        </ClickAwayListener>
      </Stack>
      <Stack sx={{ flexGrow: 1, px: 2 }}>
        <Card sx={{ backgroundColor: 'grey.850' }}>
          <CardContent sx={{ px: 2 }}>
            <Stack sx={{ gap: 1.5 }} divider={<Divider />}>
              <AccountDetailsAddressRow
                data-testid="account-address-c"
                icon={<AvalancheColorIcon size={32} />}
                label={t('Avalanche C-Chain')}
                address={account.addressC}
                copyHandler={onAddressCopy(
                  account.addressC,
                  'AccountDetailsCAddressCopied',
                )}
              />
              {account.addressPVM && (
                <AccountDetailsAddressRow
                  data-testid="account-address-px"
                  icon={<XAndPChainsIcon size={32} />}
                  label={t('Avalanche X/P-Chain')}
                  address={account.addressPVM}
                  copyHandler={onAddressCopy(
                    account.addressPVM,
                    'AccountDetailsXPAddressCopied',
                  )}
                />
              )}
              {account.addressBTC && (
                <AccountDetailsAddressRow
                  data-testid="account-address-btc"
                  icon={<BitcoinColorIcon size={32} />}
                  label={t('Bitcoin')}
                  address={account.addressBTC}
                  copyHandler={onAddressCopy(
                    account.addressBTC,
                    'AccountDetailsBTCAddressCopied',
                  )}
                />
              )}
            </Stack>
          </CardContent>
        </Card>
        <Card sx={{ backgroundColor: 'grey.850', mt: 3 }}>
          <CardContent sx={{ px: 2, pt: 0, ':last-child': { pb: 0.5 } }}>
            <Stack divider={<Divider />}>
              {walletDetails && (
                <DetailsRow label={t('Type')}>
                  <Stack
                    sx={{ flexDirection: 'row', gap: 1, alignItems: 'center' }}
                  >
                    <WalletTypeIcon
                      walletDetails={walletDetails}
                      size={20}
                      sx={{ color: 'text.secondary' }}
                    />
                    <Typography variant="body1" color="text.secondary">
                      {getWalletType()}
                    </Typography>
                  </Stack>
                </DetailsRow>
              )}
              {walletDetails?.derivationPath && (
                <DetailsRow label={t('Derivation Path')}>
                  <OverflowingTypography variant="body1" color="text.secondary">
                    {walletDetails.derivationPath.toUpperCase() ?? '-'}
                  </OverflowingTypography>
                </DetailsRow>
              )}
              {walletDetails && (
                <DetailsRow label={t('Wallet')}>
                  <OverflowingTypography variant="body1" color="text.secondary">
                    {walletDetails.name}
                  </OverflowingTypography>
                </DetailsRow>
              )}
              {isPrivateKeyAvailable && (
                <Button
                  variant="text"
                  color="primary"
                  size="large"
                  data-testid="export-private-key-button"
                  endIcon={<ChevronRightIcon size={20} />}
                  sx={{
                    justifyContent: 'space-between',
                    pl: 0,
                    pr: 0.5,
                    typography: 'body1',
                  }}
                  fullWidth
                  onClick={showPrivateKey}
                >
                  {t('Show Private Key')}
                </Button>
              )}
            </Stack>
          </CardContent>
        </Card>
        {isPrivateKeyAvailable && (
          <Typography
            variant="caption"
            sx={{ color: 'text.tertiary', fontSize: 11, px: 1, mt: 2 }}
          >
            {t(
              'A private key is like a password for this specific account. Keep it secure, anyone with this private key can access your funds.',
            )}
          </Typography>
        )}
      </Stack>
      {renameDialog()}
      {removeDialog()}
    </Stack>
  );
};

const DetailsRow = ({ label, children }) => (
  <Stack
    sx={{
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      py: 1.5,
      gap: 2,
    }}
  >
    <Typography variant="body1" color="text.primary">
      {label}
    </Typography>
    {children}
  </Stack>
);
