import { Suspense, lazy } from 'react';
import { Route, Switch, SwitchProps } from 'react-router-dom';
import { CircularProgress, Stack } from '@avalabs/core-k2-components';

import { SignTxErrorBoundary } from '@src/pages/SignTransaction/components/SignTxErrorBoundary';

const SignMessage = lazy(() => {
  return import('../pages/SignMessage/SignMessage').then((m) => ({
    default: m.SignMessage,
  }));
});

const PermissionsPage = lazy(() => {
  return import('../pages/Permissions/Permissions').then((m) => ({
    default: m.PermissionsPage,
  }));
});

const SignTransactionPage = lazy(() => {
  return import('../pages/SignTransaction/SignTransaction').then((m) => ({
    default: m.SignTransactionPage,
  }));
});

const SeedlessAuthPopup = lazy(() => {
  return import('../pages/SeedlessPopups/SeedlessAuthPopup').then((m) => ({
    default: m.SeedlessAuthPopup,
  }));
});

const SeedlessExportPopup = lazy(() => {
  return import('../pages/SeedlessPopups/SeedlessExportPopup').then((m) => ({
    default: m.SeedlessExportPopup,
  }));
});

const WatchAssetApprovalPopup = lazy(() => {
  return import('../pages/ManageTokens/AddTokenApproval').then((m) => ({
    default: m.AddTokenApproval,
  }));
});

const SelectWallet = lazy(() => {
  return import('../pages/ApproveAction/SelectWallet').then((m) => ({
    default: m.SelectWallet,
  }));
});

const AddCustomNetworkPopup = lazy(() => {
  return import('../pages/Network/AddCustomNetworkPopup').then((m) => ({
    default: m.AddCustomNetworkPopup,
  }));
});

const LedgerConnect = lazy(() => {
  return import('../pages/Ledger/Connect').then((m) => ({
    default: m.LedgerConnect,
  }));
});

const SwitchActiveNetwork = lazy(() => {
  return import('../pages/Network/SwitchActiveNetwork').then((m) => ({
    default: m.SwitchActiveNetwork,
  }));
});

const SwitchAccount = lazy(() => {
  return import('../pages/Wallet/SwitchAccount').then((m) => ({
    default: m.SwitchAccount,
  }));
});

const SetDeveloperMode = lazy(() => {
  return import('../pages/ApproveAction/SetDeveloperMode').then((m) => ({
    default: m.SetDeveloperMode,
  }));
});

const UpdateContacts = lazy(() => {
  return import('../pages/ApproveAction/UpdateContacts').then((m) => ({
    default: m.UpdateContacts,
  }));
});

const AvalancheSignTx = lazy(() => {
  return import('../pages/ApproveAction/AvalancheSignTx').then((m) => ({
    default: m.AvalancheSignTx,
  }));
});

const GenericApprovalScreen = lazy(() => {
  return import('../pages/ApproveAction/GenericApprovalScreen').then((m) => ({
    default: m.GenericApprovalScreen,
  }));
});

const ApproveAction = lazy(() => {
  return import('../pages/ApproveAction/ApproveAction').then((m) => ({
    default: m.ApproveAction,
  }));
});

const RenameAccount = lazy(() => {
  return import('../pages/Wallet/RenameAccount').then((m) => ({
    default: m.RenameAccount,
  }));
});

const GetAddressesInRange = lazy(() => {
  return import('../pages/Wallet/GetAddressesInRange').then((m) => ({
    default: m.GetAddressesInRange,
  }));
});

export const ApprovalRoutes = (props: SwitchProps) => (
  <Suspense
    fallback={
      <Stack
        sx={{
          width: 1,
          height: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <CircularProgress />
      </Stack>
    }
  >
    <Switch {...props}>
      <Route path="/sign/transaction">
        <SignTxErrorBoundary variant="OpenError">
          <SignTransactionPage />
        </SignTxErrorBoundary>
      </Route>
      <Route path="/approve/generic">
        <SignTxErrorBoundary variant="OpenError">
          <GenericApprovalScreen />
        </SignTxErrorBoundary>
      </Route>
      <Route path="/sign">
        <SignMessage />
      </Route>
      <Route path="/ledger/connect">
        <Suspense fallback={<CircularProgress />}>
          <LedgerConnect />
        </Suspense>
      </Route>
      <Route path="/approve/select-wallet">
        <SelectWallet />
      </Route>
      <Route path="/approve/createContact">
        <UpdateContacts method="create" />
      </Route>
      <Route path="/seedless-auth">
        <Suspense fallback={<CircularProgress />}>
          <SeedlessAuthPopup />
        </Suspense>
      </Route>
      <Route path="/seedless-export">
        <Suspense fallback={<CircularProgress />}>
          <SeedlessExportPopup />
        </Suspense>
      </Route>
      <Route path="/approve/updateContact">
        <UpdateContacts method="update" />
      </Route>
      <Route path="/approve/removeContact">
        <UpdateContacts method="remove" />
      </Route>
      <Route path="/approve/watch-asset">
        <WatchAssetApprovalPopup />
      </Route>
      <Route path="/approve/set-developer-mode">
        <SetDeveloperMode />
      </Route>
      <Route path="/approve/avalancheSignTx">
        <AvalancheSignTx />
      </Route>
      <Route path="/approve">
        <ApproveAction />
      </Route>
      <Route path="/permissions">
        <PermissionsPage />
      </Route>
      <Route path="/switchAccount">
        <SwitchAccount />
      </Route>
      <Route path="/renameAccount">
        <RenameAccount />
      </Route>
      <Route path="/getAddressesInRange">
        <GetAddressesInRange />
      </Route>
      <Route path="/networks/add-popup">
        <AddCustomNetworkPopup />
      </Route>
      <Route path="/network/switch">
        <SwitchActiveNetwork />
      </Route>
    </Switch>
  </Suspense>
);
