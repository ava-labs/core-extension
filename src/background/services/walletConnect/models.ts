import extension from 'extensionizer';
import { ProposalTypes, SessionTypes } from '@walletconnect/types';

export enum WalletConnectEvent {
  UriGenerated = 'WalletConnect:uri_generated',
}

export type WalletConnectUriGeneratedEvent = {
  uri: `wc:${string}`;
  tabId?: number;
};

export const WALLET_CONNECT_APP_METADATA = {
  name: extension.i18n.getMessage('appName'),
  url: location.origin,
  description: extension.i18n.getMessage('appDesc'),
  icons: ['https://extension.core.app/apple-touch-icon.png'],
};

export type WalletConnectAccountInfo = {
  address: string;
  chains: number[];
  walletApp: SessionTypes.Struct['peer']['metadata'];
};

export type ConnectOptions = {
  chainId: number;
  tabId?: number;
  reconnectionAddress?: string;
};

type SessionProposalOptions = {
  chainId: number;
};

export const buildSessionProposal = ({
  chainId,
}: SessionProposalOptions): ProposalTypes.BaseRequiredNamespace => ({
  methods: [
    'eth_sendTransaction',
    'eth_signTypedData_v3',
    'eth_signTypedData_v4',
    'eth_signTypedData_v1',
    'eth_signTypedData',
    'eth_sign',
    'personal_sign',
    'wallet_switchEthereumChain',
    'wallet_addEthereumChain',
  ],
  events: ['chainChanged', 'accountsChanged'],
  chains: [`eip155:${chainId}`],
});

export const isProposalExpiredError = (err: any) =>
  err instanceof Error && err.message === 'Proposal expired';

export const isNoMatchingKeyError = (err: any) =>
  err instanceof Error && err.message.includes('No matching key');

export enum WalletConnectErrorCode {
  NoAccountsConnected = 'no-accounts-connected',
  NoClient = 'client-not-initialized',
  ClientInitFailed = 'client-init-failed',
  ProposalExpired = 'proposal-expired',
  IncorrectAddress = 'incorrect-address',
  UnknownError = 'unknown-error',
}

export class WalletConnectError extends Error {
  code: WalletConnectErrorCode;
  originalError?: Error;

  constructor(
    message: string,
    code: WalletConnectErrorCode,
    originalError?: Error
  ) {
    super(message);
    this.code = code;
    this.originalError = originalError;
  }
}
