import { FC } from 'react';

import { WalletCard } from '@/components/WalletCard/WalletCard';
import { WalletIcon } from '@/components/WalletIcon';

import { ConnectWalletCardProps, WalletToConnectState } from '../types';
import {
  SolanaNotSupportedWalletCard,
  NetworkNotSupportedWalletCard,
  SolanaSetupRequiredWalletCard,
  LoadingWalletCard,
  ReadyWalletCard,
} from './wallet-cards';
import { useAccountsContext } from '@core/ui';

const ComponentByState: Record<
  WalletToConnectState,
  FC<ConnectWalletCardProps>
> = {
  ready: ReadyWalletCard,
  'solana-not-supported': SolanaNotSupportedWalletCard,
  'network-not-supported': NetworkNotSupportedWalletCard,
  'ledger-needs-solana-setup': SolanaSetupRequiredWalletCard,
  'seedless-solana-loading': LoadingWalletCard,
};

export const ConnectWalletCard: FC<ConnectWalletCardProps> = (props) => {
  const { wallet, initiallyExpanded } = props;
  const {
    accounts: { active: activeAccount },
  } = useAccountsContext();

  const isActiveWallet = wallet.accounts.some(
    (account) => account.id === activeAccount?.id,
  );

  const ContentComponent = ComponentByState[wallet.state];

  return (
    <WalletCard
      accountsNumber={wallet.accounts.length}
      key={wallet.id}
      id={wallet.id}
      name={wallet.name}
      icon={
        <WalletIcon
          type={wallet.type}
          authProvider={wallet.authProvider}
          size={21}
          expanded={isActiveWallet}
        />
      }
      initialExpanded={initiallyExpanded}
      disableRename
    >
      <ContentComponent {...props} />
    </WalletCard>
  );
};
