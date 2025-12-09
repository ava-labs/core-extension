import {
  SidebarDockIcon,
  SidebarIcon,
  SidebarUndockIcon,
} from '@avalabs/k2-alpine';
import { FC } from 'react';

import { ContextContainer } from '@core/types';
import {
  isSpecificContextContainer,
  useAnalyticsContext,
  useSettingsContext,
} from '@core/ui';

import { MultiIconButton } from '../MultiIconButton';
import { useOpenApp } from '@/hooks/useOpenApp';

export const ViewModeSwitcher: FC = () => {
  const { setPreferredView } = useSettingsContext();
  const { capture } = useAnalyticsContext();
  const isSidePanel = isSpecificContextContainer(ContextContainer.SIDE_PANEL);
  const openApp = useOpenApp();

  const DockIcon = isSidePanel ? SidebarUndockIcon : SidebarDockIcon;

  const onSidebarIconClick = async () => {
    const requestedView = isSidePanel ? 'floating' : 'sidebar';
    await setPreferredView(requestedView);
    capture('ViewModeSwitched', {
      viewMode: requestedView,
    });
    openApp({ closeWindow: true, viewMode: requestedView });
  };

  return (
    <MultiIconButton
      icon={<SidebarIcon size={24} />}
      hoverIcon={<DockIcon size={24} />}
      size="small"
      onClick={onSidebarIconClick}
      color="primary"
    />
  );
};
