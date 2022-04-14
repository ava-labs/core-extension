import {
  HorizontalFlex,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import { ReactNode, useState } from 'react';
import styled from 'styled-components';

const TabsContainer = styled(HorizontalFlex)`
  border-bottom: ${({ theme }) => `1px solid ${theme.separator.color}`};
  justify-content: center;
  align-items: center;
  margin: 0 0 8px;
  padding: 0 16px 0 16px;
`;

const TabLabel = styled(Typography)<{ selected: boolean }>`
  position: relative;
  font-size: 14px;
  line-height: 17px;
  font-weight: ${({ selected }) => (selected ? '500' : '400')};
  color: ${({ theme, selected }) =>
    selected ? theme.colors.text1 : theme.colors.text2};
`;

const Tab = styled.button<{ selected?: boolean }>`
  border: none;
  background: transparent;
  width: 50%;
  cursor: pointer;
  padding: 8px 16px;
  border-bottom: ${({ selected, theme }) =>
    selected ? `2px solid ${theme.colors.text1}` : '2px solid transparent'};
  &:hover {
    & > ${TabLabel} {
      color: ${({ theme }) => theme.colors.text1};
    }
  }
`;

const Badge = styled(Typography)`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  top: -8px;
  right: -14px;
  font-size: 10px;
  line-height: 1;
  min-width: 18px;
  min-height: 18px;
  font-weight: 600;
  padding: 2px;
  border-radius: 999px;
  margin-left: 16px;
  border: ${({ theme }) => `2px solid ${theme.colors.bg1}`};
  background-color: ${({ theme }) => theme.colors.primary1};
`;

interface TabsProps {
  tabs: {
    title: string;
    id: string;
    component: ReactNode;
    badgeAmount?: number;
    onClick?: () => void;
  }[];
  margin?: string;
}

export function Tabs({ tabs, margin }: TabsProps) {
  const [selectedTab, setSelectedTab] = useState<string>(tabs[0]?.id ?? '');

  return (
    <>
      <VerticalFlex margin={margin}>
        <TabsContainer>
          {tabs.map((tab) => (
            <Tab
              key={tab.id}
              selected={selectedTab === tab.id}
              onClick={() => {
                setSelectedTab(tab.id);
                tab.onClick && tab.onClick();
              }}
            >
              <TabLabel selected={selectedTab === tab.id}>
                {tab.title}
                {Number(tab.badgeAmount) > 0 && (
                  <Badge>{tab.badgeAmount}</Badge>
                )}
              </TabLabel>
            </Tab>
          ))}
        </TabsContainer>
      </VerticalFlex>
      {tabs.find((tab) => tab.id === selectedTab)?.component}
    </>
  );
}
