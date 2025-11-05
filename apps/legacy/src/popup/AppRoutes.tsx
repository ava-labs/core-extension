import { Suspense, lazy } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { CircularProgress } from '@avalabs/core-k2-components';

import { LoadingSendForm } from '@/pages/Send/components/LoadingSendForm';

const AddToken = lazy(() => {
  return import('../pages/ManageTokens/AddToken').then((m) => ({
    default: m.AddToken,
  }));
});

const TokenFlowPage = lazy(() => {
  return import('../pages/Wallet/TokenFlow').then((m) => ({
    default: m.TokenFlow,
  }));
});

const ManageCollectiblesPage = lazy(() => {
  return import('../pages/ManageCollectibles/ManageCollectibles').then((m) => ({
    default: m.ManageCollectibles,
  }));
});

const ManageTokensPage = lazy(() => {
  return import('../pages/ManageTokens/ManageTokens').then((m) => ({
    default: m.ManageTokens,
  }));
});

const ImportPrivateKeyPage = lazy(() => {
  return import('../pages/ImportPrivateKey/ImportPrivateKey').then((m) => ({
    default: m.ImportPrivateKey,
  }));
});

const Swap = lazy(() => {
  return import('../pages/Swap/Swap').then((m) => ({
    default: m.Swap,
  }));
});

const Bridge = lazy(() => {
  return import('../pages/Bridge/Bridge');
});

const BridgeTransactionStatus = lazy(() => {
  return import('../pages/Bridge/BridgeTransactionStatus');
});

const SendPage = lazy(() => {
  return import('../pages/Send/Send').then((m) => ({
    default: m.SendPage,
  }));
});

const CollectibleDetails = lazy(() => {
  return import('../pages/Collectibles/CollectibleDetails').then((m) => ({
    default: m.CollectibleDetails,
  }));
});

const CollectibleSend = lazy(() => {
  return import('../pages/Collectibles/CollectibleSend').then((m) => ({
    default: m.CollectibleSend,
  }));
});

const LedgerConnect = lazy(() => {
  return import('../pages/Ledger/Connect').then((m) => ({
    default: m.LedgerConnect,
  }));
});

const Assets = lazy(() => {
  return import('../pages/Home/components/Portfolio/Assets');
});

const ImportWithWalletConnect = lazy(() => {
  return import('../pages/ImportWithWalletConnect/ImportWithWalletConnect');
});

const ImportFireblocksWithWalletConnect = lazy(() => {
  return import('../pages/Fireblocks/ImportFireblocksWithWalletConnect');
});

const ConnectBitcoinWallet = lazy(() => {
  return import('../pages/Fireblocks/ConnectBitcoinWallet');
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

const ExportPrivateKey = lazy(() => {
  return import('../pages/ExportPrivateKey/ExportPrivateKey').then((m) => ({
    default: m.ExportPrivateKey,
  }));
});

const AddWalletWithSeedPhrase = lazy(() => {
  return import('../pages/Accounts/AddWalletWithSeedPhrase').then((m) => ({
    default: m.AddWalletWithSeedPhrase,
  }));
});
const AddWalletWithLedger = lazy(() => {
  return import('../pages/Accounts/AddWalletWithLedger').then((m) => ({
    default: m.AddWalletWithLedger,
  }));
});

const AddWalletWithKeystoreFile = lazy(() => {
  return import('../pages/Accounts/AddWalletWithKeystoreFile').then((m) => ({
    default: m.AddWalletWithKeystoreFile,
  }));
});

const SeedlessUpdateRecoveryMethod = lazy(() => {
  return import('../pages/SeedlessPopups/SeedlessUpdateRecoveryMethod').then(
    (m) => ({
      default: m.SeedlessUpdateRecoveryMethod,
    }),
  );
});

const SeedlessRemoveTotp = lazy(() => {
  return import('../pages/SeedlessPopups/SeedlessRemoveTotp').then((m) => ({
    default: m.SeedlessRemoveTotp,
  }));
});

const Home = lazy(() => {
  return import('../pages/Home/Home').then((m) => ({
    default: m.Home,
  }));
});

const Networks = lazy(() => {
  return import('../pages/Networks').then((m) => ({
    default: m.Networks,
  }));
});

const AddNetwork = lazy(() => {
  return import('../pages/Networks/AddNetwork').then((m) => ({
    default: m.AddNetwork,
  }));
});

const EditNetwork = lazy(() => {
  return import('../pages/Networks/EditNetwork').then((m) => ({
    default: m.EditNetwork,
  }));
});

const NetworkDetails = lazy(() => {
  return import('../pages/Networks/NetworkDetails').then((m) => ({
    default: m.NetworkDetails,
  }));
});

const Receive = lazy(() => {
  return import('../pages/Receive/Receive').then((m) => ({
    default: m.Receive,
  }));
});

const Accounts = lazy(() => {
  return import('../pages/Accounts/Accounts').then((m) => ({
    default: m.Accounts,
  }));
});

const AccountManagerProvider = lazy(() => {
  return import('@core/ui').then((m) => ({
    default: m.AccountManagerProvider,
  }));
});

const AccountDetailsView = lazy(() => {
  return import('../pages/Accounts/AccountDetailsView').then((m) => ({
    default: m.AccountDetailsView,
  }));
});

const DefiProtocolDetails = lazy(() => {
  return import('../pages/DeFi/DefiProtocolDetails').then((m) => ({
    default: m.DefiProtocolDetails,
  }));
});

const LedgerTroubleshootingPopup = lazy(() => {
  return import('../pages/Ledger/LedgerTroubleshooting').then((m) => ({
    default: m.LedgerTroubleshooting,
  }));
});

const Keystone3TroubleshootingPopup = lazy(() => {
  return import('../pages/Keystone/Keystone3Troubleshooting').then((m) => ({
    default: m.Keystone3Troubleshooting,
  }));
});

const LedgerDeriveSolanaAddresses = lazy(() => {
  return import('../pages/Ledger/LedgerDeriveSolanaAddresses').then((m) => ({
    default: m.LedgerDeriveSolanaAddresses,
  }));
});

export const AppRoutes = () => (
  <Switch>
    <Route path="/ledger/troubleshooting">
      <Suspense fallback={<CircularProgress />}>
        <LedgerTroubleshootingPopup />
      </Suspense>
    </Route>
    <Route path="/keystone3/troubleshooting">
      <Suspense fallback={<CircularProgress />}>
        <Keystone3TroubleshootingPopup />
      </Suspense>
    </Route>
    <Route path="/ledger/derive-solana-addresses">
      <Suspense fallback={<CircularProgress />}>
        <LedgerDeriveSolanaAddresses />
      </Suspense>
    </Route>
    <Route path="/token/add">
      <Suspense fallback={<CircularProgress />}>
        <AddToken />
      </Suspense>
    </Route>
    <Route path="/home">
      <Home />
    </Route>
    <Route path="/ledger/connect">
      <Suspense fallback={<CircularProgress />}>
        <LedgerConnect />
      </Suspense>
    </Route>
    <Route path="/token">
      <Suspense fallback={<CircularProgress />}>
        <TokenFlowPage />
      </Suspense>
    </Route>
    <Route path="/collectible/send">
      <Suspense fallback={<CircularProgress />}>
        <CollectibleSend />
      </Suspense>
    </Route>
    <Route path="/collectible">
      <Suspense fallback={<CircularProgress />}>
        <CollectibleDetails />
      </Suspense>
    </Route>
    <Route path="/receive">
      <Suspense fallback={<CircularProgress />}>
        <Receive />
      </Suspense>
    </Route>
    <Route path="/send">
      <Suspense fallback={<LoadingSendForm withTitle />}>
        <SendPage />
      </Suspense>
    </Route>
    <Route path="/swap">
      <Suspense fallback={<CircularProgress />}>
        <Swap />
      </Suspense>
    </Route>
    <Route path="/bridge/transaction-status/:sourceBlockchain/:txHash/:txTimestamp">
      <Suspense fallback={<CircularProgress />}>
        <BridgeTransactionStatus />
      </Suspense>
    </Route>
    <Route path="/bridge">
      <Suspense fallback={<CircularProgress />}>
        <Bridge />
      </Suspense>
    </Route>
    <Route path="/manage-tokens/add">
      <Suspense fallback={<CircularProgress />}>
        <AddToken />
      </Suspense>
    </Route>
    <Route path="/manage-tokens">
      <Suspense fallback={<CircularProgress />}>
        <ManageTokensPage />
      </Suspense>
    </Route>
    <Route path="/manage-collectibles">
      <Suspense fallback={<CircularProgress />}>
        <ManageCollectiblesPage />
      </Suspense>
    </Route>
    <Route exact path="/networks">
      <Suspense fallback={<CircularProgress />}>
        <Networks />
      </Suspense>
    </Route>
    <Route path="/networks/add">
      <Suspense fallback={<CircularProgress />}>
        <AddNetwork />
      </Suspense>
    </Route>
    <Route path="/networks/details/:networkId">
      <Suspense fallback={<CircularProgress />}>
        <NetworkDetails />
      </Suspense>
    </Route>
    <Route path="/networks/edit/:networkId">
      <Suspense fallback={<CircularProgress size={100} />}>
        <EditNetwork />
      </Suspense>
    </Route>
    <Route path="/accounts" exact>
      <Suspense fallback={<CircularProgress />}>
        <AccountManagerProvider>
          <Accounts />
        </AccountManagerProvider>
      </Suspense>
    </Route>
    <Route path="/accounts/add-wallet/seedphrase">
      <Suspense fallback={<CircularProgress />}>
        <AddWalletWithSeedPhrase />
      </Suspense>
    </Route>
    <Route path="/accounts/add-wallet/keystore">
      <Suspense fallback={<CircularProgress />}>
        <AddWalletWithKeystoreFile />
      </Suspense>
    </Route>

    <Route path="/accounts/add-wallet/ledger">
      <Suspense fallback={<CircularProgress />}>
        <AddWalletWithLedger />
      </Suspense>
    </Route>
    <Route path="/accounts/:accountId">
      <Suspense fallback={<CircularProgress />}>
        <AccountManagerProvider>
          <AccountDetailsView />
        </AccountManagerProvider>
      </Suspense>
    </Route>
    <Route path="/export-private-key">
      <Suspense fallback={<CircularProgress />}>
        <ExportPrivateKey />
      </Suspense>
    </Route>
    <Route path="/import-private-key">
      <Suspense fallback={<CircularProgress />}>
        <ImportPrivateKeyPage />
      </Suspense>
    </Route>
    <Route path="/assets">
      <Suspense fallback={<CircularProgress />}>
        <Assets />
      </Suspense>
    </Route>

    <Route path="/defi/:protocolId">
      <Suspense fallback={<CircularProgress size={100} />}>
        <DefiProtocolDetails />
      </Suspense>
    </Route>

    <Route path="/import-with-walletconnect">
      <Suspense fallback={<CircularProgress size={100} />}>
        <ImportWithWalletConnect />
      </Suspense>
    </Route>

    <Route path="/fireblocks/import-with-walletconnect">
      <Suspense fallback={<CircularProgress size={100} />}>
        <ImportFireblocksWithWalletConnect />
      </Suspense>
    </Route>

    <Route path="/fireblocks/connect-bitcoin/:accountId">
      <Suspense fallback={<CircularProgress size={100} />}>
        <ConnectBitcoinWallet />
      </Suspense>
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

    <Route path="/update-recovery-methods">
      <Suspense fallback={<CircularProgress />}>
        <SeedlessUpdateRecoveryMethod />
      </Suspense>
    </Route>

    <Route path="/remove-totp">
      <Suspense fallback={<CircularProgress />}>
        <SeedlessRemoveTotp />
      </Suspense>
    </Route>

    <Route path="/">
      <Redirect to="/home" />
    </Route>
  </Switch>
);
