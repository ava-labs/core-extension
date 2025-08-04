import { SeedlessFlow } from '@/pages/Onboarding/flows/SeedlessFlow';
import { useWalletContext } from '@core/ui';
import { FC } from 'react';
import { Redirect } from 'react-router-dom';
import { MnemonicFlow } from './components/MnemonicFlow';

export const ShowPhrase: FC = () => {
  const { walletDetails } = useWalletContext();

  const walletType = walletDetails?.type;

  if (!walletType) {
    return <Redirect to="/settings" />;
  }

  if (walletType === 'seedless') {
    return <SeedlessFlow />;
  }

  return <MnemonicFlow />;
};
