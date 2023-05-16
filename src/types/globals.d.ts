import { CoreProvider } from '@src/background/providers/CoreProvider';
import { MultiWalletProviderProxy } from '@src/background/providers/MultiWalletProviderProxy';

declare global {
  interface Window {
    avalanche?: CoreProvider;
    ethereum?: MultiWalletProviderProxy | CoreProvider;
    evmproviders?: Record<string, unknown>;
  }

  const EVM_PROVIDER_INFO_UUID: string;
  const EVM_PROVIDER_INFO_NAME: string;
  const EVM_PROVIDER_INFO_ICON: `data:image/svg+xml;base64,${string}`;
  const EVM_PROVIDER_INFO_DESCRIPTION: string;
}

export {};
