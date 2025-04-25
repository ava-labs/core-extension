import { useCallback, useMemo } from 'react';
import { useHistory } from 'react-router-dom';

import { useAnalyticsContext } from '@/contexts/AnalyticsProvider';
import { Account, AccountType, SecretType } from '@core/types';

export const usePrivateKeyExport = (
  account?: Account,
  walletType?: SecretType,
) => {
  const { capture } = useAnalyticsContext();
  const history = useHistory();

  const isPrivateKeyAvailable = useMemo(
    () =>
      account?.type === AccountType.IMPORTED ||
      (account?.type === AccountType.PRIMARY &&
        walletType === SecretType.Mnemonic),
    [account?.type, walletType],
  );

  const showPrivateKey = useCallback(
    (e: Event) => {
      capture('ExportPrivateKeyClicked');
      e.stopPropagation();
      history.push(`/export-private-key?accountId=${account?.id}`);
    },
    [account?.id, capture, history],
  );

  return {
    showPrivateKey,
    isPrivateKeyAvailable,
  };
};
