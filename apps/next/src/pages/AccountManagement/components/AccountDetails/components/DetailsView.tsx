import { Stack, styled, Typography } from '@avalabs/k2-alpine';
import { Account, SecretType } from '@core/types';
import { useWalletContext } from '@core/ui';
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
};

export const DetailsView: FC<Props> = ({ account }) => {
  const { t } = useTranslation();

  const { getWallet } = useWalletContext();

  const isPrimaryAccount = account.type === 'primary';
  const wallet = isPrimaryAccount ? getWallet(account.walletId) : undefined;

  return (
    <Stack flexGrow={1}>
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
    </Stack>
  );
};
