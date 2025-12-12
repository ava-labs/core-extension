import { Suspense } from 'react';
import { CircularProgress, Stack } from '@avalabs/k2-alpine';
import { Route, Switch, SwitchProps } from 'react-router-dom';

import { GenericApprovalScreen } from '@/pages/Approve/GenericApprovalScreen';
import { ApproveDappConnection } from '@/pages/Approve/ApproveDappConnection/ApproveDappConnection';
import { ExtensionActionApprovalScreen } from '@/pages/Approve/ExtensionActionApprovalScreen';
import { SeedlessAuthPopup } from '@/pages/Seedless/SeedlessAuthPopup';
import { NetworkAddApprovalScreen } from '@/pages/Approve/NetworkAddApprovalScreen';
import { NetworkSwitchApprovalScreen } from '@/pages/Approve/NetworkSwitchApprovalScreen';
import { DeveloperModeApprovalScreen } from '@/pages/Approve/DeveloperModeApprovalScreen';
import { SelectWalletApprovalScreen } from '@/pages/Approve/SelectWalletApprovalScreen';

export const ApprovalRoutes = (props: SwitchProps) => (
  <Suspense
    fallback={
      <Stack
        width="100vw"
        height="100vh"
        justifyContent="center"
        alignItems="center"
      >
        <CircularProgress />
      </Stack>
    }
  >
    <Switch {...props}>
      <Route path={['/sign']}>
        <ExtensionActionApprovalScreen />
      </Route>
      <Route path="/approve/set-developer-mode">
        <DeveloperModeApprovalScreen />
      </Route>
      <Route path="/approve/select-wallet">
        <SelectWalletApprovalScreen />
      </Route>
      <Route path="/network/switch">
        <NetworkSwitchApprovalScreen />
      </Route>
      <Route path="/networks/add-popup">
        <NetworkAddApprovalScreen />
      </Route>
      <Route path={'/approve/generic'}>
        <GenericApprovalScreen />
      </Route>
      <Route path="/permissions">
        <ApproveDappConnection />
      </Route>
      <Route path="/seedless-auth" component={SeedlessAuthPopup} />
    </Switch>
  </Suspense>
);
