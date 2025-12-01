import { TabsContainer } from '@/pages/Portfolio/components/PortfolioHome/styled';
import { styled, TabBar, TabBarItemProps } from '@avalabs/k2-alpine';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
export type TabName = 'assets' | 'activity';

// Custom TabBar where both tabs take 50% width (accounting for gap)
const XPChainTabBar = styled(TabBar)(({ theme }) => ({
  '& .MuiTabs-flexContainer': {
    gap: theme.spacing(1),
    width: '100%',
  },
  '& .MuiTab-root': {
    flex: `1 1 calc(50% - ${theme.spacing(0.5)})`,
    minWidth: `calc(50% - ${theme.spacing(0.5)})`,
    maxWidth: `calc(50% - ${theme.spacing(0.5)})`,
    width: `calc(50% - ${theme.spacing(0.5)})`,
  },
}));

type Props = {
  activeTab: TabName;
  setActiveTab: (tab: TabName) => void;
};

export const XPChainsTabs: FC<Props> = ({ activeTab, setActiveTab }) => {
  const { t } = useTranslation();

  const TABS: TabBarItemProps[] = [
    {
      id: 'assets',
      label: t('Assets'),
    },
    {
      id: 'activity',
      label: t('Activity'),
    },
  ];

  return (
    <TabsContainer>
      <XPChainTabBar
        tabBarItems={TABS}
        value={activeTab}
        onChange={(_, val) => setActiveTab(val)}
        size="extension"
      />
    </TabsContainer>
  );
};
