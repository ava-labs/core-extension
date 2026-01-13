import {
  ApprovalParams,
  BatchApprovalParams,
  RpcRequest,
} from '@avalabs/vm-module-types';

type RpcRequestWithExtensionContext = RpcRequest & {
  context?: RpcRequest['context'] & {
    tabId?: number;
  };
};
export interface MultiApprovalParamsWithContext extends BatchApprovalParams {
  request: RpcRequestWithExtensionContext;
}
export interface ApprovalParamsWithContext extends ApprovalParams {
  request: RpcRequestWithExtensionContext;
}

export const isBatchApprovalParams = (
  params: ApprovalParams | BatchApprovalParams,
): params is BatchApprovalParams => {
  return 'signingRequests' in params;
};
