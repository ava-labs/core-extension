import { useCallback, useEffect, useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from '@avalabs/core-k2-components';
import {
  AnimatedQRCode,
  AnimatedQRScanner,
  URType,
} from '@keystonehq/animated-qr';
import { RegistryTypes } from '@keystonehq/bc-ur-registry-eth';

import { Overlay } from 'packages/ui/src/components/common/Overlay';
import { PageTitle } from 'packages/ui/src/components/common/PageTitle';
import useIsUsingKeystoneWallet from '@src/hooks/useIsUsingKeystoneWallet';
import useCameraPermissions from '@src/hooks/useCameraPermissions';
import { useKeystoneContext } from '@src/contexts/KeystoneProvider';
import { CameraAccessDeniedDialog } from 'packages/ui/src/components/common/CameraAccessDeniedDialog';
import { CameraAccessPromptDialog } from 'packages/ui/src/components/common/CameraAccessPromptDialog';
import { InvalidQRCodeDialog } from 'packages/ui/src/components/common/InvalidQRCodeDialog';

interface KeystoneApprovalOverlayProps {
  onReject?: () => void;
}

enum KeystoneApprovalStep {
  SCAN_WITH_KEYSTONE = 0,
  SCAN_FROM_KEYSTONE = -1,
}

export function KeystoneApprovalOverlay({
  onReject,
}: KeystoneApprovalOverlayProps) {
  const { t } = useTranslation();
  const isUsingKeystoneWallet = useIsUsingKeystoneWallet();
  const [step, setStep] = useState(KeystoneApprovalStep.SCAN_WITH_KEYSTONE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const { txRequest, submitSignature } = useKeystoneContext();
  const [hasQRError, setHasQRError] = useState(false);
  const [showAccessDeniedDialog, setShowAccessDeniedDialog] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (txRequest) {
      setStep(KeystoneApprovalStep.SCAN_WITH_KEYSTONE);
      setIsSubmitting(false);
    }
  }, [txRequest]);

  useEffect(() => {
    if (!isSubmitting && hasSubmitted) {
      setShowAlert(true);
    }
  }, [hasSubmitted, isSubmitting]);

  const onBackClick = useCallback(() => {
    if (step === KeystoneApprovalStep.SCAN_WITH_KEYSTONE) {
      onReject?.();
    } else {
      setStep(KeystoneApprovalStep.SCAN_WITH_KEYSTONE);
    }
  }, [step, onReject]);

  const submitTx = useCallback(
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
      if (step !== KeystoneApprovalStep.SCAN_FROM_KEYSTONE || isSubmitting) {
        return;
      }

      setIsSubmitting(true);
      setHasSubmitted(true);

      try {
        await submitTx(cbor, type);
      } catch (_err) {
        setHasQRError(true);
        setIsSubmitting(false);
      }
    },
    [submitTx, isSubmitting, step],
  );

  const handleError = useCallback((error: string) => {
    if (!error || error.includes('Dimensions')) {
      // The component continously scans and raises an undefined error
      // when it's not able to find the QR code.
      return;
    }

    setHasQRError(true);
  }, []);

  const { permissions, refreshPermissions } = useCameraPermissions();
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
        width: !isSubmitting && permissions === 'granted' ? 220 : 1,
        height: !isSubmitting && permissions === 'granted' ? 220 : 1,
      },
    }),
    [handleError, handleScan, isSubmitting, permissions],
  );

  const QRScanner = useMemo(() => {
    const Scanner = () => <AnimatedQRScanner {...scannerProps} />;

    return Scanner;
  }, [scannerProps]);

  useEffect(() => {
    setShowAccessDeniedDialog(permissions === 'denied');
  }, [permissions]);

  if (!isUsingKeystoneWallet || !txRequest) {
    return null;
  }

  return (
    <Overlay isBackgroundFilled>
      <Stack
        sx={{
          width: '100%',
          height: '100%',
          pt: 2,
          pb: 3,
          gap: showAlert ? 1.5 : 2,
        }}
      >
        {showAlert && (
          <Alert
            severity="info"
            onClose={() => setShowAlert(false)}
            sx={{ mx: 2 }}
          >
            <AlertTitle>{t('This is a new approval')}</AlertTitle>
            {t('This transaction requires multiple approvals.')}
          </Alert>
        )}

        <PageTitle onBackClick={onBackClick} margin="0">
          {t('Scan QR Code')}
        </PageTitle>
        <Box sx={{ width: '100%', overflowX: 'hidden', overflowY: 'hidden' }}>
          <Stack
            sx={{
              width: '200%',
              flexDirection: 'row',
              transition: 'transform 0.1s ease-in-out',
              transform: `translateX(calc(50% * ${step}))`,
            }}
          >
            <Stack
              sx={{
                gap: showAlert ? 2.5 : 5,
                alignItems: 'center',
                flex: 1,
                px: 2,
              }}
            >
              <Typography variant="body1">
                <Trans
                  i18nKey="Scan the QR code with your <deviceName>Keystone device</deviceName>"
                  components={{
                    deviceName: <Typography variant="h6" component="span" />,
                  }}
                />
              </Typography>
              {txRequest ? (
                <AnimatedQRCode
                  cbor={txRequest.cbor}
                  type={txRequest.type}
                  options={{ size: 220 }}
                />
              ) : (
                <CircularProgress size={100} />
              )}
              <Typography
                variant="body2"
                color="text.secondary"
                textAlign="center"
              >
                {t(
                  `Click on the 'Get Signature' button after signing the transaction with your Keystone device.`,
                )}
              </Typography>
            </Stack>
            <Stack
              sx={{
                gap: 5,
                alignItems: 'center',
                flex: 1,
                px: showAlert ? 1.5 : 2,
              }}
            >
              <Typography variant="body1">
                <Trans
                  i18nKey="Scan the QR code displayed on your <deviceName>Keystone device</deviceName>"
                  components={{
                    deviceName: <Typography variant="h6" component="span" />,
                  }}
                />
              </Typography>
              {/* Save space for the scanner feed */}
              <Stack
                sx={{
                  minHeight: 220,
                  justifyContent: 'center',
                }}
              >
                {isSubmitting && <CircularProgress size={100} />}
                <QRScanner />
              </Stack>
              <Typography variant="body2" color="text.secondary">
                {t('Position the QR code in front of your camera.')}
              </Typography>
            </Stack>
            {step === KeystoneApprovalStep.SCAN_FROM_KEYSTONE && (
              <>
                {hasQRError && (
                  <InvalidQRCodeDialog
                    onRetry={() => {
                      setHasQRError(false);
                      setIsSubmitting(false);
                    }}
                  />
                )}
                {showAccessDeniedDialog && (
                  <CameraAccessDeniedDialog
                    refreshPermissions={refreshPermissions}
                  />
                )}
                {!permissions ||
                  (permissions === 'prompt' && (
                    <CameraAccessPromptDialog QRScanner={QRScanner} />
                  ))}
              </>
            )}
          </Stack>
        </Box>
        <Stack
          sx={{
            flexDirection: 'row',
            alignItems: 'flex-end',
            width: '100%',
            flexGrow: 1,
            justifyContent: 'space-between',
            px: 2,
            gap: 1,
          }}
        >
          <Button
            color="secondary"
            data-testid="transaction-keystone-reject-btn"
            size="large"
            onClick={onReject}
            fullWidth
            disabled={isSubmitting}
          >
            {t('Reject')}
          </Button>
          {step === KeystoneApprovalStep.SCAN_WITH_KEYSTONE && (
            <Button
              data-testid="transaction-keystone-approve-btn"
              size="large"
              onClick={() => setStep(KeystoneApprovalStep.SCAN_FROM_KEYSTONE)}
              fullWidth
            >
              {t('Get Signature')}
            </Button>
          )}
        </Stack>
      </Stack>
    </Overlay>
  );
}
