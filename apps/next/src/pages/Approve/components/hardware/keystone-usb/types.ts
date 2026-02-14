import React from 'react';
import { Action } from '@core/types';
import { Disconnected } from './components/Disconnected';
import { Loading } from './components/Loading';
import { Pending } from './components/Pending';
import { DisplayData } from '@avalabs/vm-module-types';

export type StateComponentProps = {
  state: KeystoneUsbApprovalState;
  approve: () => Promise<unknown>;
  reject: () => void;
  action: Action<DisplayData>;
  error?: any;
};

export type KeystoneUsbApprovalState = 'loading' | 'disconnected' | 'pending';

export const StateComponentMapper: Record<
  KeystoneUsbApprovalState,
  React.ComponentType<StateComponentProps>
> = {
  loading: Loading,
  disconnected: Disconnected,
  pending: Pending,
};
