import { FC, useMemo } from 'react';

import { useTranslation } from 'react-i18next';

import { DeFiCommonContent } from './DeFiCommonContent';

export const DeFiErrorState: FC = () => {
  const { t } = useTranslation();

  const content = useMemo(
    () => ({
      icon: '😩',
      title: t('Oops! \n Something went wrong'),
      description: t('Please hit refresh or try again later'),
      buttonLabel: t('Refresh'),
      onClick: refresh,
    }),
    [t],
  );
  return <DeFiCommonContent {...content} />;
};

const refresh = () => {
  window.location.reload();
};
