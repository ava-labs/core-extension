import { Disconnected } from './components/Disconnected';
import { Loading } from './components/Loading';
import { Pending } from './components/Pending';

export type StateComponentProps = {
  state: KeystoneUsbApprovalState;
  approve: () => Promise<unknown>;
  reject: () => void;
};

export type KeystoneUsbApprovalState = 'loading' | 'disconnected' | 'pending';

type StateComponent = {
  component: React.ComponentType<any>;
};

const LoadingState: StateComponent = {
  component: Loading,
};

const DisconnectedState: StateComponent = {
  component: Disconnected,
};

const PendingState: StateComponent = {
  component: Pending,
};

export const StateComponentMapper: Record<
  KeystoneUsbApprovalState,
  StateComponent
> = {
  loading: LoadingState,
  disconnected: DisconnectedState,
  pending: PendingState,
};
