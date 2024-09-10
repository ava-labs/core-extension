import { ApprovalParams, RpcRequest } from '@avalabs/vm-module-types';

export enum VMModuleError {
  UnsupportedChain = 'unsupported-chain',
  UnsupportedMethod = 'unsupported-method',
  UnsupportedNamespace = 'unsupported-namespace',
  ModulesNotInitialized = 'modules-not-initialized',
}

type RpcRequestWithExtensionContext = RpcRequest & {
  context?: RpcRequest['context'] & {
    tabId?: number;
  };
};
export interface ApprovalParamsWithContext extends ApprovalParams {
  request: RpcRequestWithExtensionContext;
}
