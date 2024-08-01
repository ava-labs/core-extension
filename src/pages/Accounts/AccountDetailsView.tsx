import { useHistory, useParams } from 'react-router-dom';
import { ChangeEvent, KeyboardEvent, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  AvalancheColorIcon,
  BitcoinColorIcon,
  Button,
  Card,
  CardContent,
  ChevronRightIcon,
  InfoCircleIcon,
  Stack,
  Tooltip,
  Typography,
  toast,
} from '@avalabs/core-k2-components';

import { PageTitle } from '@src/components/common/PageTitle';
import { useWalletContext } from '@src/contexts/WalletProvider';
import { isBitcoinNetwork } from '@src/background/services/network/utils/isBitcoinNetwork';
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import { useAccountsContext } from '@src/contexts/AccountsProvider';
import { stripAddressPrefix } from '@src/utils/stripAddressPrefix';

import { XPChainIcon } from './components/XPChainIcon';
import { usePrivateKeyExport } from './hooks/usePrivateKeyExport';
import { NoAccountsFound, Origin } from './components/NoAccountsFound';
import { useAccountManager } from './providers/AccountManagerProvider';
import { ConfirmAccountRemovalDialog } from './components/ConfirmAccountRemovalDialog';
import { AccountDetailsAddressRow } from './components/AccountDetailsAddressRow';
import { CurrentAddressSneakPeek } from './components/CurrentAddressSneakPeek';
import { AccountNameInput } from './components/AccountNameInput';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';
import { useFeatureFlagContext } from '@src/contexts/FeatureFlagsProvider';
import { FeatureGates } from '@src/background/services/featureFlags/models';
import { AccountType } from '@src/background/services/accounts/models';
import { isPrimaryAccount } from '@src/background/services/accounts/utils/typeGuards';
import { WalletChip } from '@src/components/common/WalletChip';

export const AccountDetailsView = () => {
  const { t } = useTranslation();
  const { isAccountSelectable } = useAccountManager();
  const { accountId } = useParams<{ accountId: string }>();
  const { getAccountById } = useAccountsContext();
  const { getWallet } = useWalletContext();
  const account = getAccountById(accountId);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [newName, setNewName] = useState(account?.name ?? '');
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const { network } = useNetworkContext();
  const history = useHistory();
  const { capture } = useAnalyticsContext();
  const { deleteAccounts, renameAccount } = useAccountsContext();
  const walletDetails = isPrimaryAccount(account)
    ? getWallet(account.walletId)
    : null;
  const { isPrivateKeyAvailable, showPrivateKey } = usePrivateKeyExport(
    account,
    walletDetails?.type
  );
  const { featureFlags } = useFeatureFlagContext();
  const canPrimaryAccountsBeRemoved =
    featureFlags[FeatureGates.PRIMARY_ACCOUNT_REMOVAL];

  const onAddressCopy = useCallback(
    (addressToCopy: string, eventName: string) => () => {
      navigator.clipboard.writeText(stripAddressPrefix(addressToCopy));
      toast.success(t('Copied!'));
      capture(eventName, { type: account?.type });
    },
    [t, account?.type, capture]
  );

  const onBackClick = useCallback(() => {
    if (history.length <= 2) {
      history.replace('/accounts');
    } else {
      history.goBack();
    }
  }, [history]);

  const onEditClick = useCallback(() => {
    if (account?.name) {
      setNewName(account.name);
    }
    setIsEditing((editing) => !editing);
  }, [account?.name]);

  const onSaveClick = useCallback(() => {
    if (newName === account?.name) {
      setIsEditing(false);
      return;
    }

    setIsSaving(true);
    renameAccount(accountId, newName)
      .then(() => {
        setIsEditing(false);
        toast.success(t('Account renamed'));
      })
      .catch(() => toast.error(t('Renaming failed')))
      .finally(() => {
        setIsSaving(false);
      });
  }, [account?.name, renameAccount, newName, accountId, t]);

  const onDeleteClick = useCallback(async () => {
    setIsDeleting(true);
    deleteAccounts([accountId]).finally(() => {
      setIsDeleting(false);
      onBackClick();
    });
  }, [accountId, deleteAccounts, onBackClick]);

  if (!account) {
    return <NoAccountsFound origin={Origin.Url} />;
  }

  const isDeletable = isAccountSelectable(account);
  const address =
    network && isBitcoinNetwork(network)
      ? account?.addressBTC ?? account?.addressC
      : account?.addressC;

  return (
    <Stack
      sx={{
        px: 1,
        pb: 2,
        width: 1,
        height: 1,
        gap: 2,
        backgroundColor: 'grey.900',
      }}
    >
      <Stack
        direction="row"
        sx={{ mt: 2.5, mb: 0.5, pr: 1, alignItems: 'center' }}
      >
        <PageTitle margin="0" onBackClick={onBackClick} />
        <Button
          variant="text"
          size="small"
          onClick={isEditing ? onSaveClick : onEditClick}
          disabled={isSaving}
          isLoading={isSaving}
          data-testid={`account-details-${isEditing ? 'save' : 'edit'}-button`}
        >
          {isEditing ? t('Save') : t('Edit')}
        </Button>
      </Stack>
      <Stack sx={{ gap: 1, justifyContent: 'center', alignItems: 'center' }}>
        {isEditing ? (
          <AccountNameInput
            data-testid="account-details-name-input"
            defaultValue={account.name}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setNewName(e.target.value)
            }
            onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
              if (e.key === 'Enter') {
                onSaveClick();
              } else if (e.key === 'Escape') {
                setNewName(account.name);
                setIsEditing(false);
              }
            }}
            autoFocus
          />
        ) : (
          <Typography
            variant="h4"
            textAlign="center"
            data-testid="account-details-name"
          >
            {account.name}
          </Typography>
        )}

        {walletDetails && <WalletChip walletDetails={walletDetails} />}
        <CurrentAddressSneakPeek address={address} />
      </Stack>
      <Stack sx={{ flexGrow: 1 }}>
        <Card elevation={1} sx={{ backgroundColor: 'grey.850', mx: 1 }}>
          <CardContent sx={{ pl: 2, pr: 1, ':last-child': { pb: 0.5 } }}>
            <Stack sx={{ gap: 1.5 }}>
              <AccountDetailsAddressRow
                data-testid="account-address-c"
                icon={<AvalancheColorIcon size={16} />}
                label={t('C-Chain')}
                address={account.addressC}
                copyHandler={onAddressCopy(
                  account.addressC,
                  'AccountDetailsCAddressCopied'
                )}
              />
              {account.addressPVM && (
                <AccountDetailsAddressRow
                  data-testid="account-address-px"
                  icon={<XPChainIcon />}
                  label={t('X/P-Chain')}
                  address={account.addressPVM}
                  copyHandler={onAddressCopy(
                    account.addressPVM,
                    'AccountDetailsXPAddressCopied'
                  )}
                />
              )}
              {account.addressBTC && (
                <AccountDetailsAddressRow
                  data-testid="account-address-btc"
                  icon={<BitcoinColorIcon size={16} />}
                  label={t('Bitcoin')}
                  address={account.addressBTC}
                  copyHandler={onAddressCopy(
                    account.addressBTC,
                    'AccountDetailsBTCAddressCopied'
                  )}
                />
              )}
              {isPrivateKeyAvailable && (
                <Button
                  variant="text"
                  color="primary"
                  size="large"
                  data-testid="export-private-key-button"
                  endIcon={<ChevronRightIcon size={20} />}
                  sx={{ justifyContent: 'space-between', pl: 0, pr: 0.5 }}
                  fullWidth
                  onClick={showPrivateKey}
                >
                  {t('Show Private Key')}
                </Button>
              )}
            </Stack>
          </CardContent>
        </Card>
      </Stack>

      {(account.type !== AccountType.PRIMARY ||
        canPrimaryAccountsBeRemoved) && (
        <Tooltip
          title={
            isDeletable
              ? ''
              : t(
                  'Only the last account and secondary wallets can be deleted. First account cannot be deleted (delete the wallet instead).'
                )
          }
        >
          <Button
            variant="text"
            color="error"
            size="large"
            data-testid="delete-account-button"
            startIcon={isDeletable ? null : <InfoCircleIcon />}
            disabled={!isDeletable}
            isLoading={isDeleting}
            onClick={() => setIsConfirmDialogOpen(true)}
            fullWidth
          >
            {t('Delete Account')}
          </Button>
        </Tooltip>
      )}

      <ConfirmAccountRemovalDialog
        open={isConfirmDialogOpen}
        onClose={() => setIsConfirmDialogOpen(false)}
        onConfirm={onDeleteClick}
        isMultiple={false}
        isDeleting={isDeleting}
      />
    </Stack>
  );
};
