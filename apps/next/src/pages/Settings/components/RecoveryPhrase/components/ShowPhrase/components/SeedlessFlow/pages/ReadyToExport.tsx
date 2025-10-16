import {
  FullscreenModal,
  FullscreenModalContent,
  FullscreenModalTitle,
} from '@/components/FullscreenModal';
import { WarningMessage } from '@/components/WarningMessage';
import { Button } from '@avalabs/k2-alpine';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useOpenFullscreen } from '../hooks/useOpenFullscreen';
import { StageProps } from '../types';

export const ReadyToExport: FC<StageProps> = ({
  completeExport,
  fullscreen,
}) => {
  useOpenFullscreen();
  const { t } = useTranslation();

  return (
    <FullscreenModal open withCoreLogo withAppInfo>
      <FullscreenModalTitle>
        {t('Your recovery phrase is ready')}
      </FullscreenModalTitle>
      <FullscreenModalContent pb={4}>
        <WarningMessage my="auto">
          {t(
            'Do not share this phrase with anyone! These words can be used to steal all your accounts.',
          )}
        </WarningMessage>
        <Button
          size={fullscreen ? 'large' : 'extension'}
          variant="contained"
          color="secondary"
          onClick={completeExport}
          fullWidth
          sx={{ mt: 'auto' }}
        >
          {t('Decrypt Recovery Phrase')}
        </Button>
      </FullscreenModalContent>
    </FullscreenModal>
  );
};
