import { ComponentProps, FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Collapse, Stack, styled } from '@avalabs/k2-alpine';

import { useOnline, WalletContextProviderProps } from '@core/ui';

// import { CoreSplash } from '@/components/CoreSplash';
import { WarningMessage } from '@/components/WarningMessage';

import { ForgotPassword } from './components/ForgotPassword';
import { PageTopBar } from '../../components/PageTopBar';
import { Unlock } from './components/Unlock';
import { UserAvatar } from './components/UserAvatar';
import { CoreSplashStatic } from '@/components/CoreSplashStatic';
import { SlideUpDialog } from '@/components/Dialog';

type Props = {
  unlockWallet: ComponentProps<
    WalletContextProviderProps['LockedComponent']
  >['unlockWallet'];
};

const Root = styled(Stack)({
  container: 'root / size',

  width: '100%',
  height: '100%',

  flexDirection: 'column',
  alignItems: 'center',
});

// const CenteredCoreSplash = styled(CoreSplash)({
//   marginBlock: 'auto',
// });

export const LockScreen: FC<Props> = ({ unlockWallet }) => {
  const { t } = useTranslation();
  const { isOnline } = useOnline();
  const [showUnlockForm, setShowUnlockForm] = useState<boolean>(false);
  const [showForgotPassword, setShowForgotPassword] = useState<boolean>(false);

  const showForgotPasswordModal = () => setShowForgotPassword(true);
  const hideForgotPasswordModal = () => setShowForgotPassword(false);

  const isUIReady = isOnline && showUnlockForm;

  // TODO: Add back the animated logo once the background is fixed
  const ANIMATION_DURATION = 1000;
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowUnlockForm(true);
    }, ANIMATION_DURATION);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Root>
      <PageTopBar onBackClicked={hideForgotPasswordModal} />

      {/* TODO: Add back the animated logo once the background is fixed
      <CenteredCoreSplash onGifEnd={() => setShowUnlockForm(true)} /> */}

      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        paddingY={2}
        marginBlock="auto"
      >
        <CoreSplashStatic height="35px" />
      </Box>

      <UserAvatar faded={!isOnline} suppressMargin={isUIReady} />

      {!isOnline && (
        <WarningMessage padding="20px" position="absolute" bottom={0}>
          {t(
            'Oops! It seems like you have no internet connection. Please try again later.',
          )}
        </WarningMessage>
      )}

      <Collapse in={isUIReady} mountOnEnter unmountOnExit>
        <Unlock
          onUnlock={unlockWallet}
          onForgotPasswordClick={showForgotPasswordModal}
        />
      </Collapse>

      <SlideUpDialog open={showForgotPassword}>
        <ForgotPassword
          open={showForgotPassword}
          onCancel={hideForgotPasswordModal}
          onConfirm={hideForgotPasswordModal}
        />
      </SlideUpDialog>
    </Root>
  );
};
