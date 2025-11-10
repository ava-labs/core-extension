import { Route, Switch } from 'react-router-dom';

import AccountManagement from '@/pages/AccountManagement';
import { Contacts } from '@/pages/Contacts';
import { ImportLedgerFlow, ImportSeedphraseFlow } from '@/pages/Import';
import { Portfolio } from '@/pages/Portfolio';
import { Receive } from '@/pages/Receive';
import { Send } from '@/pages/Send';
import { Settings } from '@/pages/Settings';
import { Swap } from '@/pages/Swap';

import { TrendingTokens } from '@/pages/TrendingTokens/TrendingTokens';
import { getContactsPath, getSendPath, getSwapPath } from '@/config/routes';
import { LedgerReconnect } from '@/pages/Ledger/Reconnect';
import { KeystoneUsbReconnect } from '@/pages/KeystoneUsb/Reconnect';
import { DeFiProtocolDetails } from '@/pages/DeFi/DeFiProtocolDetails';

export const AppRoutes = () => (
  <Switch>
    <Route path="/defi/:protocolId" component={DeFiProtocolDetails} />
    <Route path="/receive" component={Receive} />
    <Route path="/settings" component={Settings} />
    <Route path={getContactsPath()} component={Contacts} />
    <Route path="/account-management" component={AccountManagement} />
    <Route path="/import-wallet/seedphrase" component={ImportSeedphraseFlow} />
    <Route path="/import-wallet/ledger/:phase?" component={ImportLedgerFlow} />
    <Route path={getSendPath()} component={Send} />
    <Route path="/trending" component={TrendingTokens} />
    <Route path={getSwapPath()} component={Swap} />
    <Route path="/ledger/reconnect" component={LedgerReconnect} />
    <Route path="/keystone-usb/reconnect" component={KeystoneUsbReconnect} />
    <Route path="/" component={Portfolio} />
  </Switch>
);
