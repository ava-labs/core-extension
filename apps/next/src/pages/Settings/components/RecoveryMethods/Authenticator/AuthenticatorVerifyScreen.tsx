import { Button, Stack, toast, Typography, useTheme } from '@avalabs/k2-alpine';
import QRCode from 'qrcode.react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export const AuthenticatorVerifyScreen = ({ totpChallenge }) => {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <div>
      <QRCode
        renderAs="svg"
        fgColor={theme.palette.common.black}
        bgColor={theme.palette.common.white}
        value={totpChallenge.totpUrl}
        level="H"
        size={188}
      />
      <Button type="secondary" size="small">
        {t('Enter code manually')}
      </Button>
      {/* <Stack maxWidth={300} textAlign="center" gap={1}>
				<Typography variant="subtitle1" color="text.secondary">
					{t(
						'Alternatively, open any authenticator app and enter this code:',
					)}
				</Typography>
				<Typography
					variant="mono"
					color="text.primary"
					role="button"
					sx={{ cursor: 'pointer' }}
					onClick={() => {
						navigator.clipboard.writeText(totpSecret);
						toast.success(t('Code copied to clipboard'));
					}}
				>
					{totpSecret}
				</Typography>
			</Stack> */}
    </div>
  );
};
