import { ComponentProps, FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Collapse, Stack, styled } from '@avalabs/k2-alpine';

import { useOnline, WalletContextProviderProps } from '@core/ui';

import { CoreSplash } from '@/components/CoreSplash';
import { WarningMessage } from '@/components/WarningMessage';

import { ForgotPassword } from './components/ForgotPassword';
import { PageTopBar } from '../../components/PageTopBar';
import { Unlock } from './components/Unlock';
import { UserAvatar } from './components/UserAvatar';

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
    <Root>
      <PageTopBar onBackClicked={hideForgotPasswordModal} />
      <CenteredCoreSplash onGifEnd={() => setShowUnlockForm(true)} />
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

      <ForgotPassword
        open={showForgotPassword}
        onCancel={hideForgotPasswordModal}
        onConfirm={hideForgotPasswordModal}
      />
    </Root>
  );
};
