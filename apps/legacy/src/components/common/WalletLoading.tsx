import { useWalletContext } from '@core/ui';
import { LoadingContent } from '@/popup/LoadingContent';
import { PropsWithChildren } from 'react';

export function WalletLoading({ children }: PropsWithChildren<any>) {
  const { isWalletLoading } = useWalletContext();

  if (isWalletLoading) {
    return <LoadingContent />;
  }

  return children;
}
