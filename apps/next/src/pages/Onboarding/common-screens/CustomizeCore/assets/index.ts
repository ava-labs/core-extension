import type { CoreTheme } from '@avalabs/k2-alpine';
import type { ViewMode } from '@core/types';
import FloatingDark from './floating.dark.svg';
import FloatingLight from './floating.light.svg';
import SidebarDark from './sidebar.dark.svg';
import SidebarLight from './sidebar.light.svg';

export const assets: Record<CoreTheme, Record<ViewMode, string>> = {
  light: {
    floating: FloatingLight,
    sidebar: SidebarLight,
  },
  dark: {
    floating: FloatingDark,
    sidebar: SidebarDark,
  },
  testnet: {
    floating: FloatingDark,
    sidebar: SidebarDark,
  },
};
