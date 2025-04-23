import { useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import {
  Button,
  Card,
  CardActionArea,
  CopyIcon,
  QRCodeIcon,
  Skeleton,
  Stack,
  Typography,
  toast,
  useTheme,
} from '@avalabs/core-k2-components';
import QRCode from 'qrcode.react';

import { PageTitle } from 'packages/ui/src/components/common/PageTitle';

enum Screen {
  Scan = 'scan',
  Manual = 'manual',
  LearnMore = 'learn-more',
}

export const AuthenticatorVerifyScreen = ({
  onBackClick,
  onNextClick,
  totpChallenge,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const [screen, setScreen] = useState(Screen.Scan);

  const totpSecret = useMemo(() => {
    if (!totpChallenge) {
      return '';
    }

    return new URL(totpChallenge.totpUrl).searchParams.get('secret') ?? '';
  }, [totpChallenge]);

  return (
    <>
      <PageTitle
        onBackClick={() => {
          if (screen === Screen.Scan) {
            onBackClick();
          } else {
            setScreen(Screen.Scan);
          }
        }}
      >
        {screen === Screen.Scan
          ? t('Scan QR Code')
          : screen === Screen.Manual
            ? t('Authenticator Setup')
            : t('Learn more')}
      </PageTitle>
      <Stack
        sx={{
          width: 1,
          gap: 2,
          flexGrow: 1,
          alignItems: 'center',
          px: 2,
        }}
      >
        {screen === Screen.Scan && (
          <>
            <Typography variant="body1">
              <Trans
                i18nKey="Use any <b>authenticator app</b> to scan the QR code. Or enter code manually."
                components={{ b: <b /> }}
              />
            </Typography>
            <Stack sx={{ py: 1 }}>
              {totpChallenge ? (
                <QRCode
                  renderAs="svg"
                  fgColor={theme.palette.common.black}
                  bgColor={theme.palette.common.white}
                  value={totpChallenge.totpUrl}
                  level="H"
                  size={188}
                />
              ) : (
                <Skeleton
                  variant="rectangular"
                  sx={{ width: 188, height: 188 }}
                />
              )}
            </Stack>
            <Stack sx={{ width: 1, mt: 2 }}>
              <DividerWithLabel>{t('Or')}</DividerWithLabel>
            </Stack>
            <Button variant="text" onClick={() => setScreen(Screen.Manual)}>
              {t('Enter Code Manually')}
            </Button>
          </>
        )}
        {totpChallenge && screen === Screen.Manual && (
          <>
            <Typography variant="body1">
              <Trans
                i18nKey="Open any <b>authenticator app</b> and enter the code found below."
                components={{ b: <b /> }}
              />
            </Typography>
            <Stack direction="row" sx={{ gap: 0.25, width: 1 }}>
              <Typography variant="body1" component="span">
                {t('Or click Scan QR Code.')}
              </Typography>
              <Button
                variant="text"
                disableRipple
                sx={{ p: 0, fontSize: theme.typography.body1.fontSize }}
                onClick={() => {
                  setScreen(Screen.LearnMore);
                }}
              >
                {t('Learn more.')}
              </Button>
            </Stack>
            <Card sx={{ backgroundColor: 'grey.900', mx: 1 }}>
              <CardActionArea
                sx={{ px: 2, py: 2 }}
                onClick={() => {
                  navigator.clipboard.writeText(totpSecret);
                  toast.success(t('Copied!'), { duration: 1500 });
                }}
              >
                <Stack
                  direction="row"
                  sx={{ alignItems: 'flex-start', gap: 2 }}
                >
                  <CopyIcon size={20} sx={{ flexShrink: 0, pt: 0.25 }} />
                  <Stack sx={{ gap: 1 }}>
                    <Typography
                      variant="button"
                      sx={{ fontSize: theme.typography.body2.fontSize }}
                    >
                      {t('Copy Code')}
                    </Typography>
                    <Typography variant="h6" sx={{ wordBreak: 'break-all' }}>
                      {totpSecret}
                    </Typography>
                  </Stack>
                </Stack>
              </CardActionArea>
            </Card>
            <Card sx={{ backgroundColor: 'grey.900', mx: 1 }}>
              <CardActionArea
                sx={{ px: 2, py: 2 }}
                onClick={() => {
                  setScreen(Screen.Scan);
                }}
              >
                <Stack
                  direction="row"
                  sx={{ alignItems: 'flex-start', gap: 2 }}
                >
                  <QRCodeIcon size={20} sx={{ flexShrink: 0, pt: 0.25 }} />
                  <Stack sx={{ gap: 1 }}>
                    <Typography
                      variant="button"
                      sx={{ fontSize: theme.typography.body2.fontSize }}
                    >
                      {t('Scan QR Code Code')}
                    </Typography>
                    <Typography variant="h6">
                      {t('View QR code to scan with your authenticator app.')}
                    </Typography>
                  </Stack>
                </Stack>
              </CardActionArea>
            </Card>
          </>
        )}
        {screen === Screen.LearnMore && (
          <>
            <Typography variant="body1">
              <Trans
                i18nKey="Open any <b>authenticator app</b> and enter the code found below."
                components={{ b: <b /> }}
              />
            </Typography>
            <Card sx={{ backgroundColor: 'grey.900', mx: 1 }}>
              <CardActionArea
                sx={{ px: 2, py: 2 }}
                onClick={() => {
                  navigator.clipboard.writeText(totpSecret);
                  toast.success(t('Copied!'), { duration: 1500 });
                }}
              >
                <Stack
                  direction="row"
                  sx={{ alignItems: 'flex-start', gap: 2 }}
                >
                  <CopyIcon size={20} sx={{ flexShrink: 0, pt: 0.25 }} />
                  <Stack sx={{ gap: 1 }}>
                    <Typography
                      variant="button"
                      sx={{ fontSize: theme.typography.body2.fontSize }}
                    >
                      {t('Copy Code')}
                    </Typography>
                    <Typography variant="h6" sx={{ wordBreak: 'break-all' }}>
                      {totpSecret}
                    </Typography>
                  </Stack>
                </Stack>
              </CardActionArea>
            </Card>
            <Typography variant="body1">
              <Trans
                i18nKey="If using Google Authenticator, make sure that <b>Time based</b> is selected."
                components={{ b: <b /> }}
              />
            </Typography>
            <Typography variant="body1">
              <Trans
                i18nKey="If using Microsoft Authenticator, click <b>Add Account</b>."
                components={{ b: <b /> }}
              />
            </Typography>
            <Typography variant="body1">
              <Trans
                i18nKey="If using Authenticator App, click the <b>+</b> to add account."
                components={{ b: <b /> }}
              />
            </Typography>
          </>
        )}
      </Stack>
      <Stack
        sx={{
          width: 1,
          px: 2,
          py: 3,
        }}
      >
        <Button color="primary" size="large" onClick={onNextClick}>
          {t('Next')}
        </Button>
      </Stack>
    </>
  );
};

const DividerWithLabel = (props) => (
  <Typography
    variant="h5"
    color="text.tertiary"
    sx={{
      transform: 'translateY(-16px)',
      px: 3,
      alignSelf: 'center',
      position: 'relative',

      '&::after, &::before': {
        content: '""',
        position: 'absolute',
        width: '120px',
        borderBottom: '2px solid',
        borderBottomColor: 'grey.800',
      },
      '&::after': {
        right: 0,
        transform: 'translate(100%, 14px)',
      },
      '&::before': {
        left: 0,
        transform: 'translate(-100%, 14px)',
      },
    }}
    component="span"
    {...props}
  />
);
