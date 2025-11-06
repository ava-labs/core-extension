import { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { DeFiCommonContent } from './DeFiCommonContent';
import { CORE_WEB_BASE_URL } from '@/config/constants';

export const DeFiZeroState: FC = () => {
  const { t } = useTranslation();

  const content = useMemo(
    () => ({
      icon: '📊',
      title: t('No DeFi positions found'),
      description: t(
        'Discover lending, staking, pooling, and other DeFi apps built on the Avalanche ecosystem',
      ),
      buttonLabel: t('Explore DeFi'),
      onClick: navigateToExploreDeFi,
    }),
    [t],
  );

  return <DeFiCommonContent {...content} />;
};

const navigateToExploreDeFi = () => {
  window.open(`${CORE_WEB_BASE_URL}/discover`, '_blank');
};
