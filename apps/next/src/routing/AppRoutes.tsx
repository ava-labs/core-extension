import { Route, Switch } from 'react-router-dom';

import AccountManagement from '@/pages/AccountManagement';
import { Contacts } from '@/pages/Contacts';
import { ImportLedgerFlow, ImportSeedphraseFlow } from '@/pages/Import';
import { Portfolio } from '@/pages/Portfolio';
import { Receive } from '@/pages/Receive';
import { Send } from '@/pages/Send';
import { Settings } from '@/pages/Settings';
import { RecoveryMethodsFullScreen } from '@/pages/Settings/components/RecoveryMethods/FullScreens/RecoveryMethodsFullScreen';
import { Swap } from '@/pages/Swap';

import { getContactsPath, getSendPath, getSwapPath } from '@/config/routes';
import { LedgerReconnect } from '@/pages/Ledger/Reconnect';

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
    <Route path={getSwapPath()} component={Swap} />
    <Route path="/ledger/reconnect" component={LedgerReconnect} />
    <Route path="/" component={Portfolio} />
  </Switch>
);
