import { Tab, TabMenu } from '@/components/TabMenu';
import { FC } from 'react';

export type TabName = 'assets' | 'collectibles' | 'defi' | 'activity';

type Props = {
  active: TabName;
  onChange: (tab: TabName) => void;
};

export const NavigationBar: FC<Props> = ({ active, onChange }) => {
  return (
    <TabMenu
      size="small"
      value={active}
      onChange={(_, value) => onChange(value)}
    >
      <Tab label="Assets" value={'assets' satisfies TabName} />
      <Tab label="Collectibles" value={'collectibles' satisfies TabName} />
      <Tab label="DeFi" value={'defi' satisfies TabName} />
      <Tab label="Activity" value={'activity' satisfies TabName} />
    </TabMenu>
  );
};

export default NavigationBar;
