import {
  Tab as ReactTab,
  Tabs as ReactTabs,
  TabList as ReactTabList,
  TabPanel as ReactTabPanel,
} from 'react-tabs';
import styled from 'styled-components';

export const Tab = styled(ReactTab)<{
  showHighlight: boolean;
}>`
  margin-right: 10px;
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  ${({ theme, showHighlight = true }) => {
    return showHighlight
      ? `&[aria-selected='true'] {
            position: relative;
            &::after {
              content: '';
              position: absolute;
              height: 1px;
              left: 0;
              right: 0;
              bottom: -6px;
              background-color: ${theme.colors.secondary};
            }
          }`
      : '';
  }}

  &:not([aria-selected='true']) {
    color: ${({ theme }) => theme.colors.textAccent};
  }
`;
export const Tabs = styled(ReactTabs)`
  width: 100%;
`;
export const TabList = styled(ReactTabList)<{
  showBorder: boolean;
}>`
  display: flex;
  ${({ showBorder = true, theme }) => {
    return showBorder
      ? `
      border-bottom: solid 1px ${theme.colors.grey[300]};
      padding-bottom: 5px;
      margin-bottom: 5px;
      `
      : '';
  }}
`;
export const TabPanel = styled(ReactTabPanel)``;
