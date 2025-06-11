import { Route, Switch, useHistory } from 'react-router-dom';

import { OnboardingModal } from '@/components/OnboardingModal';

import { OnboardingStrategyChoiceScreen } from './common-screens/OnboardingStrategyChoiceScreen';
import { ImportRecoveryPhraseFlow } from './flows/ImportRecoveryPhraseFlow/ImportRecoveryPhraseFlow';

export const ImportWallet = () => {
  const history = useHistory();

  return (
    <OnboardingModal
      open
      withCoreLogo
      withAppInfo
      withLanguageSelector
      onBack={history.goBack}
      onClose={() => history.push('/')}
    >
      <Switch>
        <Route exact path="/onboarding/import">
          <OnboardingStrategyChoiceScreen />
        </Route>
        <Route path="/onboarding/import/recovery-phrase">
          <ImportRecoveryPhraseFlow />
        </Route>
      </Switch>
    </OnboardingModal>
  );
};
