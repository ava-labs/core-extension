import { Box, IconButton } from '@avalabs/k2-alpine';
import { ContextContainer } from '@core/types';
import { isSpecificContextContainer, useSettingsContext } from '@core/ui';
import { FC } from 'react';
import browser from 'webextension-polyfill';
import DockToLeft from './DockToLeft.svg';

const viewInSidePanel = async () => {
  const currentWindow = await browser.windows.getCurrent({ populate: true });
  if (currentWindow?.id) {
    await browser.sidePanel.open({
      windowId: currentWindow.id,
    });
  }
};

const viewInPopup = async () => {
  await browser.action.openPopup({});
};

export const ViewContainerSwitch: FC = () => {
  const { setPreferredView } = useSettingsContext();

  const onClick = async () => {
    const isSidePanel = isSpecificContextContainer(ContextContainer.SIDE_PANEL);
    setPreferredView(isSidePanel ? 'floating' : 'sidebar');
    window.close();
    if (isSidePanel) {
      await viewInPopup();
    } else {
      await viewInSidePanel();
    }
  };

  return (
    <Box
      position="fixed"
      top={17}
      right={10}
      width={24}
      height={24}
      zIndex={9999}
    >
      <IconButton size="small" onClick={onClick} color="primary">
        <img src={DockToLeft} alt="Dock to left" />
      </IconButton>
    </Box>
  );
};
