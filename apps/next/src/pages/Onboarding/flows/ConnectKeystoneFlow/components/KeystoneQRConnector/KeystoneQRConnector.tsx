import {
  Fade,
  getHexAlpha,
  Stack,
  Typography,
  useTheme,
} from '@avalabs/k2-alpine';
import { useTranslation } from 'react-i18next';
import { CryptoMultiAccounts } from '@keystonehq/bc-ur-registry-eth';
import { AnimatedQRScanner, Purpose, URType } from '@keystonehq/animated-qr';
import { FC, useState, useEffect, useCallback, useRef } from 'react';
import { getAddressPublicKeyFromXPub } from '@avalabs/core-wallets-sdk';

import { useCameraPermissions } from '@core/ui';

import {
  ErrorType,
  PublicKey,
  QRCodeDerivationStatus,
  QRCodeDerivedKeys,
} from '../../types';

import { Crosshair } from './Crosshair';
import { KeystoneQRError } from './KeystoneQRError';
import { buildAddressPublicKey, buildExtendedPublicKey } from './util';
import { EVM_BASE_DERIVATION_PATH } from '@core/types';

type KeystoneQRConnectorProps = {
  onQRCodeScanned: (info: QRCodeDerivedKeys) => void;
  onUnreadableQRCode?: (isDimensionsError: boolean) => void;
  accountIndexes: number[];
};

export const KeystoneQRConnector: FC<KeystoneQRConnectorProps> = ({
  onQRCodeScanned,
  onUnreadableQRCode,
  accountIndexes,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [status, setStatus] = useState<QRCodeDerivationStatus>('waiting');
  const [error, setError] = useState<ErrorType>();
  const attempts = useRef<number[]>([]);

  const getAddressPublicKeys = useCallback(
    async (extendedPublicKeyHex: string) => {
      const keys: PublicKey[] = [];
      for (const index of accountIndexes) {
        const evmKey = await getAddressPublicKeyFromXPub(
          extendedPublicKeyHex,
          index,
        );
        keys.push({
          index,
          key: buildAddressPublicKey(evmKey, index),
        });
      }

      return keys;
    },
    [accountIndexes],
  );

  const handleScan = useCallback(
    async ({ cbor }: { type: string; cbor: string }) => {
      attempts.current = [];
      const buffer = Buffer.from(cbor, 'hex');
      const cryptoMultiAccounts = CryptoMultiAccounts.fromCBOR(buffer);

      const masterFingerprint = cryptoMultiAccounts.getMasterFingerprint();
      const keys = cryptoMultiAccounts.getKeys();

      const key = keys[0];

      if (key) {
        onQRCodeScanned({
          extendedPublicKeys: [
            buildExtendedPublicKey(key.getBip32Key(), EVM_BASE_DERIVATION_PATH),
          ],
          addressPublicKeys: await getAddressPublicKeys(key.getBip32Key()),
          masterFingerprint: masterFingerprint.toString('hex'),
        });
      }
    },
    [onQRCodeScanned, getAddressPublicKeys],
  );

  const handleUnreadableQRCode = useCallback(
    (isDimensionsError: boolean) => {
      setStatus('error');
      setError('invalid-qr-code');
      onUnreadableQRCode?.(isDimensionsError);
    },
    [setError, setStatus, onUnreadableQRCode],
  );

  const handleError = useCallback(
    (errMessage) => {
      if (!/^Dimensions/i.test(errMessage)) {
        handleUnreadableQRCode(false);
        return;
      }

      attempts.current.push(Date.now());
      if (attempts.current.length === 5) {
        if (
          attempts.current[4] &&
          attempts.current[0] &&
          attempts.current[4] - attempts.current[0] < 500
        ) {
          handleUnreadableQRCode(true);
          return;
        }
        attempts.current = [];
      }
    },
    [handleUnreadableQRCode],
  );

  const { permissions, prompt } = useCameraPermissions();

  useEffect(() => {
    if (permissions === 'denied') {
      setError('camera-access-denied');
      setStatus('error');
      prompt();
    } else if (permissions === 'granted') {
      setError(undefined);
      setStatus('scanning');
    } else if (permissions === 'prompt') {
      setError(undefined);
      setStatus('waiting');
    }
  }, [permissions, prompt]);

  const onRetry = useCallback(() => {
    if (error === 'camera-access-denied') {
      prompt();
    } else if (error === 'invalid-qr-code') {
      setStatus('waiting');
    }
  }, [error, prompt]);

  return (
    <Stack gap={3} height="100%" width="100%">
      <Stack
        sx={{
          borderRadius: theme.shape.largeBorderRadius,
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          flexGrow: 1,
          backgroundColor: theme.palette.common.black,
          maxHeight: 340,
        }}
      >
        {status === 'scanning' && (
          <Stack
            sx={{
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: theme.shape.largeBorderRadius,
              overflow: 'hidden',
              width: '100%',
              height: '100%',
            }}
          >
            <AnimatedQRScanner
              handleError={handleError}
              handleScan={handleScan}
              purpose={Purpose.SYNC}
              urTypes={[URType.CRYPTO_MULTI_ACCOUNTS]}
              options={{
                width: '100%',
                height: '100%',
              }}
            />
          </Stack>
        )}
        <Fade in={Boolean(error)} mountOnEnter unmountOnExit>
          <KeystoneQRError errorType={error!} onRetry={onRetry} />
        </Fade>
        <Crosshair
          color={
            status === 'error'
              ? getHexAlpha(theme.palette.primary.main, 10)
              : theme.palette.warning.main
          }
        />
      </Stack>
      <Typography
        variant="caption"
        color="text.secondary"
        textAlign="center"
        px={{ xs: 0, sm: 16 }}
      >
        {t(
          `If you block access, look in the left side of the browser's address bar to enable camera access.`,
        )}
      </Typography>
    </Stack>
  );
};
