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

  const ContentComponent = ComponentByState[wallet.state];

  return (
    <WalletCard
      key={wallet.id}
      id={wallet.id}
      name={wallet.name}
      icon={
        <WalletIcon type={wallet.type} authProvider={wallet.authProvider} />
      }
      initialExpanded={initiallyExpanded}
    >
      <ContentComponent {...props} />
    </WalletCard>
  );
};
