import { EVMProvider } from '@avalabs/evm-module/dist/provider';
import { MultiWalletProviderProxy } from 'packages/inpage/src/MultiWalletProviderProxy';

declare global {
  interface Window {
    avalanche?: EVMProvider;
    ethereum?: MultiWalletProviderProxy | EVMProvider;
    evmproviders?: Record<string, unknown>;
  }

  const EVM_PROVIDER_INFO_UUID: string;
  const EVM_PROVIDER_INFO_NAME: string;
  const EVM_PROVIDER_INFO_ICON: `data:image/svg+xml;base64,${string}`;
  const EVM_PROVIDER_INFO_DESCRIPTION: string;
  const EVM_PROVIDER_INFO_RDNS: string;
  const CORE_EXTENSION_VERSION: string;
}

export {};
