import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { InProgress } from '../../InProgress';
import { StageProps } from '../types';
import { OmniViewPage } from './OmniViewPage';

export const LoadingState: FC<StageProps> = ({ fullscreen }) => {
  const { t } = useTranslation();

  return (
    <OmniViewPage fullscreen={fullscreen}>
      <InProgress textSize="body1" loaderSize={48}>
        {t('Loading export request state...')}
      </InProgress>
    </OmniViewPage>
  );
};
