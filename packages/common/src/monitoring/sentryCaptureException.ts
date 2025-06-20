import * as Sentry from '@sentry/browser';

export enum SentryExceptionTypes {
  // dApp
  DAPP_CONNECTION_EVENT = 'dAppConnectionEvent',

  // extension
  EXTENSION_CONNECTION_MESSAGE = 'extensionConnectionMessage',
  EXTENSION_CONNECTION_EVENT = 'extensionConnectionEvent',

  SWAP = 'swap',

  AI_AGENT = 'aiAgent',

  // ledger
  LEDGER = 'ledger',

  // keystone
  KEYSTONE = 'keystone',

  WALLETCONNECT = 'walletConnect',

  SEEDLESS = 'seedless',

  FIREBLOCKS = 'fireblocks',

  UNIFIED_BRIDGE = 'unifiedBridge',

  ANALYTICS = 'analytics',

  WALLET_IMPORT = 'walletImport',

  INTERNAL_ERROR = 'internalError',

  BALANCES = 'balances',

  VM_MODULES = 'vmModules',

  ONBOARDING = 'onboarding',

  FIREBASE = 'firebase',

  NOTIFICATIONS = 'notifications',
}

// wrapper to make error reporting contexts unfirom accross the codebase
const sentryCaptureException = (error: Error, type: SentryExceptionTypes) =>
  Sentry.captureException(error, { tags: { type } });

export default sentryCaptureException;
