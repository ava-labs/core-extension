import { Route, Switch } from 'react-router-dom';

import {
  getBridgePath,
  getContactsPath,
  getSendPath,
  getSwapPath,
} from '@/config/routes';
import AccountManagement from '@/pages/AccountManagement';
import { Activity } from '@/pages/Activity';
import { Bridge } from '@/pages/Bridge';
import { Contacts } from '@/pages/Contacts';
import { ImportLedgerFlow, ImportSeedphraseFlow } from '@/pages/Import';
import { LedgerReconnect } from '@/pages/Ledger/Reconnect';
import { Portfolio } from '@/pages/Portfolio';
import { Receive } from '@/pages/Receive';
import { Send } from '@/pages/Send';
import { Settings } from '@/pages/Settings';
import { Swap } from '@/pages/Swap';
import { TrendingTokens } from '@/pages/TrendingTokens/TrendingTokens';

export const AppRoutes = () => (
  <Switch>
    <Route path="/receive" component={Receive} />
    <Route path="/settings" component={Settings} />
    <Route path={getContactsPath()} component={Contacts} />
    <Route path="/account-management" component={AccountManagement} />
    <Route path="/import-wallet/seedphrase" component={ImportSeedphraseFlow} />
    <Route path="/import-wallet/ledger/:phase?" component={ImportLedgerFlow} />
    <Route path={getSendPath()} component={Send} />
    <Route path="/trending" component={TrendingTokens} />
    <Route path={getSwapPath()} component={Swap} />
    <Route path={getBridgePath()} component={Bridge} />
    <Route path="/ledger/reconnect" component={LedgerReconnect} />
    <Route path="/activity" component={Activity} />
    <Route path="/" component={Portfolio} />
  </Switch>
);
