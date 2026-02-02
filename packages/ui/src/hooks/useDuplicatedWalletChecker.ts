import { useCallback } from 'react';

import { ExtensionRequest, IsKnownSecretResult, SecretType } from '@core/types';
import type { CheckIfWalletExists } from '@core/service-worker';

import { useConnectionContext } from '../contexts';

export const useDuplicatedWalletChecker = () => {
  const { request } = useConnectionContext();

  const checkIfWalletExists = useCallback(
    async (
      secretType: SecretType.LedgerLive | SecretType.Ledger,
      secret: string,
    ): Promise<IsKnownSecretResult> => {
      return await request<CheckIfWalletExists>({
        method: ExtensionRequest.WALLET_CHECK_IF_EXISTS,
        params: [secretType, secret],
      });
    },
    [request],
  );

  return checkIfWalletExists;
};
