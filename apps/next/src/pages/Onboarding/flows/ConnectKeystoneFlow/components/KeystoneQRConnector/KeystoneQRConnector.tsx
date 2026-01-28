import {
  Fade,
  getHexAlpha,
  Stack,
  Typography,
  useTheme,
} from '@avalabs/k2-alpine';
import { useTranslation } from 'react-i18next';
import { CryptoMultiAccounts } from '@keystonehq/bc-ur-registry-eth';
import { FC, useState, useEffect, useCallback, useRef } from 'react';
import { getAddressPublicKeyFromXPub } from '@avalabs/core-wallets-sdk';

import { useCameraPermissions } from '@core/ui';
import { EVM_BASE_DERIVATION_PATH, ExtendedPublicKey } from '@core/types';
import { getAvalancheExtendedKeyPath } from '@core/common';

import { VideoFeedCrosshair } from '@/components/keystone';

import {
  ErrorType,
  PublicKey,
  QRCodeDerivationStatus,
  DerivedKeys,
} from '../../types';
import { buildAddressPublicKey, buildExtendedPublicKey } from '../../util';

import { QRCodeScanner } from './QRCodeScanner';
import { KeystoneQRError } from './KeystoneQRError';
import { QRCodeScannerContainer } from './QRCodeScannerContainer';

type KeystoneQRConnectorProps = {
  onQRCodeScanned: (info: DerivedKeys) => void;
  onUnreadableQRCode?: (isDimensionsError: boolean) => void;
  minNumberOfKeys: number;
};

export const KeystoneQRConnector: FC<KeystoneQRConnectorProps> = ({
  onQRCodeScanned,
  onUnreadableQRCode,
  minNumberOfKeys,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [status, setStatus] = useState<QRCodeDerivationStatus>('waiting');
  const [error, setError] = useState<ErrorType>();
  const attempts = useRef<number[]>([]);

  const getAddressPublicKeys = useCallback(
    async (extendedPublicKeyHex: string) => {
      const keys: PublicKey[] = [];
      const startingIndexes = Array.from(
        { length: minNumberOfKeys },
        (_, i) => i,
      );
      for (const index of startingIndexes) {
        const evmKey = await getAddressPublicKeyFromXPub(
          extendedPublicKeyHex,
          index,
        );
        keys.push({
          index,
          vm: 'EVM',
          key: buildAddressPublicKey(evmKey, index, 'EVM'),
        });
      }

      return keys;
    },
    [minNumberOfKeys],
  );

  const getAvmAddressPublicKeys = useCallback(
    async (extendedPublicKeyHex: string) => {
      const keys: PublicKey[] = [];
      const startingIndexes = Array.from(
        { length: minNumberOfKeys },
        (_, i) => i,
      );
      for (const index of startingIndexes) {
        const avmKey = await getAddressPublicKeyFromXPub(
          extendedPublicKeyHex,
          index,
        );
        keys.push({
          index,
          vm: 'AVM',
          key: buildAddressPublicKey(avmKey, index, 'AVM'),
        });
      }

      return keys;
    },
    [minNumberOfKeys],
  );

  const handleUnreadableQRCode = useCallback(
    (isDimensionsError: boolean) => {
      setStatus('error');
      setError('invalid-qr-code');
      onUnreadableQRCode?.(isDimensionsError);
    },
    [setError, setStatus, onUnreadableQRCode],
  );

  const handleScan = useCallback(
    async ({ cbor }: { type: string; cbor: string }) => {
      attempts.current = [];
      const buffer = Buffer.from(cbor, 'hex');
      const cryptoMultiAccounts = CryptoMultiAccounts.fromCBOR(buffer);

      const masterFingerprint = cryptoMultiAccounts.getMasterFingerprint();
      const allKeys = cryptoMultiAccounts.getKeys();

      const extendedPublicKeys: ExtendedPublicKey[] = [];
      let evmAddressPublicKeys: PublicKey[] = [];
      let avmAddressPublicKeys: PublicKey[] = [];

      for (const key of allKeys) {
        const path = key.getOrigin()?.getPath();
        const xpub = key.getBip32Key();

        if (path?.includes("44'/60'")) {
          extendedPublicKeys.push(
            buildExtendedPublicKey(xpub, EVM_BASE_DERIVATION_PATH),
          );
          evmAddressPublicKeys = await getAddressPublicKeys(xpub);
        } else if (path?.includes("44'/9000'")) {
          extendedPublicKeys.push(
            buildExtendedPublicKey(xpub, getAvalancheExtendedKeyPath(0)),
          );
          avmAddressPublicKeys = await getAvmAddressPublicKeys(xpub);
        }
      }

      if (extendedPublicKeys.length > 0) {
        onQRCodeScanned({
          extendedPublicKeys,
          addressPublicKeys: [...evmAddressPublicKeys, ...avmAddressPublicKeys],
          masterFingerprint: masterFingerprint.toString('hex'),
        });
      } else {
        console.error('[Keystone] Invalid QR code: no valid keys found');
        handleUnreadableQRCode(false);
      }
    },
    [
      onQRCodeScanned,
      getAddressPublicKeys,
      getAvmAddressPublicKeys,
      handleUnreadableQRCode,
    ],
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
      <QRCodeScannerContainer>
        {status === 'scanning' && (
          <QRCodeScanner handleError={handleError} handleScan={handleScan} />
        )}
        <Fade in={Boolean(error)} mountOnEnter unmountOnExit>
          <KeystoneQRError errorType={error!} onRetry={onRetry} />
        </Fade>
        <VideoFeedCrosshair
          color={
            status === 'error'
              ? getHexAlpha(theme.palette.primary.main, 10)
              : theme.palette.warning.main
          }
        />
      </QRCodeScannerContainer>
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
