import type { CoreTheme } from '@avalabs/k2-alpine';
import type { ViewMode } from '@core/types';
import FloatingDark from './Floating.dark.svg';
import FloatingLight from './Floating.light.svg';
import SidebarDark from './Sidebar.dark.svg';
import SidebarLight from './Sidebar.light.svg';

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
