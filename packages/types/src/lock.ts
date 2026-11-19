export const SESSION_AUTH_DATA_KEY = 'SESSION_AUTH_DATA_KEY';
export interface SessionAuthData {
  password: string;
  loginTime: number;
}

export const LOCK_TIMEOUT = 1000 * 60 * 60 * 12; // 12 hours
export enum LockEvents {
  LOCK_STATE_CHANGED = 'LockServiceEvents:Lock',
}

export enum AlarmsEvents {
  AUTO_LOCK = 'auto-lock',
  RECURRING_SWAP_SUBSCRIPTION_DISCOVERY = 'recurring-swap-subscription-discovery',
  /** Prefix: the full alarm name is `clear-clipboard:<sha256 of the secret>`. */
  CLEAR_CLIPBOARD = 'clear-clipboard:',
}

export interface LockStateChangedEventPayload {
  isUnlocked: boolean;
}
