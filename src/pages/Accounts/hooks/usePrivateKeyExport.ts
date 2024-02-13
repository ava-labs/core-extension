import { useCallback, useMemo } from 'react';
import { useHistory } from 'react-router-dom';

import { WalletType } from '@src/background/services/wallet/models';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';
import { Account, AccountType } from '@src/background/services/accounts/models';

export const usePrivateKeyExport = (
  account?: Account,
  walletType?: WalletType
) => {
  const { capture } = useAnalyticsContext();
  const history = useHistory();

  const isPrivateKeyAvailable = useMemo(
    () =>
      account?.type === AccountType.IMPORTED ||
      (account?.type === AccountType.PRIMARY &&
        walletType === WalletType.MNEMONIC),
    [account?.type, walletType]
  );

  const showPrivateKey = useCallback(
    (e: Event) => {
      capture('ExportPrivateKeyClicked');
      e.stopPropagation();
      history.push(`/export-private-key?accountId=${account?.id}`);
    },
    [account?.id, capture, history]
  );

  return {
    showPrivateKey,
    isPrivateKeyAvailable,
  };
};
