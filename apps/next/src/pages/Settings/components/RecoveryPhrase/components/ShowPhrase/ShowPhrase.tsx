import { SeedlessFlow } from '@/pages/Onboarding/flows/SeedlessFlow';
import { useWalletContext } from '@core/ui';
import { FC } from 'react';
import { MnemonicFlow } from './components/MnemonicFlow';

export const ShowPhrase: FC = () => {
  const { walletDetails } = useWalletContext();

  if (walletDetails?.type === 'mnemonic') {
    return <MnemonicFlow />;
  }

  if (walletDetails?.type === 'seedless') {
    return <SeedlessFlow />;
  }

  throw new Error('Unsupported wallet type');
};
