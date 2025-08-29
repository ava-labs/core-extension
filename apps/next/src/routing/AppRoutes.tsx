import { Route, Switch } from 'react-router-dom';

import AccountManagement from '@/pages/AccountManagement';
import { Contacts } from '@/pages/Contacts';
import { ImportLedgerFlow, ImportSeedphraseFlow } from '@/pages/Import';
import { Portfolio } from '@/pages/Portfolio';
import { Receive } from '@/pages/Receive';
import { Send } from '@/pages/Send';
import { Settings } from '@/pages/Settings';

import { getContactsPath, getSendPath } from '@/config/routes';

export const AppRoutes = () => (
  <Switch>
    <Route path="/receive" component={Receive} />
    <Route path="/settings" component={Settings} />
    <Route path={getContactsPath()} component={Contacts} />
    <Route path="/account-management" component={AccountManagement} />
    <Route path="/import-wallet/seedphrase" component={ImportSeedphraseFlow} />
    <Route path="/import-wallet/ledger/:phase?" component={ImportLedgerFlow} />
    <Route path={getSendPath()} component={Send} />
    <Route path="/" component={Portfolio} />
  </Switch>
);
