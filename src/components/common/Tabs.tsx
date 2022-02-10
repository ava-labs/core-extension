import {
  HorizontalFlex,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import { ReactNode, useState } from 'react';
import styled from 'styled-components';

const Tab = styled.button<{ selected?: boolean }>`
  border: none;
  background: transparent;
  width: 50%;
  cursor: pointer;
  padding: 8px 16px;
  border-bottom: ${({ selected, theme }) =>
    selected ? `2px solid ${theme.colors.text1}` : '2px solid transparent'}; ;
`;

const TabsContainer = styled(HorizontalFlex)`
  border-bottom: ${({ theme }) => `1px solid ${theme.separator.color}`};
  justify-content: center;
  align-items: center;
  margin: 0 0 8px;
  padding: 0 16px 0 16px;
`;

const TabLabel = styled(Typography)<{ selected: boolean }>`
  font-size: 14px;
  line-height: 17px;
  font-weight: ${({ selected }) => (selected ? '500' : '400')};
  color: ${({ theme, selected }) =>
    selected ? theme.colors.text1 : theme.colors.text2};

  &:hover {
    color: ${({ theme }) => theme.colors.text1};
  }
`;

interface TabsProps {
  tabs: {
    title: string;
    id: string;
    component: ReactNode;
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
              onClick={() => setSelectedTab(tab.id)}
            >
              <TabLabel selected={selectedTab === tab.id}>{tab.title}</TabLabel>
            </Tab>
          ))}
        </TabsContainer>
      </VerticalFlex>
      {tabs.find((tab) => tab.id === selectedTab)?.component}
    </>
  );
}
