import { SessionTypes } from '@walletconnect/types';

export enum WalletConnectEvent {
  UriGenerated = 'WalletConnect:uri_generated',
  SessionPermissionsMismatch = 'WalletConnect:session_permissions_mismatch',
}

export type WalletConnectUriGeneratedEvent = {
  uri: `wc:${string}`;
  tabId?: number;
};

export type WalletConnectSessionPermissionsMismatch = {
  activeSession: WalletConnectSessionInfo;
  requiredPermissions: {
    address: string;
    chainId: number;
  };
  tabId?: number;
};

export type WalletConnectEventType =
  | WalletConnectUriGeneratedEvent
  | WalletConnectSessionPermissionsMismatch;

export const CORE_MOBILE_WALLET_ID = 'c3de833a-9cb0-4274-bb52-86e402ecfcd3';

export const FIREBLOCKS_APP_NAME = 'Fireblocks';

export type WalletConnectSessionInfo = {
  addresses: [string, ...string[]];
  topic: string;
  chains: [number, ...number[]];
  walletApp: SessionTypes.Struct['peer']['metadata'] & { walletId?: string };
};

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
  UserRejected = 'user-rejected',
}

export class WalletConnectError extends Error {
  code: WalletConnectErrorCode;
  originalError?: Error;

  constructor(
    message: string,
    code: WalletConnectErrorCode,
    originalError?: Error,
  ) {
    super(message);
    this.code = code;
    this.originalError = originalError;
  }
}

export type ConnectOptions = {
  chainId: number;
  tabId?: number;
  address?: string;
};

export type RequestPayload = {
  method: string;
  params: unknown[] | Record<string, unknown>;
};

export type RequestOptions = {
  chainId: number;
  fromAddress: string;
  tabId?: number;
  expiry?: number; // in seconds, between 300 (5 minutes) and 604800 (7 days)
};
export interface WalletConnectTransport {
  connect(options: ConnectOptions): Promise<WalletConnectSessionInfo | never>;
  request<T = string>(
    payload: RequestPayload,
    options: RequestOptions,
  ): Promise<T | never>;
  getSessionInfo(
    lookupAddress: string,
    chainId?: number,
  ): Promise<null | WalletConnectSessionInfo>;
}
