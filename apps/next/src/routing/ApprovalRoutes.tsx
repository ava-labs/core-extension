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
      <Route path="/approve/generic">
        <GenericApprovalScreen />
      </Route>
    </Switch>
  </Suspense>
);
