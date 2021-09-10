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
}>`
  margin-right: 10px;
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  ${({ theme, $highlight = true }) => {
    return $highlight
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
  $border: boolean;
}>`
  display: flex;
  ${({ $border = true, theme }) => {
    return $border
      ? `
      border-bottom: solid 1px ${theme.colors.grey[300]};
      padding-bottom: 5px;
      margin-bottom: 5px;
      `
      : '';
  }}
`;
export const TabPanel = styled(ReactTabPanel)``;
