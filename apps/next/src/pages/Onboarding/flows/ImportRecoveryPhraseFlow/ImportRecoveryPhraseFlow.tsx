import { useCallback, useEffect } from 'react';
import { WalletType } from '@avalabs/types';
import { Route, Switch, useHistory } from 'react-router-dom';

import { useAnalyticsContext, useOnboardingContext } from '@core/ui';

import {
  ProvideWalletDetailsScreen,
  SelectAvatarScreen,
  EnjoyYourWalletScreen,
} from '../../common-screens';
import { EnterRecoveryPhraseScreen } from './screens';

const BASE_PATH = '/onboarding/import/recovery-phrase';
const TOTAL_STEPS = 5;

export const ImportRecoveryPhraseFlow = () => {
  const history = useHistory();
  const {
    setAvatar,
    setOnboardingWalletType,
    mnemonic,
    setMnemonic,
    onboardingState,
  } = useOnboardingContext();
  const { capture } = useAnalyticsContext();

  useEffect(() => {
    // If at any of the screens below the user does not have the required state,
    // restart the onboarding flow.
    if (!mnemonic && !onboardingState.isOnBoarded) {
      history.replace(BASE_PATH);
    }
  }, [mnemonic, history, onboardingState.isOnBoarded]);

  useEffect(() => {
    setOnboardingWalletType(WalletType.Mnemonic);
  }, [setOnboardingWalletType]);

  const onMnemonicImported = useCallback(
    (phrase: string) => {
      setMnemonic(phrase);
      capture('OnboardingMnemonicImported');
      history.push(`${BASE_PATH}/wallet-details`);
    },
    [capture, setMnemonic, history],
  );

  const onDetailsProvided = useCallback(() => {
    history.push(`${BASE_PATH}/select-avatar`);
  }, [history]);

  const onAvatarSelected = useCallback(
    (avatarUri: string) => {
      setAvatar(avatarUri);
      capture('OnboardingAvatarSelected');
      history.push(`${BASE_PATH}/enjoy-your-wallet`);
    },
    [capture, setAvatar, history],
  );

  return (
    <Switch>
      <Route exact path={BASE_PATH}>
        <EnterRecoveryPhraseScreen
          step={2}
          totalSteps={TOTAL_STEPS}
          onNext={onMnemonicImported}
        />
      </Route>
      <Route path={`${BASE_PATH}/wallet-details`}>
        <ProvideWalletDetailsScreen
          step={3}
          totalSteps={TOTAL_STEPS}
          onNext={onDetailsProvided}
        />
      </Route>
      <Route path={`${BASE_PATH}/select-avatar`}>
        <SelectAvatarScreen
          step={4}
          totalSteps={TOTAL_STEPS}
          onNext={onAvatarSelected}
        />
      </Route>
      <Route path={`${BASE_PATH}/enjoy-your-wallet`}>
        <EnjoyYourWalletScreen />
      </Route>
    </Switch>
  );
};
