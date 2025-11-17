import { Card, Divider, LedgerIcon, List, toast } from '@avalabs/k2-alpine';
import { openFullscreenTab } from '@core/common';
import { useAnalyticsContext } from '@core/ui';
import { FC, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Page } from '@/components/Page';
import { FaSquareCaretUp } from 'react-icons/fa6';
import { MdKey, MdList, MdTopic } from 'react-icons/md';
import { SiWalletconnect } from 'react-icons/si';
import { useHistory } from 'react-router-dom';
import { AccountListItem } from './components/AccountListItem';

const underDevelopmentClick = () => toast.error('Under development');

export const AddOrConnectWallet: FC = () => {
  const { t } = useTranslation();
  const { capture } = useAnalyticsContext();

  const { push } = useHistory();

  const goToImportKeystoreFileScreen = useCallback(() => {
    capture('AddWalletWithKeystoreFile_Clicked');
    push('/account-management/import-keystore-file');
  }, [push, capture]);

  const goToImportPrivateKey = useCallback(() => {
    capture('ImportPrivateKey_Clicked');
    push('/account-management/import-private-key');
  }, [push, capture]);

  return (
    <Page
      title={t('Add an account or connect a wallet')}
      withBackButton
      containerProps={{
        mt: 3,
      }}
      contentProps={{ alignItems: 'stretch', justifyContent: 'flex-start' }}
    >
      <Card>
        <List disablePadding dense>
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
            onClick={() => openFullscreenTab('import-wallet/seedphrase')}
          />
          <Divider />
          <AccountListItem
            Icon={LedgerIcon}
            primary={t('Import Ledger wallet')}
            secondary={t('Use Ledger to connect')}
            onClick={() => openFullscreenTab('import-wallet/ledger')}
          />
          <Divider />
          <AccountListItem
            Icon={SiWalletconnect}
            primary={t('Connect with WalletConnect')}
            secondary={t('Scan QR code to connect your wallet')}
            onClick={underDevelopmentClick}
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
            onClick={underDevelopmentClick}
          />
        </List>
      </Card>
    </Page>
  );
};
