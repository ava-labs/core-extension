import { Route, Switch, useHistory } from 'react-router-dom';

import { FullscreenModal } from '@/components/FullscreenModal';

import { OnboardingStrategyChoiceScreen } from './common-screens/OnboardingStrategyChoiceScreen';
import { ImportRecoveryPhraseFlow } from './flows/ImportRecoveryPhraseFlow';
import { ConnectLedgerFlow } from './flows/ConnectLedgerFlow';
import { ConnectKeystoneFlow } from './flows/ConnectKeystoneFlow';

export const ImportWallet = () => {
  const history = useHistory();

  return (
    <FullscreenModal
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
        <Route path="/onboarding/import/keystone">
          <ConnectKeystoneFlow />
        </Route>
      </Switch>
    </FullscreenModal>
  );
};
