import { Box, IconButton } from '@avalabs/k2-alpine';
import { ContextContainer } from '@core/types';
import { isSpecificContextContainer } from '@core/ui';
import { FC, MouseEventHandler } from 'react';
import DockToLeft from './DockToLeft.svg';

const viewInSidePanel = async () => {
  const currentWindow = await chrome.windows.getCurrent({ populate: true });
  if (currentWindow?.id) {
    await chrome.sidePanel.open({
      windowId: currentWindow.id,
    });
  }
};

const viewInPopup = async () => {
  await chrome.action.openPopup({});
};

const onSwitchClicked: MouseEventHandler = async () => {
  const isSidePanel = isSpecificContextContainer(ContextContainer.SIDE_PANEL);
  window.close();
  if (isSidePanel) {
    await viewInPopup();
  } else {
    await viewInSidePanel();
  }
};

export const ViewContainerSwitch: FC = () => {
  return (
    <Box
      position="fixed"
      top={17}
      right={10}
      width={24}
      height={24}
      zIndex={9999}
    >
      <IconButton size="small" onClick={onSwitchClicked} color="secondary">
        <img src={DockToLeft} alt="Dock to left" />
      </IconButton>
    </Box>
  );
};
