import { useHistory } from 'react-router-dom';

import { FullscreenModal } from '@/components/FullscreenModal';
import { FullscreenAnimatedBackground } from '@/components/FullscreenAnimatedBackground';

import { ImportLedgerFlowContent } from './components/ImportLedgerFlowContent';

export const ImportLedgerFlow = () => {
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
        <ImportLedgerFlowContent />
      </FullscreenModal>
    </>
  );
};
