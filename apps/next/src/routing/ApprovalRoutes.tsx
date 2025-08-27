import { Suspense } from 'react';
import { CircularProgress, Stack } from '@avalabs/k2-alpine';
import { Route, Switch, SwitchProps } from 'react-router-dom';

import { GenericApprovalScreen } from '@/pages/Approve/GenericApprovalScreen';

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
      <Route
        path={[
          '/approve/generic',
          // The avalanche transaction requests are still handled by our internal
          // handlers instead of VM Modules, resulting in a different URL.
          // This will change with this ticket:
          // https://ava-labs.atlassian.net/browse/CP-11826
          '/approve/avalancheSignTx',
        ]}
      >
        <GenericApprovalScreen />
      </Route>
    </Switch>
  </Suspense>
);
