import { TabsContainer } from '@/pages/Portfolio/components/PortfolioHome/styled';
import {
  styled,
  TabBar,
  TabBarItemProps,
  tabClasses,
  tabsClasses,
} from '@avalabs/k2-alpine';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
export type TabName = 'assets' | 'activity';

// Custom TabBar where both tabs take 50% width (accounting for gap)
const XPChainTabBar = styled(TabBar)(({ theme }) => ({
  [`.${tabsClasses.list}`]: {
    gap: theme.spacing(1),
    display: 'grid',
    gridAutoFlow: 'column',
    gridAutoColumns: '1fr',

    [`.${tabClasses.root}`]: {
      maxWidth: 'unset',
      width: '100%',
    },
  },
}));

const StyledTabsContainer = styled(TabsContainer)(({ theme }) => ({
  marginBottom: theme.spacing(-1.75),
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
    <StyledTabsContainer>
      <XPChainTabBar
        tabBarItems={TABS}
        value={activeTab}
        onChange={(_, val) => setActiveTab(val)}
        size="extension"
      />
    </StyledTabsContainer>
  );
};
