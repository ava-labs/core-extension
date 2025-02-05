import type { Dispatch, SetStateAction } from 'react';
import { useEffect, useState, useCallback, useRef } from 'react';
import {
  Stack,
  Typography,
  Button,
  ExternalLinkIcon,
  useTheme,
  XIcon,
} from '@avalabs/core-k2-components';
import { Overlay } from '@src/components/common/Overlay';
import { useTranslation } from 'react-i18next';
import { CryptoMultiAccounts } from '@keystonehq/bc-ur-registry-eth';
import { useKeystoneScannerContents } from '@src/hooks/useKeystoneScannerContents';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';

export const KEYSTONE_CONNECT_SUPPORT_URL =
  'https://support.keyst.one/getting-started/new-how-to-sync-keystone-with-compatible-software-wallets';

interface KeystoneProps {
  onCancel(): void;
  setXPubKey: (newValue: string) => void;
  setMasterFingerPrint: Dispatch<SetStateAction<string>>;
  onSuccess(): void;
}

const promptAccess = (setCameraPermission) => {
  navigator.mediaDevices
    .getUserMedia({
      video: true,
    })
    .then(() => {
      setCameraPermission('granted');
    })
    .catch(() => {
      setCameraPermission('denied');
    });
};

export const KeystoneQRCodeScanner = ({
  onCancel,
  setXPubKey,
  setMasterFingerPrint,
  onSuccess,
}: KeystoneProps) => {
  const { t } = useTranslation();
  const { palette } = useTheme();
  const { capture } = useAnalyticsContext();
  const theme = useTheme();

  const [cameraPermission, setCameraPermission] = useState<PermissionState>();
  const [hasError, setHasError] = useState(false);
  const attempts = useRef<number[]>([]);

  const handleScan = useCallback(
    ({ cbor }: { type: string; cbor: string }) => {
      attempts.current = [];
      const buffer = Buffer.from(cbor, 'hex');
      const cryptoMultiAccounts = CryptoMultiAccounts.fromCBOR(buffer);

      const masterFingerprint = cryptoMultiAccounts.getMasterFingerprint();
      setMasterFingerPrint(masterFingerprint.toString('hex'));
      const keys = cryptoMultiAccounts.getKeys();

      const key = keys[0];

      if (key) {
        const xpub = key.getBip32Key();
        setXPubKey(xpub);
        capture(`KeystoneScanQRCodeSuccess`);
        onSuccess();
      }
    },
    [capture, onSuccess, setMasterFingerPrint, setXPubKey],
  );

  const handleError = useCallback(
    (error) => {
      if (!/^Dimensions/i.test(error)) {
        capture(`KeystoneScanQRCodeError`);
        setHasError(true);
        return;
      }
      attempts.current.push(Date.now());
      if (attempts.current.length === 5) {
        if (
          attempts.current[4] &&
          attempts.current[0] &&
          attempts.current[4] - attempts.current[0] < 500
        ) {
          capture(`KeystoneScanQRCodeDimensionsError`);
          setHasError(true);
          return;
        }
        attempts.current = [];
      }
    },
    [capture],
  );

  const pageContent = useKeystoneScannerContents({
    cameraPermission,
    hasError,
    setHasError,
    handleScan,
    handleError,
  });

  useEffect(() => {
    promptAccess(setCameraPermission);
  }, []);

  useEffect(() => {
    async function getPermissions() {
      const permission = await navigator.permissions.query({
        name: 'camera' as PermissionName, // workaround to avoid the ts error
      });
      permission.onchange = () => {
        promptAccess(setCameraPermission);
        if (permission.state === 'denied') {
          capture(`KeystoneScanQRCameraAccessDenied`);
        }
      };
    }
    getPermissions();
  }, [capture]);

  return (
    <Overlay>
      <Stack
        sx={{
          width: '512px',
          minHeight: '495px',
          background: palette.background.paper,
          borderRadius: 1,
        }}
      >
        <Stack
          sx={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            pt: 2,
            px: 2,
          }}
        >
          <Typography
            variant="h4"
            sx={{
              pt: 3,
              px: 4,
            }}
            data-testid={`keystone-modal-header`}
          >
            {pageContent?.headLine}
          </Typography>
          <Button
            variant="text"
            data-testid={`keystone-modal-close-button`}
            onClick={onCancel}
            sx={{
              p: 0,
              height: theme.spacing(3),
              width: theme.spacing(3),
              minWidth: theme.spacing(3),
            }}
          >
            <XIcon size={24} sx={{ color: 'primary.main' }} />
          </Button>
        </Stack>
        <Stack
          sx={{
            flexGrow: 1,
            pt: 1,
            px: 6,
          }}
        >
          <Typography variant="body2" minHeight={40}>
            {pageContent?.description}
          </Typography>
          <Stack
            sx={{
              alignItems: 'center',
              height: '100%',
              justifyContent: 'center',
              flexGrow: 1,
            }}
          >
            {pageContent?.content}
          </Stack>
        </Stack>
        <Stack
          sx={{
            width: '100%',
            justifyItems: 'space-between',
            alignContent: 'center',
            mb: 3,
            rowGap: 2,
            pt: 1,
            px: 6,
          }}
        >
          {pageContent?.helperText}
          <Button
            variant="text"
            onClick={() => {
              window.open(KEYSTONE_CONNECT_SUPPORT_URL, '_blank', 'noreferrer');
            }}
          >
            <ExternalLinkIcon
              size={16}
              sx={{ color: 'secondary.main', marginRight: 1 }}
            />
            <Typography
              variant="caption"
              sx={{
                color: 'secondary.main',
                fontWeight: 600,
              }}
            >
              {t('Keystone Support')}
            </Typography>
          </Button>
        </Stack>
      </Stack>
    </Overlay>
  );
};
