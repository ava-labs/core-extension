import { useWalletContext } from '@core/ui';
import { FC } from 'react';
import { MnemonicFlow } from './components/MnemonicFlow';
import { SeedlessFlow } from './components/SeedlessFlow';

export const ShowPhrase: FC = () => {
  const { walletDetails } = useWalletContext();

  const walletType = walletDetails?.type;

  if (!walletType) {
    return null;
  }

  if (walletType === 'seedless') {
    return <SeedlessFlow />;
  }

  return <MnemonicFlow />;
};
