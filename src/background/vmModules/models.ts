export enum VMModuleError {
  UnsupportedChain = 'unsupported-chain',
  UnsupportedMethod = 'unsupported-method',
  UnsupportedNamespace = 'unsupported-namespace',
  ModulesNotInitialized = 'modules-not-initialized',
}

export const VIA_MODULE_SYMBOL = Symbol.for('handle.via.module');
