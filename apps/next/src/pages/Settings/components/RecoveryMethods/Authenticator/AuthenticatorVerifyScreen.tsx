import { Button, Stack, useTheme } from '@avalabs/k2-alpine';
import QRCode from 'qrcode.react';
import { useTranslation } from 'react-i18next';

export const AuthenticatorVerifyScreen = ({
  totpChallenge,
  onShowSecret,
  onNext,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Stack
      alignItems="center"
      justifyContent="space-between"
      height="100%"
      width="100%"
    >
      <Stack gap={4} mt={4}>
        <QRCode
          renderAs="svg"
          fgColor={theme.palette.common.black}
          bgColor={theme.palette.common.white}
          value={totpChallenge.totpUrl}
          level="H"
          size={188}
        />
        <Stack maxWidth={300} textAlign="center" gap={1}>
          <Button
            color="secondary"
            variant="contained"
            size="small"
            onClick={onShowSecret}
          >
            {t('Enter code manually')}
          </Button>
        </Stack>
      </Stack>
      <Button onClick={onNext} color="primary" variant="contained" fullWidth>
        {t('Next')}
      </Button>
    </Stack>
  );
};
