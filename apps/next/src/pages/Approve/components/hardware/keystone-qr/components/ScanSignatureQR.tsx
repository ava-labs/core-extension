import {
  Box,
  Fade,
  getHexAlpha,
  Stack,
  Typography,
  useTheme,
} from '@avalabs/k2-alpine';
import { useTranslation } from 'react-i18next';
import { FC, useCallback, useMemo } from 'react';
import { RegistryTypes } from '@keystonehq/bc-ur-registry-eth';
import { AnimatedQRScanner, URType } from '@keystonehq/animated-qr';

import { VideoFeedCrosshair } from '@/components/keystone';

import { StateComponentProps } from '../types';
import { VideoFeedContainer } from './VideoFeedContainer';
import { QRErrorMessage } from './QRErrorMessage';

export const ScanSignatureQR: FC<StateComponentProps> = ({ state }) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const {
    permissions,
    txRequest,
    submitSignature,
    isSubmitting,
    setIsSubmitting,
    error,
    setHasQRError,
  } = state;

  const submit = useCallback(
    async (cbor: string, type: string) => {
      if (!txRequest) {
        return;
      }

      await submitSignature({
        requestId: txRequest.requestId,
        cbor,
        type,
      });
    },
    [submitSignature, txRequest],
  );

  const handleScan = useCallback(
    async ({ cbor, type }) => {
      // Prevent scanning too early, or more than once
      if (!txRequest || isSubmitting) {
        return;
      }

      setIsSubmitting(true);

      try {
        await submit(cbor, type);
      } catch (_err) {
        setIsSubmitting(false);
      }
    },
    [submit, isSubmitting, txRequest, setIsSubmitting],
  );

  const handleError = useCallback(
    (err: string) => {
      if (!err || err.includes('Dimensions')) {
        // The component continously scans and raises an undefined error
        // when it's not able to find the QR code.
        return;
      }

      setHasQRError(true);
    },
    [setHasQRError],
  );

  const scannerProps = useMemo(
    () => ({
      urTypes: [
        URType.EVM_SIGNATURE,
        URType.ETH_SIGNATURE,
        RegistryTypes.CRYPTO_PSBT.getType(),
      ],
      handleError,
      handleScan,
      options: {
        width: 296,
        height: 240,
      },
    }),
    [handleError, handleScan],
  );

  return (
    <>
      <Stack width="100%" height="100%" gap={2}>
        <Stack
          gap={1}
          flexGrow={1}
          alignItems="center"
          justifyContent="space-between"
        >
          <VideoFeedContainer>
            <Box sx={{ opacity: error === 'invalid-qr-code' ? 0.2 : 1 }}>
              <AnimatedQRScanner {...scannerProps} />
            </Box>

            <Fade in={Boolean(error)} mountOnEnter unmountOnExit>
              <QRErrorMessage errorType={error!} />
            </Fade>
            <VideoFeedCrosshair
              size={128}
              color={
                error
                  ? getHexAlpha(theme.palette.primary.main, 10)
                  : theme.palette.warning.main
              }
            />
          </VideoFeedContainer>
          <Stack gap={0.5} textAlign="center" px={5}>
            {permissions === 'granted' ? (
              <>
                <Typography variant="body3" fontWeight={500}>
                  {t('Scan the QR code displayed on your Keystone device')}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {t('Position the QR code in front of your webcam')}
                </Typography>
              </>
            ) : (
              <Typography variant="caption" color="text.secondary">
                {t('You need to grant access to the camera feed first.')}
              </Typography>
            )}
          </Stack>
        </Stack>
      </Stack>
      {/* {permissions !== 'granted' && (
				// TODO: We need to do this in a full screen tab
          <Button
            fullWidth
            variant="contained"
            size="extension"
            color="primary"
            onClick={() => prompt()}
          >
            {t('Grant access')}
          </Button>
        )} */}
    </>
  );
};
