import { useCallback, useEffect, useState } from 'react';
import { Trans } from 'react-i18next';
import {
  Button,
  CircularProgress,
  Stack,
  Typography,
  useTheme,
} from '@avalabs/core-k2-components';

import { useSolanaAddressInfo } from '@src/hooks/useSolanaAddressInfo';
import { useSolanaPublicKeys } from '@src/pages/Ledger/hooks/useSolanaPublicKeys';
import { DerivedAddresses } from '@src/pages/Onboarding/components/DerivedAddresses';
import { DerivedAddressInfo, SolanaPublicKey } from '@src/pages/Ledger/models';

interface SolanaLedgerConnectorProps {
  onSuccess: (keys: SolanaPublicKey[]) => void;
  onFailure: () => void;
  onTroubleshoot: () => void;
  numberOfKeys: number;
}
export function LedgerConnectorSolana({
  onSuccess,
  onFailure,
  onTroubleshoot,
  numberOfKeys,
}: SolanaLedgerConnectorProps) {
  const theme = useTheme();
  const { getAddressInfo } = useSolanaAddressInfo();
  const { retrieveKeys, status } = useSolanaPublicKeys();

  const [addresses, setAddresses] = useState<DerivedAddressInfo[]>([]);
  const [keys, setKeys] = useState<SolanaPublicKey[]>([]);

  const fetchBalances = useCallback(
    async (keysToFetch: SolanaPublicKey[]) => {
      setAddresses([]);

      for (const key of keysToFetch) {
        const addressInfo = await getAddressInfo(key.key);
        setAddresses((prev) => [...prev, addressInfo]);
      }
    },
    [getAddressInfo],
  );

  const fetchKeys = useCallback(async () => {
    const accountIndexes = Array.from({ length: numberOfKeys }, (_, i) => i);

    retrieveKeys(accountIndexes)
      .then((retrievedKeys) => {
        setKeys(retrievedKeys);
        onSuccess(retrievedKeys);
        fetchBalances(retrievedKeys);
      })
      .catch((err) => {
        console.error('Failed to derive Solana keys', err);
        onFailure();
      });
  }, [fetchBalances, numberOfKeys, onSuccess, retrieveKeys, onFailure]);

  // Attempt to automatically connect as soon as we establish the transport.
  useEffect(() => {
    if (status === 'ready' && !keys.length) {
      fetchKeys();
    }
  }, [fetchKeys, status, keys]);

  return (
    <Stack
      sx={{
        width: theme.spacing(44),
        alignSelf: 'center',
        mt: 7.5,
        flexGrow: 1,
        justifyContent: 'center',
      }}
    >
      <Stack
        sx={{
          rowGap: 5,
          alignItems: 'center',
          flexGrow: 1,
          justifyContent: 'space-between',
        }}
      >
        {status === 'waiting' && (
          <>
            <CircularProgress size={40} />
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              <Trans
                i18nKey="Unable to connect? See the troubleshooting guide <btn>here</btn>."
                components={{
                  btn: (
                    <Button
                      variant="text"
                      size="small"
                      sx={{ p: 0, m: 0, minWidth: 0, height: 12, ml: 0.5 }}
                      onClick={onTroubleshoot}
                    />
                  ),
                }}
              />
            </Typography>
          </>
        )}
        {status === 'ready' && (
          <DerivedAddresses
            addresses={addresses}
            balanceSymbol="SOL"
            numberOfExpectedAddresses={numberOfKeys}
          />
        )}
      </Stack>
    </Stack>
  );
}
