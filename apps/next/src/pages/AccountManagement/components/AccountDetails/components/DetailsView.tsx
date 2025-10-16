import { ActionButtons } from '@/components/ActionButtons';
import { Stack, styled, Typography } from '@avalabs/k2-alpine';
import { Account, SecretType } from '@core/types';
import { useAccountManager, useWalletContext } from '@core/ui';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { AddressesCard } from './AddressesCard';
import { AccountDetailsHeader } from './Header';
import { MoreDetailsCard } from './MoreDetailsCard';

const Scroller = styled('div')({
  overflow: 'auto',
});

type Props = {
  account: Account;
  onRename: () => void;
  onRemove: () => void;
};

export const DetailsView: FC<Props> = ({ account, onRename, onRemove }) => {
  const { t } = useTranslation();

  const { getWallet } = useWalletContext();
  const { isAccountSelectable } = useAccountManager();

  const isPrimaryAccount = account.type === 'primary';
  const wallet = isPrimaryAccount ? getWallet(account.walletId) : undefined;

  return (
    <>
      <AccountDetailsHeader account={account} />
      <Scroller>
        <Stack direction="column" gap={1.5}>
          <AddressesCard account={account} />
          <MoreDetailsCard
            walletName={wallet?.name ?? t('Imported Accounts')}
            walletType={wallet?.type ?? SecretType.PrivateKey}
          />
          <Typography
            variant="caption"
            px={1.5}
            mt={-0.5}
            color="text.secondary"
          >
            {t(`Your account's private key is a fixed password for accessing the
        specific addresses above. Keep it secure, anyone with this private key
        can access the account associated with it.`)}
          </Typography>
        </Stack>
      </Scroller>
      <ActionButtons
        top={{
          label: t('Rename'),
          onClick: onRename,
          color: 'secondary',
        }}
        bottom={{
          label: t('Remove account'),
          onClick: onRemove,
          color: 'secondary',
          panic: true,
          disabled: !isAccountSelectable(account),
        }}
      />
    </>
  );
};
