import { Slide } from '@avalabs/k2-alpine';
import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { useOpenFullscreen } from '../../hooks/useOpenFullscreen';
import { StageProps } from '../../types';
import { OmniViewPage } from '../OmniViewPage';
import { ExitConfirmation } from './components/ExitConfirmation';
import { ExportedMnemonic } from './components/ExportedMnemonic';

export const Exported: FC<StageProps> = ({ mnemonic, fullscreen }) => {
  useOpenFullscreen();
  const { t } = useTranslation();
  const { replace } = useHistory();
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);

  const goToSettings = async () => {
    replace('/settings');
    window.close();
  };

  return (
    <OmniViewPage
      fullscreen={fullscreen}
      title={t('Recovery phrase')}
      description={
        showExitConfirmation
          ? t(
              'You are about to exit the recovery phrase export process. Are you sure you want to exit?',
            )
          : t(
              'This phrase is your access key to your wallet. Carefully write it down and store it in a safe location',
            )
      }
    >
      <Slide
        in={!showExitConfirmation}
        appear={false}
        exit={false}
        mountOnEnter
        unmountOnExit
        direction="up"
      >
        <ExportedMnemonic
          mnemonic={mnemonic}
          onExit={() => setShowExitConfirmation(true)}
          fullscreen={fullscreen}
        />
      </Slide>

      <Slide
        in={showExitConfirmation}
        mountOnEnter
        unmountOnExit
        direction="up"
      >
        <ExitConfirmation
          fullscreen={fullscreen}
          onExit={goToSettings}
          onBack={() => setShowExitConfirmation(false)}
        />
      </Slide>
    </OmniViewPage>
  );
};
