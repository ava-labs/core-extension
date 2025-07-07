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
import { useAccountsContext } from '@core/ui';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { FaSquareCaretUp } from 'react-icons/fa6';
import { MdAdd, MdKey, MdList, MdTopic } from 'react-icons/md';
import { SiWalletconnect } from 'react-icons/si';
import { useHistory } from 'react-router-dom';
import { AccountListItem } from './components/AccountListItem';

const underDevelopmentClick = () => toast.error('Under development');

export const AddOrConnectWallet: FC = () => {
  const { t } = useTranslation();
  const { addAccount, accounts } = useAccountsContext();
  const { goBack } = useHistory();

  const isPrimaryAccount = accounts.active?.type === AccountType.PRIMARY;

  return (
    <Stack gap={2} height={1}>
      <Typography variant="h2" paddingInlineEnd={12} paddingBlockEnd={0.5}>
        {t('Add or connect a wallet')}
      </Typography>
      <Card>
        <List disablePadding dense>
          {isPrimaryAccount && (
            <AccountListItem
              Icon={MdAdd}
              primary={t('Create new account')}
              secondary={t('Generate a new account in your active wallet')}
              onClick={() =>
                addAccount().then(() => {
                  goBack();
                  toast.success(t('Account created successfully'));
                })
              }
            />
          )}
          <Divider />
          <AccountListItem
            Icon={MdKey}
            primary={t('Import a private key')}
            secondary={t('Manually enter your private key to import')}
            onClick={underDevelopmentClick}
          />
          <Divider />
          <AccountListItem
            Icon={MdList}
            primary={t('Import a recovery phrase')}
            secondary={t('Enter your recovery phrase to import a wallet')}
            onClick={underDevelopmentClick}
          />
          <Divider />
          <AccountListItem
            Icon={LedgerIcon}
            primary={t('Import Ledger wallet')}
            secondary={t('Use Ledger to connect')}
            onClick={underDevelopmentClick}
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
            onClick={underDevelopmentClick}
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
    </Stack>
  );
};
