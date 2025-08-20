import {
  FullscreenModal,
  FullscreenModalContent,
  FullscreenModalProps,
} from '@/components/FullscreenModal';
import { Page } from '@/components/Page';
import { CircularProgress, Stack, Typography } from '@avalabs/k2-alpine';
import { ContextContainer } from '@core/types';
import { isSpecificContextContainer } from '@core/ui';
import { FC, Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { StageProps } from '../types';

export const LoadingState: FC<StageProps> = () => {
  const { t } = useTranslation();
  const isFullscreen = isSpecificContextContainer(ContextContainer.FULLSCREEN);

  const PageContainer = isFullscreen ? FullscreenModal : Page;
  const PageContent = isFullscreen ? FullscreenModalContent : Fragment;
  const props = (
    isFullscreen ? { open: true, withCoreLogo: true, withAppInfo: true } : {}
  ) as FullscreenModalProps;

  return (
    <PageContainer {...props}>
      <PageContent>
        <Stack width={1} height={1} justifyContent="center" alignItems="center">
          <CircularProgress />
          <Typography variant="body1">
            {t('Loading export request state...')}
          </Typography>
        </Stack>
      </PageContent>
    </PageContainer>
  );
};
