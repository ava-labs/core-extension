export interface ExtensionConnectionMessage {
  id: string;
  method: string;
  params?: any[];
}

export interface ExtensionConnectionMessageResponse<T = any>
  extends ExtensionConnectionMessage {
  result?: T;
  error?: Error;
}

export interface ExtensionConnectionEvent<V = any> {
  name: string;
  value: V;
}

export function isConnectionEvent(
  message: ExtensionConnectionMessageResponse | ExtensionConnectionEvent
): message is ExtensionConnectionEvent {
  return (
    !message.hasOwnProperty('id') &&
    message.hasOwnProperty('name') &&
    message.hasOwnProperty('value')
  );
}

export function isConnectionResponse(
  message: ExtensionConnectionMessageResponse | ExtensionConnectionEvent
): message is ExtensionConnectionMessageResponse {
  return (
    message.hasOwnProperty('id') &&
    !message.hasOwnProperty('name') &&
    !message.hasOwnProperty('value')
  );
}

export type ConnectionRequestHandler<T = any> = (
  request: ExtensionConnectionMessage
) => Promise<ExtensionConnectionMessageResponse<T>>;

export enum ExtensionRequest {
  ONBOARDING_GET_STATE = 'onboarding_getIsOnBoarded',
  ONBOARDING_SET_PHASE = 'onboarding_setCurrentPhase',
  ONBOARDING_SET_MNEMONIC = 'onboarding_setWalletMnemonic',
  ONBOARDING_SET_PASSWORD = 'onboarding_setWalletPassword',
  ONBOARDING_SET_FINALIZED = 'onboarding_setOnboardingFinalized',
  NETWORK_GET_SELECTED = 'network_getSelectedNetwork',
  NETWORK_SET_SELECTED = 'network_setSelectedNetwork',
  WALLET_STATE = 'wallet_InitializeState',
  WALLET_UNLOCK_STATE = 'wallet_unlockWalletState',
  SETTINGS_LOCK_WALLET = 'settings_lockWallet',
  MESSAGE_SIGN = 'message_signMessage',
  MESSAGE_GET_PENDING = 'message_getPendingMessage',
  MESSAGE_CANCEL_PENDING = 'message_cancelPendingMessage',
}
