import { SeedlessFlow } from '@/pages/Onboarding/flows/SeedlessFlow';
import { SecretType } from '@core/types';
import { useWalletContext } from '@core/ui';
import { FC } from 'react';
import { Redirect } from 'react-router-dom';
import { MnemonicFlow } from './components/MnemonicFlow';

export const ShowPhrase: FC = () => {
  const { walletDetails } = useWalletContext();

  const walletType = walletDetails?.type;

  if (walletType === SecretType.Mnemonic) {
    return <MnemonicFlow />;
  }

  if (walletType === SecretType.Seedless) {
    return <SeedlessFlow />;
  }

  return <Redirect to="/settings" />;
};
