import { Route, Switch, useHistory } from 'react-router-dom';

import {
  ProvideWalletDetailsScreen,
  SelectAvatarScreen,
  EnjoyYourWalletScreen,
} from '../../common-screens';
import { ConnectLedgerScreen } from './screens';
import { useCallback, useEffect } from 'react';
import { useAnalyticsContext, useOnboardingContext } from '@core/ui';

const BASE_PATH = '/onboarding/import/ledger';
const TOTAL_STEPS = 5;

export const ConnectLedgerFlow = () => {
  const history = useHistory();
  const { addressPublicKeys, onboardingState, setAvatar } =
    useOnboardingContext();
  const { capture } = useAnalyticsContext();

  useEffect(() => {
    if (!addressPublicKeys?.length && !onboardingState.isOnBoarded) {
      history.replace(BASE_PATH);
    }
  }, [addressPublicKeys?.length, history, onboardingState.isOnBoarded]);

  const onAvatarSelected = useCallback(
    (avatarUri: string) => {
      setAvatar(avatarUri);
      capture('OnboardingAvatarSelected');
      history.push(`${BASE_PATH}/enjoy-your-wallet`);
    },
    [capture, history, setAvatar],
  );

  return (
    <Switch>
      <Route exact path={BASE_PATH}>
        <ConnectLedgerScreen
          step={2}
          totalSteps={TOTAL_STEPS}
          onNext={() => history.push(`${BASE_PATH}/wallet-details`)}
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
          onNext={onAvatarSelected}
        />
      </Route>
      <Route path={`${BASE_PATH}/enjoy-your-wallet`}>
        <EnjoyYourWalletScreen />
      </Route>
    </Switch>
  );
};
