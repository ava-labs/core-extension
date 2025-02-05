import { useWalletContext } from '@src/contexts/WalletProvider';
import { LoadingContent } from '@src/popup/LoadingContent';
import type { PropsWithChildren } from 'react';

export function WalletLoading({ children }: PropsWithChildren<any>) {
  const { isWalletLoading } = useWalletContext();

  if (isWalletLoading) {
    return <LoadingContent />;
  }

  return children;
}
