import { DerivedKeys } from '@/components/ConnectLedger/LedgerConnector/types';
import { ExtensionRequest, SecretType } from '@core/types';
import { useConnectionContext } from '@core/ui';
import { useCallback } from 'react';
import { ImportLedgerHandlerNew } from '~/index';

export function useChangeDerivationPath(
  secretType: SecretType.Ledger | SecretType.LedgerLive,
) {
  const { request } = useConnectionContext();

  const submitLedgerNew = useCallback(
    async (
      walletName: string | undefined,
      { addressPublicKeys, extendedPublicKeys }: DerivedKeys,
    ) => {
      if (!addressPublicKeys || !extendedPublicKeys) {
        throw new Error('Missing public keys');
      }

      await request<ImportLedgerHandlerNew>({
        method: ExtensionRequest.WALLET_IMPORT_LEDGER_NEW,
        params: [
          {
            name: walletName,
            extendedPublicKeys,
            addressPublicKeys: addressPublicKeys.map(({ key }) => key),
            secretType,
          },
        ],
      });
    },
    [request, secretType],
  );

  return submitLedgerNew;
}
