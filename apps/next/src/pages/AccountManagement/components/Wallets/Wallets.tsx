import { Stack, styled } from '@avalabs/k2-alpine';
import { FC } from 'react';
import AddOrConnectWalletButton from '../AddOrConnectWalletButton';
import CurrentAccount from '../CurrentAccount';
import { WalletList } from './components/WalletList';

const PaddedEndStack = styled(Stack)(({ theme }) => ({
  gap: theme.spacing(1.5),
  '&:after': {
    content: '""',
    height: theme.spacing(4),
  },
}));

const CurrentAccountWithExtraBottomMargin = styled(CurrentAccount)(
  ({ theme }) => ({
    marginBlockEnd: theme.spacing(1.5),
  }),
);

export const Wallets: FC = () => {
  return (
    <PaddedEndStack>
      <CurrentAccountWithExtraBottomMargin />
      <WalletList />
      <AddOrConnectWalletButton />
    </PaddedEndStack>
  );
};
