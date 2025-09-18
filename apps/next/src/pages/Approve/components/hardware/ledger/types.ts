import { LedgerAppType } from '@core/ui';

export type StateComponentProps = {
  state: LedgerApprovalState;
  approve: () => Promise<unknown>;
  reject: () => void;
};

export type LedgerApprovalState =
  | {
      state: 'loading';
    }
  | {
      state: 'disconnected';
    }
  | {
      state: 'incorrect-app';
      requiredApp: LedgerAppType;
    }
  | {
      state: 'incorrect-version';
      requiredVersion: string;
      requiredApp: LedgerAppType;
    }
  | {
      state: 'pending';
      requiredApp: LedgerAppType;
      requiredVersion: string;
    };
