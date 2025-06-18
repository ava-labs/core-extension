import { useEffect } from 'react';
import { WalletType } from '@avalabs/types';
import { Route, Switch, useHistory } from 'react-router-dom';

import { useOnboardingContext } from '@core/ui';

import {
  ProvideWalletDetailsScreen,
  SelectAvatarScreen,
  EnjoyYourWalletScreen,
} from '../../common-screens';
import { OnboardingModal } from '@/components/OnboardingModal';
import { NewSeedphraseScreen } from './screens/NewSeedphraseScreen';
import { ConfirmSeedphraseScreen } from './screens/ConfirmSeedphraseScreen';

const BASE_PATH = '/onboarding/create';
const TOTAL_STEPS = 5;

export const CreateNewWalletFlow = () => {
  const history = useHistory();
  const { setOnboardingWalletType, mnemonic, onboardingState } =
    useOnboardingContext();

  useEffect(() => {
    setOnboardingWalletType(WalletType.Mnemonic);
  }, [setOnboardingWalletType]);

  useEffect(() => {
    // If at any of the screens below the user does not have the required state,
    // restart the onboarding flow.
    if (!mnemonic && !onboardingState.isOnBoarded) {
      history.replace(BASE_PATH);
    }
  }, [mnemonic, history, onboardingState.isOnBoarded]);

  return (
    <OnboardingModal
      open
      withCoreLogo
      withAppInfo
      withLanguageSelector
      onBack={history.goBack}
    >
      <Switch>
        <Route exact path={BASE_PATH}>
          <NewSeedphraseScreen
            step={1}
            totalSteps={TOTAL_STEPS}
            nextScreenPath={`${BASE_PATH}/confirm-seedphrase`}
          />
        </Route>
        <Route path={`${BASE_PATH}/confirm-seedphrase`}>
          <ConfirmSeedphraseScreen
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
    </OnboardingModal>
  );
};
