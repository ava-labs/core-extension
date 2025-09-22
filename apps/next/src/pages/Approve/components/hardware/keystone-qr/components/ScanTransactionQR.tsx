import { Button, Stack, Typography } from '@avalabs/k2-alpine';
import { FC } from 'react';
import { AnimatedQRCode } from '@keystonehq/animated-qr';
import { useTranslation } from 'react-i18next';

import { StateComponentProps } from '../types';

export const ScanTransactionQR: FC<StateComponentProps> = ({ state }) => {
  const { t } = useTranslation();

  const { txRequest, requestSignature } = state;

  if (!txRequest) {
    return null;
  }

  return (
    <>
      <Stack
        gap={1}
        flexGrow={1}
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        px={5}
      >
        <AnimatedQRCode
          cbor={txRequest.cbor}
          type={txRequest.type}
          options={{ size: 150 }}
        />
        <Stack gap={0.5}>
          <Typography variant="body3" fontWeight={500}>
            {t('Scan the QR code with your Keystone device')}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {t(
              'Click on the “Get signature” button after signing the transaction with your Keystone device',
            )}
          </Typography>
        </Stack>
      </Stack>
      <Stack>
        <Button
          variant="contained"
          size="extension"
          color="primary"
          onClick={requestSignature}
        >
          {t('Get signature')}
        </Button>
      </Stack>
    </>
  );
};
