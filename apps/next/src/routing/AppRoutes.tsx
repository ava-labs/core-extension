import { Route, Switch } from 'react-router-dom';

import { Send } from '@/pages/Send';
import { Receive } from '@/pages/Receive';
import { Settings } from '@/pages/Settings';
import { Contacts } from '@/pages/Contacts';
import { Portfolio } from '@/pages/Portfolio';
import { ImportLedgerFlow, ImportSeedphraseFlow } from '@/pages/Import';
import AccountManagement from '@/pages/AccountManagement/AccountManagement';

import { getContactsPath, getSendPath } from '@/config/routes';
import { RecoveryMethodsFullScreen } from '@/pages/Settings/components/RecoveryMethods/FullScreens/RecoveryMethodsFullScreen';

export const AppRoutes = () => (
  <Switch>
    <Route path="/receive" component={Receive} />
    <Route path="/settings" component={Settings} />
    <Route path={getContactsPath()} component={Contacts} />
    <Route path="/account-management" component={AccountManagement} />
    <Route path="/import-wallet/seedphrase" component={ImportSeedphraseFlow} />
    <Route path="/import-wallet/ledger/:phase?" component={ImportLedgerFlow} />
    <Route path={getSendPath()} component={Send} />
    <Route
      path="/update-recovery-method/:mfaType?/:action?/:keyType?"
      component={RecoveryMethodsFullScreen}
    />
    <Route path="/" component={Portfolio} />
  </Switch>
);
