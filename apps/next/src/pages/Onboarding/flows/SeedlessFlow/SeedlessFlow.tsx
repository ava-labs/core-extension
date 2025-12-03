import { WalletType } from '@avalabs/types';
import { useEffect, useState } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';

import { useOnboardingContext } from '@core/ui';

import { FullscreenModal } from '@/components/FullscreenModal';

import {
  CustomizeCore,
  EnjoyYourWalletScreen,
  ProvideWalletDetailsScreen,
  SelectAvatarScreen,
} from '../../common-screens';
import { SeedlessMfaLoginFlow, SeedlessMfaSetupFlow } from './subflows';
import { VerifyGoBackModal } from './screens/VerifyGoBackModal';

const BASE_PATH = '/onboarding/seedless';
const TOTAL_STEPS = 6;

export const SeedlessFlow = () => {
  const history = useHistory();
  const { setOnboardingWalletType, oidcToken, onboardingState } =
    useOnboardingContext();

  const [isVerifyGoBackModalOpen, setIsVerifyGoBackModalOpen] = useState(false);

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
    <>
      <FullscreenModal
        open
        withCoreLogo
        withAppInfo
        withLanguageSelector
        onBack={() => setIsVerifyGoBackModalOpen(true)}
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
              onNext={() => history.push(`${BASE_PATH}/customize-core`)}
            />
          </Route>
          <Route path={`${BASE_PATH}/customize-core`}>
            <CustomizeCore
              step={4}
              totalSteps={TOTAL_STEPS}
              onNext={() => history.push(`${BASE_PATH}/select-avatar`)}
            />
          </Route>
          <Route path={`${BASE_PATH}/select-avatar`}>
            <SelectAvatarScreen
              step={5}
              totalSteps={TOTAL_STEPS}
              onNext={() => history.push(`${BASE_PATH}/enjoy-your-wallet`)}
            />
          </Route>
          <Route path={`${BASE_PATH}/enjoy-your-wallet`}>
            <EnjoyYourWalletScreen />
          </Route>
        </Switch>
      </FullscreenModal>
      <VerifyGoBackModal
        isOpen={isVerifyGoBackModalOpen}
        onBack={() => {
          history.push('/onboarding');
        }}
        onCancel={() => {
          setIsVerifyGoBackModalOpen(false);
        }}
      />
    </>
  );
};
