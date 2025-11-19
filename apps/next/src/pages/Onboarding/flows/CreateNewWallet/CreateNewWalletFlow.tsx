import { WalletType } from '@avalabs/types';
import { useCallback, useEffect } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';

import { useAnalyticsContext, useOnboardingContext } from '@core/ui';

import { FullscreenModal } from '@/components/FullscreenModal';
import {
  CustomizeCore,
  EnjoyYourWalletScreen,
  ProvideWalletDetailsScreen,
  SelectAvatarScreen,
} from '../../common-screens';
import { ConfirmSeedphraseScreen } from './screens/ConfirmSeedphraseScreen';
import { NewSeedphraseScreen } from './screens/NewSeedphraseScreen';

const BASE_PATH = '/onboarding/create';
const TOTAL_STEPS = 6;

export const CreateNewWalletFlow = () => {
  const history = useHistory();
  const { capture } = useAnalyticsContext();
  const { setOnboardingWalletType, mnemonic, onboardingState, setMnemonic } =
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

  const onSeedphraseCreated = useCallback(
    (phrase: string) => {
      capture('OnboardingMnemonicCreated');
      setMnemonic(phrase);
      history.push(`${BASE_PATH}/confirm-seedphrase`);
    },
    [capture, history, setMnemonic],
  );

  const onSeedphraseConfirmed = useCallback(() => {
    capture('OnboardingMnemonicVerified');
    history.push(`${BASE_PATH}/wallet-details`);
  }, [capture, history]);

  let step = 2;
  return (
    <FullscreenModal
      open
      withCoreLogo
      withAppInfo
      withLanguageSelector
      onBack={() => {
        capture('OnboardingCancelled');
        history.goBack();
      }}
    >
      <Switch>
        <Route exact path={BASE_PATH}>
          <NewSeedphraseScreen
            step={step++}
            totalSteps={TOTAL_STEPS}
            onNext={onSeedphraseCreated}
          />
        </Route>
        <Route path={`${BASE_PATH}/confirm-seedphrase`}>
          <ConfirmSeedphraseScreen
            step={step++}
            totalSteps={TOTAL_STEPS}
            onNext={onSeedphraseConfirmed}
          />
        </Route>
        <Route path={`${BASE_PATH}/wallet-details`}>
          <ProvideWalletDetailsScreen
            step={step++}
            totalSteps={TOTAL_STEPS}
            onNext={() => history.push(`${BASE_PATH}/customize-core`)}
          />
        </Route>
        <Route path={`${BASE_PATH}/customize-core`}>
          <CustomizeCore
            step={step++}
            totalSteps={TOTAL_STEPS}
            onNext={() => history.push(`${BASE_PATH}/select-avatar`)}
          />
        </Route>
        <Route path={`${BASE_PATH}/select-avatar`}>
          <SelectAvatarScreen
            step={step++}
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
