import { CoreSplash } from '@/components/CoreSplash';
import { styled, Stack, Collapse, toast } from '@avalabs/k2-alpine';
import { FC, useState } from 'react';
import { Unlock } from './components/Unlock';
import { ForgotPassword } from './components/ForgotPassword';
import { useOnline } from '@core/ui';
import { NavigationBar } from './components/NavigationBar';
import { WarningMessage } from '@/components/WarningMessage';
import { useTranslation } from 'react-i18next';
import { UserAvatar } from './components/UserAvatar';

type Props = {
  unlockWallet(password: string): Promise<void>;
};

const Root = styled(Stack)({
  container: 'root / size',

  width: '100%',
  height: '100%',

  flexDirection: 'column',
  alignItems: 'center',
});

const CenteredCoreSplash = styled(CoreSplash)({
  marginBlock: 'auto',
});

export const LockScreen: FC<Props> = ({ unlockWallet }) => {
  const { t } = useTranslation();
  const { isOnline } = useOnline();
  const [showUnlockForm, setShowUnlockForm] = useState<boolean>(false);
  const [showForgotPassword, setShowForgotPassword] = useState<boolean>(false);

  const showForgotPasswordModal = () => setShowForgotPassword(true);
  const hideForgotPasswordModal = () => setShowForgotPassword(false);

  const isUIReady = isOnline && showUnlockForm;

  return (
    <Root id="lock-screen">
      <NavigationBar
        showBack={showForgotPassword}
        onBackClicked={hideForgotPasswordModal}
      />
      <CenteredCoreSplash onGifEnd={() => setShowUnlockForm(true)} />
      <UserAvatar faded={!isOnline} suppressMargin={isUIReady} />

      {!isOnline && (
        <WarningMessage padding="20px" position="absolute" bottom={0}>
          {t(
            'Oops! It seems like you have no internet connection. Please try again later.',
          )}
        </WarningMessage>
      )}

      <Collapse in={isUIReady}>
        <Unlock
          onUnlock={unlockWallet}
          onForgotPasswordClick={showForgotPasswordModal}
        />
      </Collapse>

      <ForgotPassword
        open={showForgotPassword}
        onCancel={hideForgotPasswordModal}
        onConfirm={() => {
          toast.success(t('Password reset confirmed'));
          hideForgotPasswordModal();
        }}
      />
    </Root>
  );
};
