import {
  Tab as ReactTab,
  Tabs as ReactTabs,
  TabList as ReactTabList,
  TabPanel as ReactTabPanel,
} from 'react-tabs';
import styled from 'styled-components';

/**
 * The $ in front of the variable allows you to use boolean
 * as a value, otherwise react freaks out
 *
 * @link https://styled-components.com/docs/api#transient-props
 */
export const Tab = styled(ReactTab)<{
  $highlight: boolean;
  margin?: string;
}>`
  margin: ${({ margin }) => margin ?? '0px 16px 8px 0'};
  color: ${({ theme }) => theme.colors.text1};
  cursor: pointer;
  ${({ theme, $highlight = true }) => {
    return $highlight
      ? `&[aria-selected='true'] {
            position: relative;
            &::after {
              content: '';
              position: absolute;
              height: 2px;
              left: 0;
              right: 0;
              bottom: -8px;
              background-color: ${theme.colors.primary1};
            }
          }`
      : '';
  }}

  &:not([aria-selected='true']) {
    color: ${({ theme }) => theme.colors.text2};

    &:hover {
      color: ${({ theme }) => theme.colors.text1};
    }
  }
`;
export const Tabs = styled(ReactTabs)<{
  grow: string;
}>`
  width: 100%;
  display: flex;
  flex-direction: column;
  ${({ grow }) => `flex-grow: ${grow};`}
`;
export const TabList = styled(ReactTabList)<{
  $border: boolean;
}>`
  display: flex;
  ${({ $border = true, theme }) => {
    return $border
      ? `
      border-bottom: solid 1px ${theme.separator.color};
      padding-bottom: 10px;
      margin-bottom: 5px;
      `
      : '';
  }}
`;

export const TabPanel = styled(ReactTabPanel)<{
  // only applied when the tab is selected to prevent the hidden tab to take up space
  grow: string;
}>`
  display: flex;
  flex-direction: column;

  &.react-tabs__tab-panel--selected {
    ${({ grow }) => `flex-grow: ${grow};`}
  }
`;
