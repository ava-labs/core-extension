import { useHistory, useParams } from 'react-router-dom';

import { FullscreenModal } from '@/components/FullscreenModal';
import { FullscreenAnimatedBackground } from '@/components/FullscreenAnimatedBackground';

import { FullScreenContent } from './FullScreenContent';

export interface RecoveryMethodsFullScreenParams {
  mfaType?: 'totp' | 'fido';
  keyType?: 'yubikey' | 'passkey';
  action?: 'remove' | 'add';
}

export const RecoveryMethodsFullScreen = () => {
  const history = useHistory();
  const { mfaType, action, keyType } =
    useParams<RecoveryMethodsFullScreenParams>();
  console.log('mfaType: ', mfaType);
  console.log('action: ', action);

  return (
    <>
      <FullscreenAnimatedBackground sx={{ backgroundSize: '80% 60%' }} />
      <FullscreenModal
        open
        withCoreLogo
        withAppInfo
        withLanguageSelector
        onBack={history.goBack}
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
