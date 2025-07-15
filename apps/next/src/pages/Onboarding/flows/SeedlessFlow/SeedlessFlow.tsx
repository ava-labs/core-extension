import { useEffect } from 'react';
import { WalletType } from '@avalabs/types';
import { Route, Switch, useHistory } from 'react-router-dom';

import { useOnboardingContext } from '@core/ui';

import { FullscreenModal } from '@/components/FullscreenModal';

import {
  ProvideWalletDetailsScreen,
  SelectAvatarScreen,
  EnjoyYourWalletScreen,
} from '../../common-screens';
import { SeedlessMfaLoginFlow, SeedlessMfaSetupFlow } from './subflows';

const BASE_PATH = '/onboarding/seedless';
const TOTAL_STEPS = 5;

export const SeedlessFlow = () => {
  const history = useHistory();
  const { setOnboardingWalletType, oidcToken, onboardingState } =
    useOnboardingContext();

  useEffect(() => {
    setOnboardingWalletType(WalletType.Seedless);

    return () => {
      setOnboardingWalletType(undefined);
    };
  }, [setOnboardingWalletType]);

  useEffect(() => {
    if (!oidcToken && !onboardingState.isOnBoarded) {
      history.replace('/onboarding');
    }
  }, [oidcToken, history, onboardingState.isOnBoarded]);

  return (
    <FullscreenModal
      open
      withCoreLogo
      withAppInfo
      withLanguageSelector
      onBack={history.goBack}
    >
      <Switch>
        <Route path={`${BASE_PATH}/login`}>
          <SeedlessMfaLoginFlow
            nextScreenPath={`${BASE_PATH}/wallet-details`}
          />
        </Route>
        <Route path={`${BASE_PATH}/setup`}>
          <SeedlessMfaSetupFlow
            nextScreenPath={`${BASE_PATH}/wallet-details`}
          />
        </Route>
        <Route path={`${BASE_PATH}/wallet-details`}>
          <ProvideWalletDetailsScreen
            step={3}
            totalSteps={TOTAL_STEPS}
            onNext={() => history.push(`${BASE_PATH}/select-avatar`)}
          />
        </Route>
        <Route path={`${BASE_PATH}/select-avatar`}>
          <SelectAvatarScreen
            step={4}
            totalSteps={TOTAL_STEPS}
            onNext={() => history.push(`${BASE_PATH}/enjoy-your-wallet`)}
          />
        </Route>
        <Route path={`${BASE_PATH}/enjoy-your-wallet`}>
          <EnjoyYourWalletScreen />
        </Route>
      </Switch>
    </FullscreenModal>
  );
};
