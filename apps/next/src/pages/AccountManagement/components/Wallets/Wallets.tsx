import { Stack, styled } from '@avalabs/k2-alpine';
import { FC } from 'react';
import { AddOrConnectWalletButton } from '../AddOrCreateWallet';
import CurrentAccount from '../CurrentAccount';
import { BulkDeleteButtons } from './components/BulkDeleteButtons';
import { WalletList } from './components/WalletList';

const CurrentAccountWithExtraBottomMargin = styled(CurrentAccount)(
  ({ theme }) => ({
    marginBlockEnd: theme.spacing(1.5),
  }),
);

export const Wallets: FC = () => {
  return (
    <Stack gap={1.5} height={1}>
      <CurrentAccountWithExtraBottomMargin />
      <Stack gap={1.5} overflow="auto">
        <WalletList />
      </Stack>
      <BulkDeleteButtons />
      <AddOrConnectWalletButton />
    </Stack>
  );
};
