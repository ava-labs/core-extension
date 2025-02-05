import type {
  AccountImportState,
  AwaitingApprovalAccountImportState,
  WalletConnectUri,
} from './models';
import { AccountImportStatus } from './models';

interface BaseAction {
  status: AccountImportStatus;
  payload?: unknown;
}

interface ResetStateAction extends BaseAction {
  status: AccountImportStatus.NotInitiated;
}
interface ImportInitiatedAction extends BaseAction {
  status: AccountImportStatus.Initiated;
}

interface ImportAwaitingApprovalAction extends BaseAction {
  status: AccountImportStatus.AwaitingApproval;
  payload: {
    uri: WalletConnectUri;
  };
}

interface ImportSucceededAction extends BaseAction {
  status: AccountImportStatus.Successful;
}

interface ImportFailedAction extends BaseAction {
  status: AccountImportStatus.Failed;
  payload: {
    error: string;
  };
}

type ImportAction =
  | ResetStateAction
  | ImportInitiatedAction
  | ImportAwaitingApprovalAction
  | ImportSucceededAction
  | ImportFailedAction;

export const importReducer = (
  state: AccountImportState,
  action: ImportAction,
): AccountImportState => {
  const { status, payload } = action;
  switch (status) {
    case AccountImportStatus.NotInitiated:
      return {
        status,
      };
    case AccountImportStatus.Initiated:
      return {
        status,
      };
    case AccountImportStatus.AwaitingApproval:
      return {
        status,
        ...payload,
      };
    case AccountImportStatus.Successful:
      return {
        ...(state as AwaitingApprovalAccountImportState),
        status,
      };
    case AccountImportStatus.Failed:
      return {
        ...(state as AwaitingApprovalAccountImportState),
        status,
        ...payload,
      };

    default:
      throw new Error(
        `WalletConnectContextProvider: Unknown connection status: "${AccountImportStatus[status]}"`,
      );
  }
};
