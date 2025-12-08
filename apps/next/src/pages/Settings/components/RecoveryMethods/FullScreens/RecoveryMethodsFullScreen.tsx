import { useHistory, useLocation, useParams } from 'react-router-dom';

import { FullscreenModal } from '@/components/FullscreenModal';
import { FullscreenAnimatedBackground } from '@/components/FullscreenAnimatedBackground';

import { FullScreenContent } from './FullScreenContent';
import { useOpenApp } from '@/hooks/useOpenApp';

export interface RecoveryMethodsFullScreenParams {
  mfaType?: 'totp' | 'fido';
  keyType?: 'yubikey' | 'passkey';
  action?: 'remove' | 'add';
}

export const RecoveryMethodsFullScreen = () => {
  const history = useHistory();

  const homeURL = '/update-recovery-method';
  const location = useLocation();
  const openApp = useOpenApp();

  const { mfaType, action, keyType } =
    useParams<RecoveryMethodsFullScreenParams>();

  return (
    <>
      <FullscreenAnimatedBackground sx={{ backgroundSize: '80% 60%' }} />
      <FullscreenModal
        open
        withCoreLogo
        withAppInfo
        withLanguageSelector
        onBack={async () => {
          if (location.pathname === homeURL) {
            openApp({ closeWindow: false });
          }
          history.push(homeURL);
        }}
      >
        <FullScreenContent
          mfaType={mfaType}
          action={action}
          keyType={keyType}
        />
      </FullscreenModal>
    </>
  );
};
