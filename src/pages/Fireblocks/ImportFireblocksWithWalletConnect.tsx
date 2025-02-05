import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';
import { useCallback, useState } from 'react';

import type { OnConnectCallback } from '../../contexts/WalletConnectContextProvider/models';
import ImportWithWalletConnect from '../ImportWithWalletConnect/ImportWithWalletConnect';

import { FireblocksAvatar } from './components/FireblocksAvatar';
import { FireblocksBitcoinDialog } from './components/FireblocksBitcoinDialog';

export default function ImportFireblocksWithWalletConnect() {
  const { capture } = useAnalyticsContext();
  const [isBtcDialogVisible, setIsBtcDialogVisible] = useState(false);
  const [importedAccountId, setImportedAccountId] = useState('');

  const onSuccessfullConnection: OnConnectCallback = useCallback(
    ({ accountId }) => {
      capture('ImportWithFireblocks_Success_EVM');
      setImportedAccountId(accountId);
      setIsBtcDialogVisible(true);
    },
    [capture],
  );

  return (
    <>
      <ImportWithWalletConnect
        onConnect={onSuccessfullConnection}
        appIcon={<FireblocksAvatar />}
      />
      {isBtcDialogVisible && (
        <FireblocksBitcoinDialog accountId={importedAccountId} />
      )}
    </>
  );
}
