import React from 'react';
import { Action } from '@core/types';
import { Disconnected } from './components/Disconnected';
import { Loading } from './components/Loading';
import { Pending } from './components/Pending';
import { DisplayData } from '@avalabs/vm-module-types';
import { IncorrectVersionForXP } from './components/IncorrectVersionForXP';

export type StateComponentProps = {
  state: KeystoneUsbApprovalState;
  approve: () => Promise<unknown>;
  reject: () => void;
  action: Action<DisplayData>;
};

export type KeystoneUsbApprovalState =
  | 'loading'
  | 'disconnected'
  | 'pending'
  | 'incorrect-version-for-xp';

export const StateComponentMapper: Record<
  KeystoneUsbApprovalState,
  React.ComponentType<StateComponentProps>
> = {
  loading: Loading,
  disconnected: Disconnected,
  pending: Pending,
  'incorrect-version-for-xp': IncorrectVersionForXP,
};

export const REQUIRED_FIRMWARE_VERSION_FOR_XP_SIGNING = '2.4.2';
