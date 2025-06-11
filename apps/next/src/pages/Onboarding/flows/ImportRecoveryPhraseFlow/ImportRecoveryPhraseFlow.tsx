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

const BASE_PATH = '/onboarding/import/recovery-phrase';
const TOTAL_STEPS = 5;

export const ImportRecoveryPhraseFlow = () => {
  const { setOnboardingWalletType } = useOnboardingContext();

  useEffect(() => {
    setOnboardingWalletType(WalletType.Mnemonic);
  }, [setOnboardingWalletType]);

  return (
    <Switch>
      <Route exact path={BASE_PATH}>
        <EnterRecoveryPhraseScreen
          step={2}
          totalSteps={TOTAL_STEPS}
          nextScreenPath={`${BASE_PATH}/wallet-details`}
        />
      </Route>
      <Route path={`${BASE_PATH}/wallet-details`}>
        <ProvideWalletDetailsScreen
          step={3}
          totalSteps={TOTAL_STEPS}
          nextScreenPath={`${BASE_PATH}/select-avatar`}
        />
      </Route>
      <Route path={`${BASE_PATH}/select-avatar`}>
        <SelectAvatarScreen
          step={4}
          totalSteps={TOTAL_STEPS}
          nextScreenPath={`${BASE_PATH}/enjoy-your-wallet`}
        />
      </Route>
      <Route path={`${BASE_PATH}/enjoy-your-wallet`}>
        <EnjoyYourWalletScreen />
      </Route>
    </Switch>
  );
};
