import { NetworkVMType } from '@avalabs/vm-module-types';
import { SecretType, SeedlessAuthProvider } from '@core/types';

type AccountToConnect = {
  id: string;
  name: string;
  address: string;
};

export type WalletToConnectState =
  | 'ready'
  | 'solana-not-supported'
  | 'network-not-supported'
  | 'ledger-needs-solana-setup'
  | 'seedless-solana-loading';

export type WalletToConnect = {
  id: string;
  name?: string;
  accounts: AccountToConnect[];
  state: WalletToConnectState;
  type: SecretType;
  authProvider?: SeedlessAuthProvider;
};

export type DappPermissionsState = {
  isLoading: boolean;
  wallets: WalletToConnect[];
  isSelected: (accountId: string) => boolean;
  toggleAccount: (accountId: string) => void;
  numberOfSelectedAccounts: number;
  accountSettings: Map<string, boolean>;
};

export type ConnectWalletCardProps = Omit<DappPermissionsState, 'wallets'> & {
  wallet: WalletToConnect;
  initiallyExpanded: boolean;
};

export type ConnectDappDisplayData = {
  addressVM: NetworkVMType;
  dappUrl: string;
  dappIcon: string;
  dappDomain: string;
};
