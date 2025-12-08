import { Route, Switch } from 'react-router-dom';
import { WalletTotalBalanceProvider } from '@core/ui';

import {
  getBridgePath,
  getContactsPath,
  getSendPath,
  getSwapPath,
} from '@/config/routes';
import AccountManagement from '@/pages/AccountManagement';
import { Activity } from '@/pages/Activity';
import { Bridge } from '@/pages/Bridge';
import { Concierge } from '@/pages/Concierge';
import { Contacts } from '@/pages/Contacts';
import { DeFiProtocolDetails } from '@/pages/DeFi/DeFiProtocolDetails';
import { ImportLedgerFlow, ImportSeedphraseFlow } from '@/pages/Import';
import { KeystoneUsbReconnect } from '@/pages/KeystoneUsb/Reconnect';
import { LedgerReconnect } from '@/pages/Ledger/Reconnect';
import { Portfolio } from '@/pages/Portfolio';
import { Receive } from '@/pages/Receive';
import { Send } from '@/pages/Send';
import { Settings } from '@/pages/Settings';
import { RecoveryMethodsFullScreen } from '@/pages/Settings/components/RecoveryMethods/FullScreens/RecoveryMethodsFullScreen';
import { Swap } from '@/pages/Swap';
import { TrendingTokens } from '@/pages/TrendingTokens';
import { SeedlessAuthPopup } from '@/pages/Seedless/SeedlessAuthPopup';

export const AppRoutes = () => (
  <WalletTotalBalanceProvider>
    <Switch>
      <Route path="/seedless-auth" component={SeedlessAuthPopup} />
      <Route path="/defi/:protocolId" component={DeFiProtocolDetails} />
      <Route path="/receive" component={Receive} />
      <Route path="/settings" component={Settings} />
      <Route path={getContactsPath()} component={Contacts} />
      <Route path="/account-management" component={AccountManagement} />
      <Route
        path="/import-wallet/seedphrase"
        component={ImportSeedphraseFlow}
      />
      <Route
        path="/import-wallet/ledger/:phase?"
        component={ImportLedgerFlow}
      />
      <Route path={getSendPath()} component={Send} />
      <Route
        path="/update-recovery-method/:mfaType?/:action?/:keyType?"
        component={RecoveryMethodsFullScreen}
      />
      <Route path="/trending" component={TrendingTokens} />
      <Route path={getSwapPath()} component={Swap} />
      <Route path={'/concierge'} component={Concierge} />
      <Route path={getBridgePath()} component={Bridge} />
      <Route path="/ledger/reconnect" component={LedgerReconnect} />
      <Route path="/keystone-usb/reconnect" component={KeystoneUsbReconnect} />
      <Route path="/sync" component={Activity} />
      <Route path="/activity" component={Activity} />
      <Route path="/" component={Portfolio} />
    </Switch>
  </WalletTotalBalanceProvider>
);
