import { MetaMaskInpageProvider } from '@src/background/providers/MetaMaskInpageProvider';

declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider;
    evmproviders?: Record<string, unknown>;
  }

  const EVM_PROVIDER_INFO: {
    uuid: string;
    name: string;
    description: string;
    icon: `data:image/svg+xml;base64,${string}`;
  };
}

export {};
