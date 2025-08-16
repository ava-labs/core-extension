import { useTheme } from '@avalabs/k2-alpine';
import QRCode from 'qrcode.react';

export const AuthenticatorVerifyScreen = ({ totpChallenge }) => {
  const theme = useTheme();
  return (
    <div>
      <h1>Authenticator Verify Screen</h1>
      <QRCode
        renderAs="svg"
        fgColor={theme.palette.common.black}
        bgColor={theme.palette.common.white}
        value={totpChallenge.totpUrl}
        level="H"
        size={188}
      />
    </div>
  );
};
