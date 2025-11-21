import {
  Card,
  Divider,
  LedgerIcon,
  List,
  Stack,
  toast,
  Typography,
} from '@avalabs/k2-alpine';
import { AccountType } from '@core/types';
import { openFullscreenTab } from '@core/common';
import {
  LedgerAppType,
  useAccountsContext,
  useAnalyticsContext,
  useLedgerContext,
  useWalletContext,
} from '@core/ui';
import { FC, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { FaSquareCaretUp } from 'react-icons/fa6';
import { MdAdd, MdKey, MdList, MdTopic } from 'react-icons/md';
import { SiWalletconnect } from 'react-icons/si';
import { useHistory } from 'react-router-dom';
import { AccountListItem } from './components/AccountListItem';

const underDevelopmentClick = () => toast.error('Under development');

export const AddOrConnectWallet: FC = () => {
  const { t } = useTranslation();
  const { capture } = useAnalyticsContext();
  const { isLedgerWallet } = useWalletContext();
  const { hasLedgerTransport, appType } = useLedgerContext();

  const { addAccount, accounts, selectAccount } = useAccountsContext();
  const { goBack, push } = useHistory();

  const isPrimaryAccount = accounts.active?.type === AccountType.PRIMARY;

  const canAddNewAccount =
    !isLedgerWallet ||
    (hasLedgerTransport && appType === LedgerAppType.AVALANCHE);

  const goToImportKeystoreFileScreen = useCallback(() => {
    capture('AddWalletWithKeystoreFile_Clicked');
    push('/account-management/import-keystore-file');
  }, [push, capture]);

  const goToImportPrivateKey = useCallback(() => {
    capture('ImportPrivateKey_Clicked');
    push('/account-management/import-private-key');
  }, [push, capture]);

  return (
    <Stack gap={2} height={1}>
      <Typography variant="h2" paddingInlineEnd={12} paddingBlockEnd={0.5}>
        {t('Add an account or connect a wallet')}
      </Typography>
      <Card>
        <List disablePadding dense>
          {isPrimaryAccount && (
            <AccountListItem
              tooltip={
                canAddNewAccount
                  ? ''
                  : t('Connect your Ledger device and open the Avalanche app')
              }
              disabled={!canAddNewAccount}
              Icon={MdAdd}
              primary={t('Create new account')}
              secondary={t('Generate a new account in your active wallet')}
              onClick={() =>
                addAccount()
                  .then(selectAccount)
                  .then(goBack)
                  .then(() => {
                    toast.success(t('Account created successfully'));
                    capture('CreatedANewAccountSuccessfully');
                  })
                  .catch((error) => {
                    toast.error(t('Account creation failed'));
                    console.error(error);
                  })
              }
            />
          )}
          <Divider />
          <AccountListItem
            Icon={MdKey}
            primary={t('Import a private key')}
            secondary={t('Manually enter your private key to import')}
            onClick={goToImportPrivateKey}
          />
          <Divider />
          <AccountListItem
            Icon={MdList}
            primary={t('Import a recovery phrase')}
            secondary={t('Enter your recovery phrase to import a wallet')}
            onClick={() => {
              capture('AddWalletWithSeedphrase_Clicked');
              openFullscreenTab('import-wallet/seedphrase');
            }}
          />
          <Divider />
          <AccountListItem
            Icon={LedgerIcon}
            primary={t('Import Ledger wallet')}
            secondary={t('Use Ledger to connect')}
            onClick={() => {
              capture('AddWalletWithLedger_Clicked');
              openFullscreenTab('import-wallet/ledger');
            }}
          />
          <Divider />
          <AccountListItem
            Icon={SiWalletconnect}
            primary={t('Connect with WalletConnect')}
            secondary={t('Scan QR code to connect your wallet')}
            onClick={() => {
              capture('ImportWithWalletConnect_Clicked');
              underDevelopmentClick();
            }}
          />
          <Divider />
          <AccountListItem
            Icon={MdTopic}
            primary={t('Import a keystore file')}
            secondary={t('Upload a JSON file to import')}
            onClick={goToImportKeystoreFileScreen}
          />
          <Divider />
          <AccountListItem
            Icon={FaSquareCaretUp}
            primary={t('Import with Fireblocks account')}
            secondary={t('Manually enter your private key to import')}
            onClick={() => {
              capture('ImportWithFireblocks_Clicked');
              underDevelopmentClick();
            }}
          />
        </List>
      </Card>
    </Stack>
  );
};
