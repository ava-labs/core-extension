import {
  Box,
  SidebarDockIcon,
  SidebarIcon,
  SidebarUndockIcon,
  styled,
} from '@avalabs/k2-alpine';
import { ContextContainer } from '@core/types';
import {
  isSpecificContextContainer,
  useAnalyticsContext,
  useSettingsContext,
} from '@core/ui';
import { FC } from 'react';
import { MultiIconButton } from '../MultiIconButton';
import { switchTo } from './utils';

const FixedRoot = styled(Box)(({ theme }) => ({
  position: 'fixed',
  top: theme.spacing(1.5),
  right: theme.spacing(1.5),
  zIndex: 9999,
}));

export const ViewModeSwitcher: FC = () => {
  const { setPreferredView } = useSettingsContext();
  const { capture } = useAnalyticsContext();
  const isSidePanel = isSpecificContextContainer(ContextContainer.SIDE_PANEL);

  const onClick = async () => {
    const requestedView = isSidePanel ? 'floating' : 'sidebar';
    setPreferredView(requestedView);
    capture('ViewModeSwitched', {
      viewMode: requestedView,
    });
    window.close();
    await switchTo[requestedView]();
  };

  const DockIcon = isSidePanel ? SidebarUndockIcon : SidebarDockIcon;

  return (
    <FixedRoot>
      <MultiIconButton
        icon={<SidebarIcon size={24} />}
        hoverIcon={<DockIcon size={24} />}
        size="medium"
        onClick={onClick}
        color="primary"
      />
    </FixedRoot>
  );
};
