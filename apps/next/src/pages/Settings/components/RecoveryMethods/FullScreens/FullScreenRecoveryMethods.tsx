import { useHistory } from 'react-router-dom';

import { FullscreenModal } from '@/components/FullscreenModal';
import { FullscreenAnimatedBackground } from '@/components/FullscreenAnimatedBackground';

import { FullScreenContent } from './FullScreenContent';

export const FullScreenRecoveryMethods = () => {
  const history = useHistory();

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
        <FullScreenContent />
      </FullscreenModal>
    </>
  );
};
