import { CircularProgress, Stack, Typography } from '@avalabs/k2-alpine';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { StageProps } from '../types';
import { OmniViewPage } from './OmniViewPage';

export const LoadingState: FC<StageProps> = ({ fullscreen }) => {
  const { t } = useTranslation();

  return (
    <OmniViewPage fullscreen={fullscreen}>
      <Stack width={1} height={1} justifyContent="center" alignItems="center">
        <CircularProgress />
        <Typography variant="body1">
          {t('Loading export request state...')}
        </Typography>
      </Stack>
    </OmniViewPage>
  );
};
