import { Route, Switch, useHistory } from 'react-router-dom';

import { OnboardingModal } from '@/components/OnboardingModal';

import { OnboardingStrategyChoiceScreen } from './common-screens/OnboardingStrategyChoiceScreen';
import { ImportRecoveryPhraseFlow } from './flows/ImportRecoveryPhraseFlow';
import { ConnectLedgerFlow } from './flows/ConnectLedgerFlow';

export const ImportWallet = () => {
  const history = useHistory();

  return (
    <OnboardingModal
      open
      withCoreLogo
      withAppInfo
      withLanguageSelector
      onBack={history.goBack}
    >
      <Switch>
        <Route exact path="/onboarding/import">
          <OnboardingStrategyChoiceScreen />
        </Route>
        <Route path="/onboarding/import/recovery-phrase">
          <ImportRecoveryPhraseFlow />
        </Route>
        <Route path="/onboarding/import/ledger">
          <ConnectLedgerFlow />
        </Route>
      </Switch>
    </OnboardingModal>
  );
};
