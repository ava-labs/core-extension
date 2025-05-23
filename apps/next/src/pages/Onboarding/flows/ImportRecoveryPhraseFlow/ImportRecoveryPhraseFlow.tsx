import { useEffect } from 'react';
import { WalletType } from '@avalabs/types';
import { Route, Switch } from 'react-router-dom';

import { useOnboardingContext } from '@core/ui';

import {
  ProvideWalletDetailsScreen,
  SelectAvatarScreen,
  EnjoyYourWalletScreen,
} from '../../common-screens';
import { EnterRecoveryPhraseScreen } from './screens';

export const ImportRecoveryPhraseFlow = () => {
  const { setOnboardingWalletType } = useOnboardingContext();

  useEffect(() => {
    setOnboardingWalletType(WalletType.Mnemonic);
  }, [setOnboardingWalletType]);

  return (
    <Switch>
      <Route exact path="/onboarding/import/recovery-phrase">
        <EnterRecoveryPhraseScreen />
      </Route>
      <Route path="/onboarding/import/recovery-phrase/wallet-details">
        <ProvideWalletDetailsScreen step={3} totalSteps={5} />
      </Route>
      <Route path="/onboarding/import/recovery-phrase/select-avatar">
        <SelectAvatarScreen step={4} totalSteps={5} />
      </Route>
      <Route path="/onboarding/import/recovery-phrase/enjoy-your-wallet">
        <EnjoyYourWalletScreen />
      </Route>
    </Switch>
  );
};
