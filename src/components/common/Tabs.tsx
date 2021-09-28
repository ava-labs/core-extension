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
  margin: ${({ margin }) => margin ?? '0 16px 0 0'};
  color: ${({ theme }) => theme.colors.text};
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
              bottom: -11px;
              background-color: ${theme.colors.primary[500]};
            }
          }`
      : '';
  }}

  &:not([aria-selected='true']) {
    color: ${({ theme }) => theme.colors.textAccent};

    &:hover {
      color: ${({ theme }) => theme.colors.text};
    }
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
      border-bottom: solid 1px ${theme.separator.color};
      padding-bottom: 10px;
      margin-bottom: 5px;
      `
      : '';
  }}
`;
export const TabPanel = styled(ReactTabPanel)``;
