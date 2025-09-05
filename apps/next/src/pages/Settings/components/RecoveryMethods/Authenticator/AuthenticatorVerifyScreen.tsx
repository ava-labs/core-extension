import { Button, Stack, toast, Typography, useTheme } from '@avalabs/k2-alpine';
import QRCode from 'qrcode.react';
import { useTranslation } from 'react-i18next';

export const AuthenticatorVerifyScreen = ({ totpChallenge, onNext }) => {
  console.log('AuthenticatorVerifyScreen: ', totpChallenge);
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Stack
      gap={4}
      justifyContent="center"
      alignItems="center"
      height="100%"
      width="100%"
    >
      <QRCode
        renderAs="svg"
        fgColor={theme.palette.common.black}
        bgColor={theme.palette.common.white}
        value={totpChallenge.totpUrl}
        level="H"
        size={188}
      />
      <Stack maxWidth={300} textAlign="center" gap={1}>
        <Typography variant="subtitle1" color="text.secondary">
          {t('Alternatively, open any authenticator app and enter this code:')}
        </Typography>
        <Typography
          variant="mono"
          color="text.primary"
          role="button"
          sx={{ cursor: 'pointer' }}
          onClick={() => {
            navigator.clipboard.writeText(totpChallenge.totpSecret);
            toast.success(t('Code copied to clipboard'));
          }}
        >
          {totpChallenge.totpSecret}
        </Typography>
      </Stack>
      <Button onClick={onNext}>{t('Next')}</Button>
    </Stack>
  );
};
