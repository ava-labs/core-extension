import { Route, Switch } from 'react-router-dom';

import {
  ProvideWalletDetailsScreen,
  SelectAvatarScreen,
  EnjoyYourWalletScreen,
} from '../../common-screens';
import { ConnectLedgerScreen } from './screens';
import { LedgerContextProvider } from '@core/ui';

const BASE_PATH = '/onboarding/import/ledger';
const TOTAL_STEPS = 5;

export const ConnectLedgerFlow = () => {
  return (
    <LedgerContextProvider>
      <Switch>
        <Route exact path={BASE_PATH}>
          <ConnectLedgerScreen
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
    </LedgerContextProvider>
  );
};
